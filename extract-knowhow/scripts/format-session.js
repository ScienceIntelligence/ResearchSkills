#!/usr/bin/env node
/**
 * format-session.js
 *
 * Preprocess a raw Claude Code or Codex .jsonl session file into
 * compact text optimized for research skill extraction.
 *
 * Supports both Claude Code and Codex JSONL formats.
 *
 * Design principle: We're extracting HUMAN tacit knowledge. The human's
 * inputs, corrections, and decisions are the signal. AI outputs and tool
 * mechanics are context at best, noise at worst.
 *
 * Optimizations:
 *   - Strip IDE context tags, slash commands, local commands from USER msgs
 *   - Mark context continuations as [CONTEXT] not USER
 *   - Drop git-related USER messages (commit/push instructions)
 *   - Extract tool_use parameters (file paths) → [Read field_equations.py]
 *   - ASSISTANT truncated to 80 chars (just enough for continuity)
 *   - Bash errors get more space (120), normal output less (60)
 *   - Git tool output dropped entirely
 *   - "rejected" preserved as high-value signal
 *   - Consecutive low-value tool lines collapsed/dropped
 */

'use strict';

const fs = require('fs');
const path = require('path');

const USER_MAX_CHARS = 1000;
const ASSISTANT_MAX_CHARS = 80;
const BASH_ERROR_MAX_CHARS = 120;
const BASH_NORMAL_MAX_CHARS = 60;
const SEGMENT_THRESHOLD = 200000;
const SEGMENT_SIZE = 100000;

function truncate(text, max) {
  if (!text) return '';
  const str = String(text);
  if (str.length <= max) return str;
  return str.substring(0, max) + '…';
}

function basename(filepath) {
  if (!filepath) return null;
  const parts = String(filepath).split('/');
  return parts[parts.length - 1] || null;
}

// ---------------------------------------------------------------------------
// Detect session format
// ---------------------------------------------------------------------------

function detectFormat(lines) {
  for (const line of lines.slice(0, 5)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const entry = JSON.parse(trimmed);
      if (entry.type === 'session_meta') return 'codex';
      if (entry.type === 'event_msg') return 'codex';
      if (entry.type === 'response_item') return 'codex';
      if (entry.type === 'turn_context') return 'codex';
      if (entry.type === 'user' || entry.type === 'assistant') return 'claude';
      if (entry.message && entry.message.role) return 'claude';
    } catch { continue; }
  }
  return 'claude'; // default fallback
}

// ---------------------------------------------------------------------------
// Pass 0: Parse JSONL into structured messages
// ---------------------------------------------------------------------------

// Extract tool_use params (file_path, command) for richer context — Claude Code
function extractToolInfo(item) {
  if (item.type !== 'tool_use' || !item.name) return null;
  const info = { name: item.name };
  const inp = item.input || {};
  if (inp.file_path) info.file = basename(inp.file_path);
  if (inp.command) info.cmd = truncate(inp.command, 60);
  if (inp.pattern) info.pattern = truncate(inp.pattern, 40);
  if (inp.prompt && item.name === 'Agent') info.desc = truncate(inp.description || inp.prompt, 40);
  return info;
}

function extractContentParts(content) {
  if (typeof content === 'string') return { parts: [content], toolInfos: [] };
  if (!Array.isArray(content)) return { parts: [], toolInfos: [] };
  const parts = [];
  const toolInfos = [];
  for (const item of content) {
    if (!item) continue;
    if (typeof item === 'string') {
      parts.push(item);
    } else if (
      (item.type === 'text' || item.type === 'input_text' || item.type === 'output_text') &&
      item.text
    ) {
      parts.push(item.text);
    } else if (item.type === 'tool_use' && item.name) {
      const info = extractToolInfo(item);
      if (info) toolInfos.push(info);
      let label = `[Tool: ${item.name}`;
      if (info && info.file) label += ` ${info.file}`;
      else if (info && info.cmd) label += ` ${info.cmd}`;
      else if (info && info.pattern) label += ` ${info.pattern}`;
      label += ']';
      parts.push(label);
    } else if (item.type === 'tool_result') {
      let resText = '';
      if (typeof item.content === 'string') {
        resText = item.content;
      } else if (Array.isArray(item.content)) {
        resText = item.content
          .map((c) => (typeof c === 'string' ? c : c.text || ''))
          .join(' ');
      }
      if (resText) parts.push(`[Tool Result: ${resText}]`);
    }
  }
  return { parts, toolInfos };
}

// Claude Code message extractor
function extractMessageClaude(entry) {
  if (!entry) return null;
  if (entry.payload && entry.payload.type && entry.payload.type !== 'message') return null;
  const msg = entry.message || entry.payload || entry;
  const role = msg.role || entry.role ||
    (entry.type === 'user' || entry.type === 'assistant' ? entry.type : null);
  if (role !== 'user' && role !== 'assistant') return null;
  const { parts, toolInfos } = extractContentParts(msg.content);
  if (parts.length === 0) return null;
  const text = parts.join(' ').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  const timestamp = entry.timestamp || entry.ts || msg.timestamp || null;
  return { role, text, timestamp, toolInfos };
}

// ---------------------------------------------------------------------------
// Codex message extractor
// ---------------------------------------------------------------------------

// Parse Codex exec_command output: strip metadata prefix, extract exit code
function parseExecOutput(output) {
  if (!output || typeof output !== 'string') return { exitCode: 0, content: String(output || '') };
  const lines = output.split('\n');
  let exitCode = 0;
  let outputStartIdx = 0;

  for (let i = 0; i < Math.min(lines.length, 10); i++) {
    const line = lines[i];
    const exitMatch = line.match(/^Process exited with code (\d+)/);
    if (exitMatch) {
      exitCode = parseInt(exitMatch[1], 10);
    }
    if (line.startsWith('Output:')) {
      outputStartIdx = i + 1;
      break;
    }
  }

  const content = lines.slice(outputStartIdx).join('\n').trim();
  return { exitCode, content };
}

// Classify Codex exec_command by cmd string
function classifyExecCommand(cmd) {
  if (!cmd) return 'shell';
  const trimmed = cmd.trim();
  if (/^(cat|head|tail|less|bat)\s/.test(trimmed)) return 'read';
  if (/^(grep|rg|ag)\s/.test(trimmed)) return 'search';
  if (/^(find|fd|ls)\s/.test(trimmed)) return 'discover';
  if (/^git\s/.test(trimmed)) return 'git';
  return 'shell';
}

// Extract file target from exec_command cmd string
function extractCmdTarget(cmd) {
  if (!cmd) return null;
  // cat/head/tail <file>
  const readMatch = cmd.match(/^(?:cat|head|tail|less|bat)\s+(?:-[^\s]+\s+)*(\S+)/);
  if (readMatch) return basename(readMatch[1]);
  return null;
}

function extractMessageCodex(entry) {
  if (!entry) return null;
  const ts = entry.timestamp || null;

  // event_msg — user message
  if (entry.type === 'event_msg' && entry.payload) {
    if (entry.payload.type === 'user_message') {
      const text = (entry.payload.message || '').trim();
      if (!text) return null;
      return { role: 'user', text, timestamp: ts, toolInfos: [] };
    }
    if (entry.payload.type === 'agent_message') {
      const text = (entry.payload.message || '').trim();
      if (!text) return null;
      return { role: 'assistant', text, timestamp: ts, toolInfos: [] };
    }
    // Skip token_count, task_started, task_complete
    return null;
  }

  // response_item — assistant message
  if (entry.type === 'response_item' && entry.payload) {
    const p = entry.payload;

    // Assistant text message
    if (p.type === 'message' && p.role === 'assistant') {
      const parts = [];
      if (Array.isArray(p.content)) {
        for (const c of p.content) {
          if (c && c.type === 'output_text' && c.text) parts.push(c.text);
        }
      }
      const text = parts.join(' ').replace(/\s+/g, ' ').trim();
      if (!text) return null;
      return { role: 'assistant', text, timestamp: ts, toolInfos: [] };
    }

    // Function call (tool use)
    if (p.type === 'function_call') {
      const name = p.name || 'unknown';
      let args = {};
      try { args = JSON.parse(p.arguments || '{}'); } catch {}

      // Build tool label similar to Claude Code format
      let label;
      if (name === 'exec_command') {
        const cmd = args.cmd || '';
        const cmdType = classifyExecCommand(cmd);
        const target = extractCmdTarget(cmd);
        if (cmdType === 'read' && target) {
          label = `[Tool: Read ${target}]`;
        } else if (cmdType === 'git') {
          label = `[Tool: Bash git ${truncate(cmd, 40)}]`;
        } else {
          label = `[Tool: Bash ${truncate(cmd, 60)}]`;
        }
      } else if (name === 'apply_patch') {
        // Extract filename from patch
        const patchInput = p.input || args.patch || '';
        const fileMatch = patchInput.match(/\*\*\* (?:Add|Update|Delete) File:\s*(\S+)/);
        const file = fileMatch ? basename(fileMatch[1]) : null;
        label = file ? `[Tool: Edit ${file}]` : '[Tool: Edit]';
      } else {
        label = `[Tool: ${name}]`;
      }

      return {
        role: 'assistant',
        text: label,
        timestamp: ts,
        toolInfos: [{ name: name === 'exec_command' ? 'Bash' : name }],
      };
    }

    // Function call output (tool result)
    if (p.type === 'function_call_output') {
      const rawOutput = typeof p.output === 'string' ? p.output : JSON.stringify(p.output || '');
      const parsed = parseExecOutput(rawOutput);
      const content = parsed.content || rawOutput;
      return {
        role: 'user',
        text: `[Tool Result: ${content}]`,
        timestamp: ts,
        toolInfos: [],
        _exitCode: parsed.exitCode,
      };
    }

    // custom_tool_call (apply_patch)
    if (p.type === 'custom_tool_call') {
      if (p.name === 'apply_patch') {
        const status = p.status === 'completed' ? 'ok' : (p.status || 'unknown');
        const fileMatch = (p.input || '').match(/\*\*\* (?:Add|Update|Delete) File:\s*(\S+)/);
        const file = fileMatch ? basename(fileMatch[1]) : null;
        const label = file ? `[Tool: Edit ${file} → ${status}]` : `[Tool: Edit → ${status}]`;
        return { role: 'tool', text: label, timestamp: ts, toolInfos: [] };
      }
      return null;
    }

    // Skip reasoning (encrypted)
    if (p.type === 'reasoning') return null;
  }

  // Skip session_meta, turn_context
  return null;
}

// Unified message extractor
function extractMessage(entry, format) {
  if (format === 'codex') return extractMessageCodex(entry);
  return extractMessageClaude(entry);
}

// ---------------------------------------------------------------------------
// Pass 1.5: Clean USER messages (strip IDE tags, commands, git noise)
// ---------------------------------------------------------------------------

const GIT_USER_PATTERNS = [
  /^(嗯\s*)?commit\s*(and\s*push)?/i,
  /^push/i,
  /^git\s/i,
];

function cleanUserMessage(text) {
  let t = text;
  t = t.replace(/<ide_opened_file>.*?<\/ide_opened_file>\s*/g, '').trim();
  t = t.replace(/<ide_selection>.*?<\/ide_selection>\s*/g, '').trim();
  if (/^<command-name>/.test(t)) return null;
  if (/^<local-command/.test(t)) return null;
  if (!t) return null;
  return t;
}

function classifyUserMessage(text) {
  if (/^This session is being continued from a previous conversation/.test(text)) {
    return 'context';
  }
  if (GIT_USER_PATTERNS.some(p => p.test(text.trim()))) {
    return 'git';
  }
  return 'user';
}

// ---------------------------------------------------------------------------
// Pass 2: Merge tool calls with results, compress
// ---------------------------------------------------------------------------

const DROP_TOOLS = new Set([
  'ToolSearch', 'TodoWrite', 'Glob', 'ExitPlanMode', 'EnterPlanMode',
  'Skill', 'Monitor', 'ScheduleWakeup', 'CronCreate', 'CronDelete',
]);

const GIT_OUTPUT_PATTERNS = [
  /^\[main [0-9a-f]/,
  /^On branch /,
  /^To https?:\/\//,
  /^remote: /,
  /^branch '.+' set up to track/,
  /^Enumerating objects/,
  /^Your branch is /,
  /^Changes (not staged|to be committed)/,
  /^(Untracked files|no changes added)/,
  /^\s*modified:/,
  /^\s*new file:/,
  /^\s*deleted:/,
  /^diff --git/,
  /^[0-9a-f]{7,} /,
];

function isGitOutput(text) {
  const first = text.trim().split('\n')[0] || '';
  return GIT_OUTPUT_PATTERNS.some(p => p.test(first));
}

function compressToolResult(text, toolName, toolInfo) {
  if (DROP_TOOLS.has(toolName)) return null;
  const clean = text.trim();

  if (toolName === 'Read') {
    if (/error|not found|does not exist/i.test(clean.substring(0, 80))) {
      return truncate(clean, BASH_ERROR_MAX_CHARS);
    }
    return null;
  }

  if (toolName === 'Edit' || toolName === 'Write') {
    if (/doesn't want to proceed/.test(clean)) return 'rejected';
    if (/error|<tool_use_error>/i.test(clean.substring(0, 80))) return 'error';
    return null;
  }

  if (toolName === 'Grep') return null;

  if (toolName === 'Agent') {
    if (/doesn't want to proceed/.test(clean)) return 'rejected';
    return truncate(clean, BASH_NORMAL_MAX_CHARS);
  }

  if (toolName === 'AskUserQuestion') {
    return truncate(clean, 200);
  }

  if (toolName === 'Bash') {
    if (/^\(Bash completed with no output\)$/.test(clean)) return null;
    if (isGitOutput(clean)) return null;
    if (/Exit code [^0]|Error|error|FAIL|panic|Traceback|ENOENT|EACCES/.test(clean.substring(0, 200))) {
      return truncate(clean, BASH_ERROR_MAX_CHARS);
    }
    return truncate(clean, BASH_NORMAL_MAX_CHARS);
  }

  if (/^\(Bash completed/.test(clean)) return null;
  if (/^Wasted call/.test(clean)) return null;
  if (/^\[Request interrupted/.test(clean)) return null;
  if (/^Todos have been modified/.test(clean)) return null;
  if (/doesn't want to proceed/.test(clean)) return 'rejected';
  if (/approved your plan/.test(clean)) return 'plan approved';
  if (/answered your questions/.test(clean)) return truncate(clean, 200);
  return truncate(clean, BASH_NORMAL_MAX_CHARS);
}

function isToolCall(msg) {
  return msg.role === 'assistant' && /^\[Tool: \w+/.test(msg.text);
}

function getToolName(msg) {
  const m = msg.text.match(/^\[Tool: (\w+)/);
  return m ? m[1] : null;
}

function getToolFile(msg) {
  const m = msg.text.match(/^\[Tool: \w+ (.+)\]$/);
  return m ? m[1] : null;
}

function isToolResult(msg) {
  return msg.role === 'user' && msg.text.startsWith('[Tool Result:');
}

function getToolResultContent(msg) {
  const m = msg.text.match(/^\[Tool Result: ([\s\S]*)\]$/);
  return m ? m[1] : msg.text;
}

function mergeAndCompress(messages) {
  const output = [];
  let i = 0;

  while (i < messages.length) {
    const msg = messages[i];

    // Codex custom_tool_call results are already role:'tool' — pass through
    if (msg.role === 'tool') {
      output.push(msg);
      i++;
      continue;
    }

    if (isToolCall(msg)) {
      const toolName = getToolName(msg);
      const toolFile = getToolFile(msg);
      const ts = msg.timestamp;

      let resultMsg = null;
      let lookAhead = i + 1;
      while (lookAhead < messages.length && lookAhead <= i + 2) {
        if (isToolResult(messages[lookAhead])) {
          resultMsg = messages[lookAhead];
          break;
        }
        if (messages[lookAhead].text.includes('[Request interrupted')) {
          lookAhead++;
          continue;
        }
        break;
      }

      if (resultMsg) {
        if (toolName === 'Bash' && toolFile && /^git\s/.test(toolFile)) {
          i = lookAhead + 1;
          continue;
        }

        const resultContent = getToolResultContent(resultMsg);
        const compressed = compressToolResult(resultContent, toolName);

        if (compressed === null && !toolFile) {
          i = lookAhead + 1;
          continue;
        }

        const isRejected = compressed === 'rejected';

        let label;
        if (compressed && compressed !== 'rejected' && compressed !== 'error') {
          label = toolFile
            ? `[${toolName} ${toolFile} → ${compressed}]`
            : `[${toolName} → ${compressed}]`;
        } else if (compressed === 'rejected' || compressed === 'error') {
          label = toolFile
            ? `[${toolName} ${toolFile} → ${compressed}]`
            : `[${toolName} → ${compressed}]`;
        } else {
          label = `[${toolName} ${toolFile}]`;
        }

        output.push({ role: 'tool', text: label, timestamp: ts, highValue: isRejected });
        i = lookAhead + 1;
        continue;
      }

      if (DROP_TOOLS.has(toolName)) { i++; continue; }
      if (toolName === 'Bash' && toolFile && /^git\s/.test(toolFile)) { i++; continue; }
      const label = toolFile ? `[${toolName} ${toolFile}]` : `[${toolName}]`;
      output.push({ role: 'tool', text: label, timestamp: ts });
      i++;
      continue;
    }

    if (isToolResult(msg)) { i++; continue; }
    if (msg.text.includes('[Request interrupted')) { i++; continue; }

    output.push(msg);
    i++;
  }

  return output;
}

// ---------------------------------------------------------------------------
// Pass 3: Collapse consecutive low-value tool lines
// ---------------------------------------------------------------------------

function isLowValueTool(msg) {
  if (msg.highValue) return false;
  if (/^\[\w+( [\w._-]+)?\]$/.test(msg.text)) return true;
  if (/^\[\w+ → .{1,20}\]$/.test(msg.text)) return true;
  if (/^\[\d+x \w+\]$/.test(msg.text)) return true;
  return false;
}

function collapseConsecutiveTools(messages) {
  const output = [];
  let i = 0;

  while (i < messages.length) {
    const msg = messages[i];

    if (msg.role === 'tool' && isLowValueTool(msg)) {
      let count = 0;
      let lastTs = msg.timestamp;
      while (i < messages.length && messages[i].role === 'tool' && isLowValueTool(messages[i])) {
        const nxMatch = messages[i].text.match(/^\[(\d+)x /);
        count += nxMatch ? parseInt(nxMatch[1], 10) : 1;
        lastTs = messages[i].timestamp;
        i++;
      }
      if (count >= 5) {
        output.push({ role: 'tool', text: `[${count}x tools]`, timestamp: lastTs });
      }
      continue;
    }

    output.push(msg);
    i++;
  }

  return output;
}

// ---------------------------------------------------------------------------
// Pass 4: Filter assistant execution noise
// ---------------------------------------------------------------------------

const ASSISTANT_NOISE = [
  /^Now /i, /^Let me /i, /^I'll /i, /^Done\b/i,
  /^已/, /^好的/, /^Updated?\b/i, /^Created?\b/i,
  /^Fixed?\b/i, /^Committed?\b/i, /^Pushed?\b/i,
  /^推了/, /^推送了/, /^完成/,
  /^\[Tool:/, /^No commits yet/,
];

function isAssistantNoise(text) {
  const trimmed = text.trim();
  if (trimmed.length < 25) return true;
  return ASSISTANT_NOISE.some(p => p.test(trimmed));
}

function filterAssistantNoise(messages) {
  return messages.filter(msg => {
    if (msg.role !== 'assistant') return true;
    return !isAssistantNoise(msg.text);
  });
}

// ---------------------------------------------------------------------------
// Main format pipeline
// ---------------------------------------------------------------------------

function formatSession(jsonlPath) {
  const content = fs.readFileSync(jsonlPath, 'utf-8');
  const lines = content.split('\n');

  // Detect format from first few lines
  const format = detectFormat(lines);

  // Pass 1: parse all messages
  const rawMessages = [];
  let startTimestamp = null;
  let messageCount = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let entry;
    try { entry = JSON.parse(trimmed); } catch { continue; }
    const msg = extractMessage(entry, format);
    if (!msg) continue;
    if (!startTimestamp && msg.timestamp) startTimestamp = msg.timestamp;
    rawMessages.push(msg);
    messageCount += 1;
  }

  // Pass 1.5: clean USER messages
  const cleaned = [];
  for (const msg of rawMessages) {
    if (msg.role === 'user' && !msg.text.startsWith('[Tool Result:')) {
      const cls = classifyUserMessage(msg.text);
      if (cls === 'git') continue;
      if (cls === 'context') {
        cleaned.push({ ...msg, role: 'context', text: truncate(msg.text, USER_MAX_CHARS) });
        continue;
      }
      const cleanText = cleanUserMessage(msg.text);
      if (!cleanText) continue;
      cleaned.push({ ...msg, text: cleanText });
    } else {
      cleaned.push(msg);
    }
  }

  // Pass 2: merge tool calls with results
  const merged = mergeAndCompress(cleaned);

  // Pass 3: collapse consecutive low-value tools
  const collapsed = collapseConsecutiveTools(merged);

  // Pass 4: filter assistant noise
  const filtered = filterAssistantNoise(collapsed);

  // Format final output
  const formatted = filtered.map((msg) => {
    const ts = msg.timestamp ? `[${msg.timestamp}] ` : '';
    if (msg.role === 'tool') return `${ts}${msg.text}`;
    if (msg.role === 'context') return `${ts}[CONTEXT]: ${truncate(msg.text, USER_MAX_CHARS)}`;
    const maxLen = msg.role === 'user' ? USER_MAX_CHARS : ASSISTANT_MAX_CHARS;
    return `${ts}${msg.role.toUpperCase()}: ${truncate(msg.text, maxLen)}`;
  });

  return {
    text: formatted.join('\n'),
    startTimestamp,
    messageCount,
  };
}

function splitIntoSegments(text) {
  if (text.length <= SEGMENT_THRESHOLD) return [text];
  const lines = text.split('\n');
  const segments = [];
  let current = '';

  for (const line of lines) {
    if (current.length > 0 && current.length + line.length + 1 > SEGMENT_SIZE) {
      segments.push(current);
      current = line;
    } else {
      current += (current.length > 0 ? '\n' : '') + line;
    }
  }
  if (current.length > 0) {
    segments.push(current);
  }
  return segments;
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: format-session.js <input.jsonl> <output.txt>');
    process.exit(1);
  }

  const inputPath = path.resolve(args[0]);
  const outputPath = path.resolve(args[1]);

  if (!fs.existsSync(inputPath)) {
    console.error(`Error: input file not found: ${inputPath}`);
    process.exit(1);
  }

  try {
    const { text, startTimestamp, messageCount } = formatSession(inputPath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });

    const segments = splitIntoSegments(text);
    const outputFiles = [];

    if (segments.length === 1) {
      fs.writeFileSync(outputPath, text);
      outputFiles.push(outputPath);
    } else {
      const base = outputPath.replace(/\.txt$/, '');
      segments.forEach((seg, i) => {
        const p = `${base}-seg${i + 1}.txt`;
        fs.writeFileSync(p, seg);
        outputFiles.push(p);
      });
    }

    console.log(JSON.stringify({
      input: inputPath,
      start_timestamp: startTimestamp,
      message_count: messageCount,
      total_chars: text.length,
      segments: segments.length,
      output_files: outputFiles,
    }, null, 2));
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = {
  formatSession, splitIntoSegments, extractMessage: extractMessageClaude,
  extractMessageCodex, detectFormat, truncate,
  USER_MAX_CHARS, ASSISTANT_MAX_CHARS, SEGMENT_THRESHOLD, SEGMENT_SIZE,
};

#!/usr/bin/env node
/**
 * scan-sessions.js
 *
 * Stage 1 + 2 of /extract-knowhow, as a single deterministic script.
 *
 * Discovers Claude Code session files, extracts per-session
 * metadata, filters out garbage (too-small, too-short, sub-agent, duplicate),
 * groups by project path, and emits a work list that the AI phase iterates
 * over.
 *
 * Output shape (work-list.json):
 *   {
 *     generated_at: ISO,
 *     totals: { discovered, accepted },
 *     skipped: { tooSmall, tooShort, subAgent, duplicate, unreadable },
 *     sessions: [
 *       { session_id, source, file_path, file_size, project_path,
 *         first_prompt, user_message_count, duration_minutes,
 *         start_timestamp }
 *     ],
 *     projects: { "<project_path>": [session_id, ...] }
 *   }
 *
 * Per-session metadata is cached at ~/.openscientist/cache/meta/<id>.json
 * keyed by file_size, so unchanged sessions are not re-parsed.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const META_CACHE_DIR = path.join(os.homedir(), '.openscientist', 'cache', 'meta');
const MIN_FILE_SIZE = 500;
const MIN_USER_MESSAGES = 2;
const MIN_DURATION_MINUTES = 1;
const HEAD_LINES = 50;
const TAIL_LINES = 20;
const SUBAGENT_MARKERS = [
  'RESPOND WITH ONLY A VALID JSON OBJECT',
  'record_facets',
];

function walk(dir, matcher, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, matcher, out);
    else if (e.isFile() && matcher(full)) out.push(full);
  }
  return out;
}

function discoverClaude() {
  const root = path.join(os.homedir(), '.claude', 'projects');
  const sep = path.sep;
  return walk(
    root,
    (p) => p.endsWith('.jsonl') && !p.includes(`${sep}subagents${sep}`)
  );
}

function extractSessionId(filePath) {
  return path.basename(filePath, '.jsonl');
}

function claudeProjectDirName(filePath) {
  // Fallback when cwd isn't in the jsonl. Claude encodes '/' as '-', but
  // original '-' characters also become '-', so the encoding is not
  // reversible. Return the raw encoded directory name to avoid producing
  // bogus paths like "/Users/x/Desktop/ai/lawyer" for "ai-lawyer".
  return path.basename(path.dirname(filePath));
}

function parseLine(line) {
  try {
    return JSON.parse(line);
  } catch (err) {
    return null;
  }
}

const BOILERPLATE_PREFIXES = [
  '<environment_context>',
  '<user_instructions>',
  '<system-reminder>',
  '# AGENTS.md',
  '<INSTRUCTIONS>',
  '<command-name>',
  '<local-command',
  '[Tool Result',
];

function firstPromptText(entry) {
  // Claude Code: { type, message: { role, content } }
  const msg = entry.message || entry;
  const role =
    msg.role ||
    entry.role ||
    (entry.type === 'user' ? 'user' : entry.type === 'assistant' ? 'assistant' : null);
  if (role !== 'user') return null;

  const content = msg.content;
  let text = '';
  if (typeof content === 'string') {
    text = content;
  } else if (Array.isArray(content)) {
    for (const p of content) {
      if (!p) continue;
      if (typeof p === 'string') text += p;
      else if ((p.type === 'text' || p.type === 'input_text') && p.text) text += p.text;
    }
  }
  text = text.trim();
  if (!text) return null;
  if (BOILERPLATE_PREFIXES.some((b) => text.startsWith(b))) return null;
  if (text.includes('RESPOND WITH ONLY A VALID JSON OBJECT')) return null;
  return text;
}

function timestampOf(entry) {
  const msg = entry.message || {};
  return entry.timestamp || entry.ts || msg.timestamp || null;
}

function extractMeta(filePath) {
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter((l) => l.trim());

  const head = lines.slice(0, HEAD_LINES);
  const tail = lines.slice(-TAIL_LINES);

  // sub-agent detection (first 5 lines)
  const firstFive = lines.slice(0, 5).join('\n');
  const isSubAgent = SUBAGENT_MARKERS.some((m) => firstFive.includes(m));

  let firstPrompt = null;
  let cwd = null;
  let firstTs = null;

  for (const line of head) {
    const entry = parseLine(line);
    if (!entry) continue;
    if (!cwd) {
      cwd =
        entry.cwd ||
        (entry.message && entry.message.cwd) ||
        null;
    }
    if (!firstPrompt) {
      const t = firstPromptText(entry);
      if (t) firstPrompt = t.substring(0, 500);
    }
    if (!firstTs) {
      const ts = timestampOf(entry);
      if (ts) firstTs = ts;
    }
    if (firstPrompt && firstTs && cwd) break;
  }

  let lastTs = null;
  for (let i = tail.length - 1; i >= 0; i--) {
    const entry = parseLine(tail[i]);
    if (!entry) continue;
    const ts = timestampOf(entry);
    if (ts) {
      lastTs = ts;
      break;
    }
  }

  // Cheap user-message count (substring scan, no JSON parse per line)
  let userCount = 0;
  for (const line of lines) {
    if (line.includes('"role":"user"') || line.includes('"type":"user"')) {
      userCount += 1;
    }
  }

  let durationMinutes = 0;
  if (firstTs && lastTs) {
    const dt = new Date(lastTs).getTime() - new Date(firstTs).getTime();
    if (!Number.isNaN(dt) && dt > 0) {
      durationMinutes = Math.round(dt / 60000);
    }
  }

  return {
    file_size: stats.size,
    is_sub_agent: isSubAgent,
    first_prompt: firstPrompt,
    user_message_count: userCount,
    cwd,
    start_timestamp: firstTs,
    end_timestamp: lastTs,
    duration_minutes: durationMinutes,
  };
}

function metaCachePath(sessionId) {
  return path.join(META_CACHE_DIR, `${sessionId}.json`);
}

function loadCachedMeta(sessionId, fileSize) {
  const p = metaCachePath(sessionId);
  if (!fs.existsSync(p)) return null;
  try {
    const cached = JSON.parse(fs.readFileSync(p, 'utf-8'));
    if (cached && cached.file_size === fileSize) return cached;
  } catch (err) {
    // fall through to re-parse
  }
  return null;
}

function saveCachedMeta(sessionId, meta) {
  fs.mkdirSync(META_CACHE_DIR, { recursive: true });
  fs.writeFileSync(metaCachePath(sessionId), JSON.stringify(meta, null, 2) + '\n');
}

function scan() {
  const candidates = discoverClaude();

  const skipped = {
    tooSmall: 0,
    tooShort: 0,
    subAgent: 0,
    duplicate: 0,
    unreadable: 0,
  };
  const accepted = [];
  const byFingerprint = new Map();

  for (const file of candidates) {
    let stats;
    try {
      stats = fs.statSync(file);
    } catch (err) {
      skipped.unreadable += 1;
      continue;
    }
    if (stats.size < MIN_FILE_SIZE) {
      skipped.tooSmall += 1;
      continue;
    }

    const sessionId = extractSessionId(file);
    let meta = loadCachedMeta(sessionId, stats.size);
    if (!meta) {
      try {
        meta = extractMeta(file);
      } catch (err) {
        skipped.unreadable += 1;
        continue;
      }
      meta.session_id = sessionId;
      meta.source = 'claude';
      meta.file_path = file;
      saveCachedMeta(sessionId, meta);
    }

    if (meta.is_sub_agent) {
      skipped.subAgent += 1;
      continue;
    }
    if ((meta.user_message_count || 0) < MIN_USER_MESSAGES) {
      skipped.tooShort += 1;
      continue;
    }
    if ((meta.duration_minutes || 0) < MIN_DURATION_MINUTES) {
      skipped.tooShort += 1;
      continue;
    }

    // Prefer cwd from the jsonl. Only fall back to the on-disk directory
    // name when cwd is missing.
    const projectPath = meta.cwd || claudeProjectDirName(file);

    const record = {
      session_id: sessionId,
      source: 'claude',
      file_path: file,
      file_size: meta.file_size,
      project_path: projectPath,
      first_prompt: meta.first_prompt,
      user_message_count: meta.user_message_count,
      duration_minutes: meta.duration_minutes,
      start_timestamp: meta.start_timestamp,
    };

    const fp = `${meta.first_prompt || ''}::${meta.user_message_count || 0}`;
    const existing = byFingerprint.get(fp);
    if (existing) {
      skipped.duplicate += 1;
      if ((record.user_message_count || 0) > (existing.user_message_count || 0)) {
        const idx = accepted.indexOf(existing);
        if (idx !== -1) accepted[idx] = record;
        byFingerprint.set(fp, record);
      }
      continue;
    }
    accepted.push(record);
    byFingerprint.set(fp, record);
  }

  accepted.sort((a, b) => {
    const at = a.start_timestamp || '';
    const bt = b.start_timestamp || '';
    return at.localeCompare(bt);
  });

  const projects = {};
  for (const s of accepted) {
    if (!projects[s.project_path]) projects[s.project_path] = [];
    projects[s.project_path].push(s.session_id);
  }

  return {
    generated_at: new Date().toISOString(),
    totals: {
      discovered: candidates.length,
      accepted: accepted.length,
    },
    skipped,
    sessions: accepted,
    projects,
  };
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const outIdx = args.indexOf('--out');
  const outPath =
    outIdx !== -1 && args[outIdx + 1]
      ? path.resolve(args[outIdx + 1])
      : path.join(os.homedir(), '.openscientist', 'cache', 'work-list.json');

  try {
    const result = scan();
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n');
    console.log(
      `✓ Scanned ${result.totals.discovered} files → ${result.totals.accepted} accepted`
    );
    console.log(
      `  Skipped: tooSmall=${result.skipped.tooSmall} tooShort=${result.skipped.tooShort} subAgent=${result.skipped.subAgent} duplicate=${result.skipped.duplicate} unreadable=${result.skipped.unreadable}`
    );
    console.log(`  Projects: ${Object.keys(result.projects).length}`);
    console.log(`  Work list: ${outPath}`);
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { scan, extractMeta };

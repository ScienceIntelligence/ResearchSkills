#!/usr/bin/env node
/**
 * scan-sessions.js
 *
 * Stage 1 + 2 of /extract-knowhow, as a single deterministic script.
 *
 * Discovers Claude Code and Codex session files, extracts per-session
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
 * Per-session metadata is cached at ~/.researchskills/cache/meta/<id>.json
 * keyed by file_size, so unchanged sessions are not re-parsed.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const META_CACHE_DIR = path.join(os.homedir(), '.researchskills', 'cache', 'meta');
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

function discoverCodex() {
  const archived = walk(
    path.join(os.homedir(), '.codex', 'archived_sessions'),
    (p) => /rollout-.*\.jsonl$/.test(p)
  );
  const sessions = walk(
    path.join(os.homedir(), '.codex', 'sessions'),
    (p) => p.endsWith('.jsonl')
  );
  return [...archived, ...sessions];
}

function extractSessionId(filePath, source) {
  const base = path.basename(filePath, '.jsonl');
  if (source === 'codex') {
    const m = base.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/);
    if (m) return m[1];
  }
  return base;
}

function claudeProjectDirName(filePath) {
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
  '<turn_aborted>',
];

const IDE_CONTEXT_RE = /^# Context from my IDE.*?\n(?:(?:##[^\n]*|  ?- [^\n]*|-[^\n]*|\s*)\n)*\s*/s;

function firstPromptText(entry) {
  // Claude Code: { type, message: { role, content } }
  // Codex:   { type: "event_msg", payload: { type: "user_message", message } }
  const msg = entry.message || entry.payload || entry;
  const role =
    msg.role ||
    entry.role ||
    (entry.type === 'user' ? 'user' : entry.type === 'assistant' ? 'assistant' : null);

  // Codex user_message
  if (entry.type === 'event_msg' && entry.payload && entry.payload.type === 'user_message') {
    const text = (entry.payload.message || '').trim();
    if (!text) return null;
    if (BOILERPLATE_PREFIXES.some((b) => text.startsWith(b))) return null;
    if (text.includes('RESPOND WITH ONLY A VALID JSON OBJECT')) return null;
    return text.replace(IDE_CONTEXT_RE, '').trim() || null;
  }

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

  text = text.replace(IDE_CONTEXT_RE, '').trim();
  if (!text) return null;

  return text;
}

function timestampOf(entry) {
  const msg = entry.message || entry.payload || {};
  return entry.timestamp || entry.ts || msg.timestamp || null;
}

function extractMeta(filePath) {
  const stats = fs.statSync(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter((l) => l.trim());

  const head = lines.slice(0, HEAD_LINES);
  const tail = lines.slice(-TAIL_LINES);

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
        (entry.payload && entry.payload.cwd) ||
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

  const userLineIndices = [];
  for (let li = 0; li < lines.length; li++) {
    if (lines[li].includes('"role":"user"') ||
        lines[li].includes('"type":"user"') ||
        lines[li].includes('"type":"user_message"')) {
      userLineIndices.push(li);
    }
  }
  const userCount = userLineIndices.length;

  const SAMPLE_COUNT = 5;
  const sampledPrompts = [];
  if (userLineIndices.length > 0) {
    const pickIndices = new Set();
    for (let s = 0; s < SAMPLE_COUNT; s++) {
      const idx = Math.min(
        Math.round(s * (userLineIndices.length - 1) / Math.max(SAMPLE_COUNT - 1, 1)),
        userLineIndices.length - 1
      );
      pickIndices.add(userLineIndices[idx]);
    }
    for (const li of pickIndices) {
      const entry = parseLine(lines[li]);
      if (!entry) continue;
      const t = firstPromptText(entry);
      if (t) sampledPrompts.push(t.substring(0, 300));
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
    sampled_prompts: sampledPrompts,
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
  const candidates = [
    ...discoverClaude().map((f) => ({ file: f, source: 'claude' })),
    ...discoverCodex().map((f) => ({ file: f, source: 'codex' })),
  ];

  const skipped = {
    tooSmall: 0,
    tooShort: 0,
    subAgent: 0,
    duplicate: 0,
    unreadable: 0,
  };
  const accepted = [];
  const byFingerprint = new Map();

  for (const { file, source } of candidates) {
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

    const sessionId = extractSessionId(file, source);
    let meta = loadCachedMeta(sessionId, stats.size);
    if (!meta) {
      try {
        meta = extractMeta(file);
      } catch (err) {
        skipped.unreadable += 1;
        continue;
      }
      meta.session_id = sessionId;
      meta.source = source;
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

    const projectPath =
      meta.cwd ||
      (source === 'claude'
        ? claudeProjectDirName(file)
        : path.basename(path.dirname(file)));

    const record = {
      session_id: sessionId,
      source,
      file_path: file,
      file_size: meta.file_size,
      project_path: projectPath,
      first_prompt: meta.first_prompt,
      sampled_prompts: meta.sampled_prompts || [],
      user_message_count: meta.user_message_count,
      duration_minutes: meta.duration_minutes,
      start_timestamp: meta.start_timestamp,
    };

    const fp = `${projectPath}::${meta.first_prompt || ''}::${meta.user_message_count || 0}`;
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
      : path.join(os.homedir(), '.researchskills', 'cache', 'work-list.json');

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

#!/usr/bin/env node
/**
 * extract-skills.js
 *
 * Orchestrates per-session skill extraction using Claude Code CLI.
 * For each uncached session: format → call `claude -p` with Haiku → validate.
 *
 * This script is the deterministic loop; Haiku does the AI judgment.
 * The main /extract-knowhow agent calls this script once with Bash,
 * keeping its own context clean.
 *
 * Usage:
 *   extract-skills.js <work-list.json> [options]
 *
 * Options:
 *   --domain <domain>          Domain for all skills (e.g. computer-science)
 *   --subdomain <subdomain>    Subdomain for all skills (e.g. machine-learning)
 *   --contributor <name>       Contributor name (git user.name)
 *   --batch-size <n>           Max sessions to process (default: unlimited)
 *   --concurrency <n>          Parallel claude -p calls per batch (default: 5)
 *   --session-ids <csv>        Only process these session IDs (comma-separated)
 *   --test                     Mark as test data
 *   --verbose                  Print detailed progress
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync, spawn } = require('child_process');

const UTILS_DIR = path.join(os.homedir(), '.claude', 'utils');
const FORMAT_SCRIPT = path.join(UTILS_DIR, 'format-session.js');
const VALIDATE_SCRIPT = path.join(UTILS_DIR, 'validate-skills.js');

// Pre-filter: skip sessions too short to contain meaningful research content
const MIN_FORMATTED_CHARS = 2000;

// Skip sessions whose first_prompt matches these patterns (case-insensitive)
const SKIP_PROMPT_PATTERNS = [
  /^(hi|hello|hey|test|help)\s*[.!?]?\s*$/i,
  /^\/\w+/,                           // slash command invocations
  /^(git|npm|pip|brew|docker)\s/i,    // pure tool commands
  /^(fix|install|update|upgrade)\s+(the\s+)?(lint|build|ci|deps|dependencies)/i,
];

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    workListPath: null,
    domain: null,
    subdomain: null,
    contributor: null,
    batchSize: Infinity,
    concurrency: 10,
    sessionIds: null,
    test: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--domain':       opts.domain = args[++i]; break;
      case '--subdomain':    opts.subdomain = args[++i]; break;
      case '--contributor':  opts.contributor = args[++i]; break;
      case '--batch-size':   opts.batchSize = parseInt(args[++i], 10); break;
      case '--concurrency':  opts.concurrency = parseInt(args[++i], 10); break;
      case '--session-ids':  opts.sessionIds = args[++i].split(','); break;
      case '--test':         opts.test = true; break;
      case '--verbose':      opts.verbose = true; break;
      default:
        if (!args[i].startsWith('-') && !opts.workListPath) {
          opts.workListPath = args[i];
        }
    }
  }
  return opts;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function run(cmd, args, opts = {}) {
  try {
    return execFileSync(cmd, args, {
      encoding: 'utf-8',
      stdio: opts.stdio || ['pipe', 'pipe', 'pipe'],
      timeout: opts.timeout || 300_000, // 5 min default
      ...opts,
    }).trim();
  } catch (err) {
    if (opts.ignoreError) return err.stdout || '';
    throw err;
  }
}

function isCached(sessionId) {
  try {
    execFileSync('node', [VALIDATE_SCRIPT, 'is-cached', sessionId], {
      stdio: 'pipe',
    });
    return true;
  } catch { return false; }
}

function formatSession(filePath, outputPath) {
  const stdout = run('node', [FORMAT_SCRIPT, filePath, outputPath]);
  try { return JSON.parse(stdout); } catch { return null; }
}

// ---------------------------------------------------------------------------
// Extraction prompt builder
// ---------------------------------------------------------------------------

function buildPrompt(session, segmentFile, segmentInfo, opts) {
  const date = new Date().toISOString().split('T')[0];
  const domain = opts.domain || 'computer-science';
  const subdomain = opts.subdomain || 'test-data';
  const contributor = opts.contributor || 'anonymous';
  const sessionId = session.session_id;

  // Read formatted text — will be called once per segment for multi-segment sessions
  const sessionText = fs.readFileSync(segmentFile, 'utf-8');

  const segLabel = segmentInfo ? ` (segment ${segmentInfo.index}/${segmentInfo.total})` : '';

  return `You are a research skill extractor for OpenScientist.

## Your Task

Analyze the session text below${segLabel}. Identify research impasse moments and knowledge gaps, then output skill markdown blocks.

## Input

Session ID: ${sessionId}${segLabel}
Domain: ${domain}
Subdomain: ${subdomain}
Contributor: ${contributor}
Date: ${date}

## Session Text

<session>
${sessionText}
</session>

## Instructions

Scan the conversation chronologically. Identify:
- **Impasse moments**: researcher got stuck, had to choose, assumptions failed, or execution broke
- **Knowledge gaps**: facts the human provided that an LLM wouldn't know
- **Notable episodes**: failures, workarounds, or surprising findings

For each finding, output a skill as a fenced markdown block.

### Episodic skills

\`\`\`
---
name: "<descriptive-slug>"
memory_type: episodic
subtype: failure | adaptation | anomalous
domain: ${domain}
subdomain: ${subdomain}
contributor: ${contributor}
source:
  type: session
  session_id: "${sessionId}"
extracted_at: "${date}"
confidence:
  llm_score: <0-5>
tags: [<relevant-tags>]
---

## Situation
[What was happening — specific, de-identified]

## Action
[What was done]

## Outcome
[What happened]

## Lesson
[What was learned]

## Retrieval Cues
- [When should an agent recall this?]
\`\`\`

### Semantic skills

\`\`\`
---
name: "<descriptive-slug>"
memory_type: semantic
subtype: frontier | non-public | correction
domain: ${domain}
subdomain: ${subdomain}
contributor: ${contributor}
source:
  type: session
  session_id: "${sessionId}"
extracted_at: "${date}"
confidence:
  llm_score: <0-5>
tags: [<relevant-tags>]
---

## Fact
[Specific knowledge point]

## Evidence
- Source: [origin]
- Verified by: [method]

## LLM Default Belief
[For correction only: what the LLM wrongly assumes]

## Expiry Signal
[When this becomes outdated]
\`\`\`

### Procedural skills

\`\`\`
---
name: "<descriptive-slug>"
memory_type: procedural
subtype: tie | no-change | constraint-failure | operator-fail
domain: ${domain}
subdomain: ${subdomain}
contributor: ${contributor}
source:
  type: session
  session_id: "${sessionId}"
extracted_at: "${date}"
confidence:
  llm_score: <0-5>
tags: [<relevant-tags>]
---

## When
[What situation triggers this — specific]

### Exclusions
- [Similar but should NOT trigger]

## Decision

### Preferred action
[What to do]

### Rejected alternatives
- [Alt] — [why wrong]

### Reasoning
[Tacit knowledge — why preferred is better]

## Local Verifiers
1. [Check to run after acting]

## Failure Handling
[What if verifiers fail]

## Anti-exemplars
- [Where this skill would be harmful]
\`\`\`

## Output Format

Output each skill as a fenced markdown block with \`\`\`skill-md markers. Example:

\`\`\`skill-md
---
name: "example-slug"
memory_type: episodic
subtype: failure
...
---

## Situation
...
\`\`\`

Output as many \`\`\`skill-md blocks as you find. If no meaningful content, output zero blocks.

## Rules

- Skills must be specific to THIS conversation. No generic advice.
- De-identify: strip file paths, usernames, project names, private URLs.
- Preserve: scientific content, methods, tools, parameters.
- If the session is about general software engineering (not research) in test mode, still extract — focus on problem-solving patterns, not routine coding.

## Final line

After all skill blocks, print exactly:
SKILLS_EXTRACTED: <total> (E:<episodic> S:<semantic> P:<procedural>)`;
}

// ---------------------------------------------------------------------------
// Async claude runner (non-blocking)
// ---------------------------------------------------------------------------

function runClaudeAsync(prompt, timeoutMs = 180_000) {
  return new Promise((resolve) => {
    const chunks = [];
    // Pass prompt via stdin instead of command arg (avoids arg length issues)
    const proc = spawn('claude', [
      '-p',
      '--model', 'haiku',
      '--no-session-persistence',
    ], { stdio: ['pipe', 'pipe', 'pipe'] });

    // Write prompt to stdin then close
    proc.stdin.write(prompt);
    proc.stdin.end();

    proc.stdout.on('data', (d) => chunks.push(d));
    proc.stderr.on('data', (d) => chunks.push(d));

    const timer = setTimeout(() => {
      proc.kill('SIGTERM');
      resolve({ ok: false, output: '', error: 'timeout' });
    }, timeoutMs);

    proc.on('close', (code) => {
      clearTimeout(timer);
      const output = Buffer.concat(chunks).toString('utf-8');
      resolve({ ok: code === 0, output, error: code !== 0 ? `exit ${code}` : null });
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      resolve({ ok: false, output: '', error: err.message });
    });
  });
}

// ---------------------------------------------------------------------------
// Parse skill-md blocks from Haiku output → write files → validate
// ---------------------------------------------------------------------------

function writeAndValidateSkills(sessionId, output) {
  const blocks = [];
  const regex = /```skill-md\n([\s\S]*?)```/g;
  let m;
  while ((m = regex.exec(output)) !== null) {
    blocks.push(m[1].trim());
  }

  if (blocks.length === 0) return 0;

  const skillFiles = [];
  for (let i = 0; i < blocks.length; i++) {
    const filePath = path.join(os.tmpdir(), `skill-${sessionId}-${i + 1}.md`);
    fs.writeFileSync(filePath, blocks[i] + '\n');
    skillFiles.push(filePath);
  }

  // Validate and cache via execFileSync (no shell)
  try {
    execFileSync('node', [VALIDATE_SCRIPT, 'save', sessionId, ...skillFiles], {
      encoding: 'utf-8',
      stdio: 'pipe',
    });
  } catch {
    // Validation failed — skills still written but not cached
  }

  // Clean up tmp files
  for (const f of skillFiles) { try { fs.unlinkSync(f); } catch {} }

  return blocks.length;
}

// ---------------------------------------------------------------------------
// Process a single session: pre-filter → format → build prompt
// Returns { skip, error, ready, sid, prompt, formattedFiles }
// ---------------------------------------------------------------------------

function prepareSession(session, opts) {
  const sid = session.session_id;

  // Pre-filter by first_prompt
  const fp = (session.first_prompt || '').trim();
  if (fp && SKIP_PROMPT_PATTERNS.some(p => p.test(fp))) {
    return { sid, skip: 'trivial prompt' };
  }

  // Format
  const outPath = path.join(os.tmpdir(), `session-${sid}.txt`);
  const meta = formatSession(session.file_path, outPath);
  if (!meta) {
    return { sid, error: 'format failed' };
  }

  const formattedFiles = meta.output_files || [outPath];

  // Pre-filter by size
  let totalChars = 0;
  for (const f of formattedFiles) {
    try { totalChars += fs.statSync(f).size; } catch {}
  }
  if (totalChars < MIN_FORMATTED_CHARS) {
    for (const f of formattedFiles) { try { fs.unlinkSync(f); } catch {} }
    return { sid, skip: `${totalChars} chars < ${MIN_FORMATTED_CHARS} min` };
  }

  return { sid, ready: true, formattedFiles };
}

// ---------------------------------------------------------------------------
// Parse Haiku output and collect result
// ---------------------------------------------------------------------------

function parseResult(sid, output, verbose) {
  const match = output.match(/SKILLS_EXTRACTED:\s*(\d+)\s*\(E:(\d+)\s+S:(\d+)\s+P:(\d+)\)/);
  if (match) {
    const [, total, e, s, p] = match.map(Number);
    return { sid, total, episodic: e, semantic: s, procedural: p };
  }
  if (isCached(sid)) {
    return { sid, total: 0, episodic: 0, semantic: 0, procedural: 0, note: 'cached, no count' };
  }
  if (verbose) {
    const lastLines = output.split('\n').slice(-5).join('\n');
    console.error(`  [${sid}] Last output:`, lastLines);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main (async, batched parallel)
// ---------------------------------------------------------------------------

async function main() {
  const opts = parseArgs();

  if (!opts.workListPath) {
    console.error('Usage: extract-skills.js <work-list.json> [options]');
    process.exit(1);
  }

  const workList = JSON.parse(fs.readFileSync(opts.workListPath, 'utf-8'));
  let sessions = workList.sessions || [];

  if (opts.sessionIds) {
    const idSet = new Set(opts.sessionIds);
    sessions = sessions.filter(s => idSet.has(s.session_id));
  }

  const uncached = sessions.filter(s => !isCached(s.session_id));
  const cached = sessions.length - uncached.length;

  console.log(`\nSessions: ${sessions.length} total, ${cached} cached, ${uncached.length} uncached`);
  console.log(`Concurrency: ${opts.concurrency} parallel Haiku calls\n`);

  if (uncached.length === 0) {
    console.log('All sessions already cached. Nothing to do.');
    process.exit(0);
  }

  // Phase 1: Pre-filter and format ALL uncached sessions (fast, serial)
  // batch-size is applied AFTER pre-filtering so trivial sessions don't waste slots
  console.log('Phase 1: Pre-filtering and formatting...');
  const prepared = [];
  const totals = { episodic: 0, semantic: 0, procedural: 0, errors: 0, skipped: 0 };

  for (const session of uncached) {
    const result = prepareSession(session, opts);
    if (result.skip) {
      console.log(`  ${result.sid} → SKIP (${result.skip})`);
      totals.skipped++;
    } else if (result.error) {
      console.log(`  ${result.sid} → ERROR (${result.error})`);
      totals.errors++;
    } else {
      prepared.push(result);
      if (prepared.length >= opts.batchSize) break; // batch limit on real sessions only
    }
  }

  const batch = uncached;
  // Sessions that passed pre-filter but didn't fit in batch-size
  const remaining = uncached.length - totals.skipped - totals.errors - prepared.length;

  console.log(`  ${prepared.length} sessions ready, ${totals.skipped} skipped, ${totals.errors} errors\n`);

  if (prepared.length === 0) {
    console.log('No sessions to extract. Done.');
    process.exit(0);
  }

  // Phase 2: Build work units (one per segment, not per session)
  // Multi-segment sessions produce multiple work units, all processed in parallel
  const workUnits = [];
  for (const { sid, formattedFiles } of prepared) {
    const totalSegs = formattedFiles.length;
    for (let si = 0; si < totalSegs; si++) {
      const segInfo = totalSegs > 1 ? { index: si + 1, total: totalSegs } : null;
      // Find the original session object to pass to buildPrompt
      const session = batch.find(s => s.session_id === sid);
      const prompt = buildPrompt(session, formattedFiles[si], segInfo, opts);
      workUnits.push({ sid, prompt, segFile: formattedFiles[si], segInfo });
    }
  }

  console.log(`Phase 2: Extracting skills (${prepared.length} sessions → ${workUnits.length} Haiku calls, ${opts.concurrency} at a time)...`);
  const results = [];
  let completed = 0;

  for (let i = 0; i < workUnits.length; i += opts.concurrency) {
    const chunk = workUnits.slice(i, i + opts.concurrency);
    const batchNum = Math.floor(i / opts.concurrency) + 1;
    const totalBatches = Math.ceil(workUnits.length / opts.concurrency);

    console.log(`\n  Batch ${batchNum}/${totalBatches} (${chunk.length} calls):`);

    const promises = chunk.map(async ({ sid, prompt, segFile, segInfo }) => {
      const segLabel = segInfo ? ` seg${segInfo.index}/${segInfo.total}` : '';
      const startTime = Date.now();
      const { ok, output, error } = await runClaudeAsync(prompt, 300_000);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      // Clean up segment file
      try { fs.unlinkSync(segFile); } catch {}

      if (!ok) {
        console.log(`    ${sid}${segLabel} → ERROR (${error}) [${elapsed}s]`);
        totals.errors++;
        return null;
      }

      // Parse skill-md blocks from output → write files → validate
      const written = writeAndValidateSkills(sid, output);

      const result = parseResult(sid, output, opts.verbose);
      if (result) {
        totals.episodic += result.episodic;
        totals.semantic += result.semantic;
        totals.procedural += result.procedural;
        console.log(`    ${sid}${segLabel} → ${result.total} skills (E:${result.episodic} S:${result.semantic} P:${result.procedural}) [${elapsed}s]`);
        return result;
      } else if (written > 0) {
        console.log(`    ${sid}${segLabel} → ${written} skills written [${elapsed}s]`);
        return { sid, total: written, episodic: 0, semantic: 0, procedural: 0 };
      } else {
        console.log(`    ${sid}${segLabel} → 0 skills [${elapsed}s]`);
        return null;
      }
    });

    const chunkResults = await Promise.all(promises);
    results.push(...chunkResults.filter(Boolean));
    completed += chunk.length;
    console.log(`  Progress: ${completed}/${workUnits.length}`);
  }

  // Clean up any remaining formatted files
  for (const { formattedFiles } of prepared) {
    for (const f of formattedFiles) { try { fs.unlinkSync(f); } catch {} }
  }

  // Summary
  const totalSkills = totals.episodic + totals.semantic + totals.procedural;
  console.log(`
═══════════════════════════════════════════════
  Extraction Complete
═══════════════════════════════════════════════
  Sessions processed: ${batch.length}
  Skills extracted:   ${totalSkills}
    Episodic:   ${totals.episodic}
    Semantic:   ${totals.semantic}
    Procedural: ${totals.procedural}
  Skipped:      ${totals.skipped} (trivial/too short)
  Errors:       ${totals.errors}
${remaining > 0 ? `  Remaining:    ${remaining} (run again to continue)` : ''}
═══════════════════════════════════════════════`);

  const summaryPath = path.join(os.tmpdir(), 'extract-skills-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    batch_size: batch.length,
    total_skills: totalSkills,
    totals,
    remaining,
    results,
  }, null, 2));
  console.log(`\nSummary: ${summaryPath}`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

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
 *   --session-ids <csv>        Only process these session IDs (comma-separated)
 *   --test                     Mark as test data
 *   --verbose                  Print detailed progress
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

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

function buildPrompt(session, formattedFiles, opts) {
  const date = new Date().toISOString().split('T')[0];
  const domain = opts.domain || 'computer-science';
  const subdomain = opts.subdomain || 'test-data';
  const contributor = opts.contributor || 'anonymous';
  const sessionId = session.session_id;

  const fileList = formattedFiles.map(f => `- ${f}`).join('\n');

  return `You are a research skill extractor for OpenScientist.

## Your Task

Read the formatted session text file(s), identify research impasse moments and knowledge gaps, then write skill markdown files.

## Input

Session ID: ${sessionId}
Domain: ${domain}
Subdomain: ${subdomain}
Contributor: ${contributor}
Date: ${date}

Formatted text file(s):
${fileList}

## Instructions

1. Use the Read tool to read each file listed above.

2. Scan the conversation chronologically. Identify:
   - **Impasse moments**: researcher got stuck, had to choose, assumptions failed, or execution broke
   - **Knowledge gaps**: facts the human provided that an LLM wouldn't know
   - **Notable episodes**: failures, workarounds, or surprising findings

3. For each finding, write a skill markdown file to /tmp/ using the Write tool.

### Episodic skills → /tmp/skill-${sessionId}-E<N>.md

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

### Semantic skills → /tmp/skill-${sessionId}-S<N>.md

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

### Procedural skills → /tmp/skill-${sessionId}-P<N>.md

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

4. After writing all files, run:
\`\`\`bash
node ${VALIDATE_SCRIPT} save ${sessionId} /tmp/skill-${sessionId}-*.md
\`\`\`

If validation fails, fix the files and retry.

## Rules

- Use the Read tool on formatted text. Never grep raw .jsonl.
- Skills must be specific to THIS conversation. No generic advice.
- De-identify: strip file paths, usernames, project names, private URLs.
- Preserve: scientific content, methods, tools, parameters.
- If the session has no meaningful content, write zero files. That's OK.
- If the session is about general software engineering (not research) in test mode, still extract — but focus on problem-solving patterns, not routine coding.

## When done

Print exactly this as your final line:
SKILLS_EXTRACTED: <total> (E:<episodic> S:<semantic> P:<procedural>)`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const opts = parseArgs();

  if (!opts.workListPath) {
    console.error('Usage: extract-skills.js <work-list.json> [options]');
    process.exit(1);
  }

  const workList = JSON.parse(fs.readFileSync(opts.workListPath, 'utf-8'));
  let sessions = workList.sessions || [];

  // Filter by session IDs if specified
  if (opts.sessionIds) {
    const idSet = new Set(opts.sessionIds);
    sessions = sessions.filter(s => idSet.has(s.session_id));
  }

  // Skip cached sessions
  const uncached = sessions.filter(s => !isCached(s.session_id));
  const cached = sessions.length - uncached.length;

  console.log(`\nSessions: ${sessions.length} total, ${cached} cached, ${uncached.length} to process`);

  // Apply batch limit
  const batch = uncached.slice(0, opts.batchSize);
  const remaining = uncached.length - batch.length;

  if (batch.length === 0) {
    console.log('All sessions already cached. Nothing to do.');
    process.exit(0);
  }

  console.log(`Processing batch of ${batch.length} sessions...\n`);

  // Tally
  const totals = { episodic: 0, semantic: 0, procedural: 0, errors: 0, skipped: 0 };
  const results = [];

  for (let i = 0; i < batch.length; i++) {
    const session = batch[i];
    const sid = session.session_id;
    const progress = `[${i + 1}/${batch.length}]`;

    process.stdout.write(`${progress} ${sid} ... `);

    // 1. Pre-filter by first_prompt
    const fp = (session.first_prompt || '').trim();
    if (fp && SKIP_PROMPT_PATTERNS.some(p => p.test(fp))) {
      console.log('SKIP (trivial prompt)');
      totals.skipped++;
      continue;
    }

    // 2. Format
    const outPath = path.join(os.tmpdir(), `session-${sid}.txt`);
    const meta = formatSession(session.file_path, outPath);
    if (!meta) {
      console.log('SKIP (format failed)');
      totals.errors++;
      continue;
    }

    const formattedFiles = meta.output_files || [outPath];

    // 3. Pre-filter by formatted text size
    let totalChars = 0;
    for (const f of formattedFiles) {
      try { totalChars += fs.statSync(f).size; } catch {}
    }
    if (totalChars < MIN_FORMATTED_CHARS) {
      console.log(`SKIP (${totalChars} chars < ${MIN_FORMATTED_CHARS} min)`);
      for (const f of formattedFiles) { try { fs.unlinkSync(f); } catch {} }
      totals.skipped++;
      continue;
    }

    // 5. Build prompt and call claude CLI
    const prompt = buildPrompt(session, formattedFiles, opts);

    let output = '';
    try {
      output = run('claude', [
        '-p', prompt,
        '--model', 'haiku',
        '--permission-mode', 'bypassPermissions',
        '--allowedTools', 'Read,Write,Bash,Glob',
        '--no-session-persistence',
        '--max-budget-usd', '0.10',
      ], { timeout: 180_000 }); // 3 min per session
    } catch (err) {
      console.log('ERROR (claude CLI failed)');
      if (opts.verbose) console.error('  ', err.message);
      totals.errors++;
      continue;
    }

    // 6. Parse result
    const match = output.match(/SKILLS_EXTRACTED:\s*(\d+)\s*\(E:(\d+)\s+S:(\d+)\s+P:(\d+)\)/);
    if (match) {
      const [, total, e, s, p] = match.map(Number);
      totals.episodic += e;
      totals.semantic += s;
      totals.procedural += p;
      results.push({ session_id: sid, total, episodic: e, semantic: s, procedural: p });
      console.log(`${total} skills (E:${e} S:${s} P:${p})`);
    } else {
      // Check if files were written anyway
      if (isCached(sid)) {
        console.log('OK (cached, no count line)');
      } else {
        console.log('WARN (no SKILLS_EXTRACTED line)');
        if (opts.verbose) {
          const lastLines = output.split('\n').slice(-5).join('\n');
          console.error('  Last output:', lastLines);
        }
      }
    }

    // 7. Clean up formatted text
    for (const f of formattedFiles) {
      try { fs.unlinkSync(f); } catch {}
    }
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

  // Write summary JSON for main agent
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

main();

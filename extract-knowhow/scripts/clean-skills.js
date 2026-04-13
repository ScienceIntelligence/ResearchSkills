#!/usr/bin/env node
/**
 * clean-skills.js
 *
 * Stage 4 of /extract-knowhow: review extracted skills with Opus.
 * Spawns a Claude Code instance (Opus, bypass permissions) that directly
 * reads, deletes, edits, and merges skill files on disk.
 *
 * Operations:
 *   - Reject engineering skills (delete files)
 *   - Fix PII / anonymization (edit files)
 *   - Merge duplicate skills (write merged, delete redundant)
 *
 * Usage:
 *   clean-skills.js --session-ids id1,id2,... [--verbose]
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

const CACHE_DIR = path.join(os.homedir(), '.openscientist', 'cache', 'skills');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { sessionIds: null, verbose: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--session-ids': opts.sessionIds = args[++i].split(','); break;
      case '--verbose':     opts.verbose = true; break;
    }
  }
  return opts;
}

// ---------------------------------------------------------------------------
// Collect skill files
// ---------------------------------------------------------------------------

function collectSkillFiles(sessionIds) {
  const files = [];
  for (const sid of sessionIds) {
    const dir = path.join(CACHE_DIR, sid);
    if (!fs.existsSync(dir)) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith('.md')) {
        files.push(path.join(dir, f));
      }
    }
  }
  return files;
}

// ---------------------------------------------------------------------------
// Build prompt
// ---------------------------------------------------------------------------

function buildPrompt(files) {
  const fileList = files.map(f => f).join('\n');

  return `You are a research knowledge quality reviewer. You have ${files.length} skill files to review.

These files were auto-extracted from scientist-AI conversations by a weaker model. Your job is to clean them up: reject non-research content, fix PII leaks, and merge duplicates.

## Skill file paths

<files>
${fileList}
</files>

## Instructions

Read each file using the Read tool, then perform these operations:

### 1. Reject non-research skills

DELETE (using Bash: rm <filepath>) any skill that is fundamentally engineering, not research:
- GitHub platform operations (permissions, Rulesets, repo transfer, CI/CD, branch protection)
- Frontend/backend engineering (auth, database, UI layout, CSS, visualization library choices)
- DevOps / deployment / package management
- Project management / terminology naming / documentation organization
- Debugging specific software tools (Supabase, Firebase, React, etc.)

KEEP skills about:
- Scientific research methodology decisions (experiment design, hypothesis selection, data interpretation)
- Domain facts that AI doesn't know (frontier knowledge, unpublished info, corrections to LLM misconceptions)
- Concrete research turning points (hypothesis overturned, methodology abandoned, unexpected findings)
- Knowledge representation methodology (schema design for capturing research decision trees) — ONLY when discussing "how to represent scientific knowledge", NOT "how to code the implementation"

### 2. Fix anonymization

For each surviving skill, check the \`contributor\` field in YAML frontmatter.
If it is NOT in \`anon-*\` format (e.g., it shows a real name like "HHHHHejia"), use Edit to replace it.

To compute the anonymous hash: use Bash to run:
\`\`\`
node -e "console.log('anon-' + require('crypto').createHash('sha256').update('<original_name>').digest('hex').substring(0, 8))"
\`\`\`

Also scan the body for residual PII:
- Real usernames or person names
- Private URLs (not arxiv.org, doi.org, github.com, en.wikipedia.org, researchskills.ai)
- Email addresses
- Absolute file paths (e.g., /Users/...)

If found, use Edit to remove or replace with generic descriptions.

### 3. Merge duplicates

If two skills cover the same core knowledge point (same claim/decision/episode, just different wording or perspective):
- Keep the one with richer content and higher quality
- Use Write to save the merged/improved version to the kept file path
- Delete the redundant file with Bash rm

Do NOT merge skills that have genuinely different scope or context, even if they share some keywords.

### 4. Output summary

After completing ALL operations, output this exact line as the very last line of your response:

CLEAN_SUMMARY: kept=<number> rejected=<number> merged=<number> pii_fixed=<number>

Where:
- kept = files that survived without changes (or only PII fixes)
- rejected = files deleted as non-research
- merged = files deleted because they were merged into another
- pii_fixed = files where PII was corrected

Now begin. Read each file and process them systematically.`;
}

// ---------------------------------------------------------------------------
// Run Claude Code (Opus)
// ---------------------------------------------------------------------------

function runOpus(prompt, verbose, timeoutMs = 900_000) {
  return new Promise((resolve) => {
    const chunks = [];
    const proc = spawn('claude', [
      '-p',
      '--model', 'opus',
      '--dangerously-skip-permissions',
      '--allowedTools', 'Read,Edit,Write,Bash',
    ], { stdio: ['pipe', 'pipe', 'pipe'] });

    proc.stdin.write(prompt);
    proc.stdin.end();

    proc.stdout.on('data', (d) => {
      chunks.push(d);
      if (verbose) process.stderr.write(d);
    });
    proc.stderr.on('data', (d) => {
      if (verbose) process.stderr.write(d);
    });

    const timer = setTimeout(() => {
      proc.kill('SIGTERM');
      resolve({ ok: false, output: Buffer.concat(chunks).toString('utf-8'), error: 'timeout' });
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
// Parse summary from Opus output
// ---------------------------------------------------------------------------

function parseSummary(output) {
  const match = output.match(/CLEAN_SUMMARY:\s*kept=(\d+)\s+rejected=(\d+)\s+merged=(\d+)\s+pii_fixed=(\d+)/);
  if (!match) return null;
  return {
    kept: parseInt(match[1], 10),
    rejected: parseInt(match[2], 10),
    merged: parseInt(match[3], 10),
    pii_fixed: parseInt(match[4], 10),
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const opts = parseArgs();

  if (!opts.sessionIds || opts.sessionIds.length === 0) {
    console.error('Usage: clean-skills.js --session-ids id1,id2,... [--verbose]');
    process.exit(1);
  }

  const files = collectSkillFiles(opts.sessionIds);
  console.log(`\nClean: ${files.length} skill files across ${opts.sessionIds.length} sessions`);

  if (files.length === 0) {
    console.log('No skill files to clean. Done.');
    process.exit(0);
  }

  console.log('Spawning Opus for review...\n');
  const prompt = buildPrompt(files);
  const { ok, output, error } = await runOpus(prompt, opts.verbose);

  if (!ok) {
    console.error(`\nOpus review failed: ${error}`);
    process.exit(1);
  }

  const summary = parseSummary(output);
  if (summary) {
    console.log(`
═══════════════════════════════════════════════
  Clean Complete
═══════════════════════════════════════════════
  Kept:      ${summary.kept}
  Rejected:  ${summary.rejected}
  Merged:    ${summary.merged}
  PII fixed: ${summary.pii_fixed}
═══════════════════════════════════════════════`);
  } else {
    console.log('\nOpus completed but no CLEAN_SUMMARY found in output.');
    if (!opts.verbose) {
      console.log('Re-run with --verbose to see full Opus output.');
    }
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

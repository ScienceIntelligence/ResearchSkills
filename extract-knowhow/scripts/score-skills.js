#!/usr/bin/env node
/**
 * score-skills.js
 *
 * Stage 5 of /extract-knowhow: score cleaned skills.
 * Spawns an AI instance (via platform.js) that reads
 * each skill file and writes review_scores into the YAML frontmatter.
 *
 * Three scoring dimensions (0-5 each):
 *   - procedural: does it provide decision frameworks AI doesn't know?
 *   - semantic:   does it provide facts/beliefs AI doesn't have?
 *   - episodic:   does it provide concrete research experiences AI can reference?
 *
 * Usage:
 *   score-skills.js --session-ids id1,id2,... [--verbose]
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { parsePlatformFlag, createRunner } = require('./platform');

const CACHE_DIR = path.join(os.homedir(), '.researchskills', 'cache', 'skills');

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

  return `You are a research knowledge value assessor. You have ${files.length} cleaned research skill files to score.

These skills have already passed quality review (engineering content removed, PII fixed, duplicates merged). Your job is to assess the VALUE each skill brings to the most capable AI systems.

## Skill file paths

<files>
${fileList}
</files>

## Instructions

Read each file using the Read tool. For each skill, assign three independent scores (0-5), then use the Edit tool to insert them into the file's YAML frontmatter.

Insert the following block just before the closing \`---\` of the frontmatter:

\`\`\`
review_scores:
  procedural: X
  semantic: Y
  episodic: Z
\`\`\`

If the file already has a \`review_scores\` block, replace it with the new scores.

## Three Scoring Dimensions

### procedural — Procedural memory value
**Question**: Does this skill provide research decision frameworks or principles that the strongest AI doesn't already know?

| Score | Meaning |
|-------|---------|
| 0 | AI can fully derive this decision logic on its own, no external prompt needed |
| 1 | AI would likely think of this, but might not prioritize this path |
| 2 | AI could figure out parts of this, but would miss key exclusion conditions or failure handling |
| 3 | AI is unlikely to independently produce this decision framework, but would recognize it as sound |
| 4 | AI would take the wrong path when facing this research impasse; this skill directly corrects its search direction |
| 5 | AI would confidently take the wrong path; this skill corrects a confident-but-wrong decision pattern |

**Focus**: Is the trigger condition specific? Are rejected alternatives explicitly stated with reasons? Is failure recovery covered?

### semantic — Declarative memory value
**Question**: Does this skill provide knowledge or beliefs that the strongest AI doesn't have?

| Score | Meaning |
|-------|---------|
| 0 | Textbook-level knowledge, any LLM knows this |
| 1 | Public but obscure knowledge, model might know but uncertain |
| 2 | Relatively new knowledge, may have appeared after model training cutoff |
| 3 | Model very likely doesn't know this specific fact (e.g., undocumented tool behavior) |
| 4 | Model holds an incorrect belief here, would give a confident but wrong answer |
| 5 | Non-public, lab-level knowledge that cannot exist in training data |

**Focus**: Is there concrete evidence? Is it frontier / non-public / correction type?

### episodic — Episodic memory value
**Question**: Does this skill provide concrete research experiences that AI can reference?

| Score | Meaning |
|-------|---------|
| 0 | Pure abstract advice, no concrete situation |
| 1 | Has situational description but very generic ("in an experiment...") |
| 2 | Has specific situation and action, but outcome/lesson unclear |
| 3 | Complete situation-action-outcome chain, AI can reference in similar situations |
| 4 | Contains counter-intuitive turning point (expected A, observed B), AI can directly reuse when encountering similar anomalies |
| 5 | Highly specific failure/adaptation/anomaly experience with clear retrieval cues that can auto-trigger in similar situations |

**Focus**: Is there a concrete situation → action → outcome chain? Is the lesson transferable?

## Key Principles

- **Three dimensions are independent**: A procedural skill can simultaneously score high on semantic (carries facts AI doesn't know) and episodic (grounded in a specific research episode)
- **Core criterion**: Without this skill, would the strongest frontier AI perform worse in the corresponding dimension?
- **memory_type vs review_scores**: \`memory_type\` is structural classification (format). \`review_scores\` is value assessment (what it actually contributes).

## Output

After scoring ALL files, output this exact line as the very last line of your response:

SCORE_SUMMARY: scored=<N> avg_procedural=<X.X> avg_semantic=<X.X> avg_episodic=<X.X>

Now begin. Read each file and score them systematically.`;
}

// ---------------------------------------------------------------------------
// Parse summary from output
// ---------------------------------------------------------------------------

function parseSummary(output) {
  const match = output.match(
    /SCORE_SUMMARY:\s*scored=(\d+)\s+avg_procedural=([\d.]+)\s+avg_semantic=([\d.]+)\s+avg_episodic=([\d.]+)/
  );
  if (!match) return null;
  return {
    scored: parseInt(match[1], 10),
    avg_procedural: parseFloat(match[2]),
    avg_semantic: parseFloat(match[3]),
    avg_episodic: parseFloat(match[4]),
  };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const platform = parsePlatformFlag();
  const runner = createRunner(platform);
  const opts = parseArgs();

  if (!opts.sessionIds || opts.sessionIds.length === 0) {
    console.error('Usage: score-skills.js --session-ids id1,id2,... [--cc|--codex] [--verbose]');
    process.exit(1);
  }

  const files = collectSkillFiles(opts.sessionIds);
  console.log(`\nScore: ${files.length} skill files across ${opts.sessionIds.length} sessions`);

  if (files.length === 0) {
    console.log('No skill files to score. Done.');
    process.exit(0);
  }

  console.log('Spawning AI for scoring...\n');
  const prompt = buildPrompt(files);
  const { ok, output, error } = await runner.score(prompt, opts.verbose);

  if (!ok) {
    console.error(`\nScoring failed: ${error}`);
    process.exit(1);
  }

  const summary = parseSummary(output);
  if (summary) {
    console.log(`
═══════════════════════════════════════════════
  Score Complete
═══════════════════════════════════════════════
  Scored:         ${summary.scored} skills
  Avg procedural: ${summary.avg_procedural.toFixed(1)}
  Avg semantic:   ${summary.avg_semantic.toFixed(1)}
  Avg episodic:   ${summary.avg_episodic.toFixed(1)}
═══════════════════════════════════════════════`);
  } else {
    console.log('\nCompleted but no SCORE_SUMMARY found in output.');
    if (!opts.verbose) {
      console.log('Re-run with --verbose to see full output.');
    }
  }
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

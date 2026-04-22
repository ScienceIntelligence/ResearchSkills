#!/usr/bin/env node
/**
 * classify-projects.js
 *
 * Classifies projects from work-list.json as research vs engineering
 * using AI (via platform.js), then picks domain/subdomain from the taxonomy.
 *
 * Usage:
 *   classify-projects.js <work-list.json> [--test] [--verbose]
 *
 * Output: ~/.researchskills/cache/classification.json
 *   {
 *     projects: {
 *       "<project_path>": {
 *         slug: "project-name",
 *         type: "research" | "engineering" | "other",
 *         domain: "computer-science",
 *         subdomain: "artificial-intelligence",
 *         session_ids: ["id1", "id2", ...],
 *         research_session_ids: ["id1", ...],
 *         skipped_session_ids: ["id3", ...],
 *         reason: "why classified this way"
 *       }
 *     }
 *   }
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const https = require('https');
const { parsePlatformFlag, createRunner } = require('./platform');

const OUTPUT_PATH = path.join(os.homedir(), '.researchskills', 'cache', 'classification.json');

// Max concurrent AI classify calls — prevents resource thrashing & API rate limits
const CONCURRENCY = 5;

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { workListPath: null, test: false, verbose: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--test':    opts.test = true; break;
      case '--verbose': opts.verbose = true; break;
      default:
        if (!args[i].startsWith('-') && !opts.workListPath) {
          opts.workListPath = args[i];
        }
    }
  }
  return opts;
}

// ---------------------------------------------------------------------------
// Fetch taxonomy
// ---------------------------------------------------------------------------

function fetchTaxonomy() {
  return new Promise((resolve, reject) => {
    https.get('https://researchskills.ai/taxonomy.json', (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data).taxonomy);
        } catch (e) {
          reject(new Error('Failed to parse taxonomy: ' + e.message));
        }
      });
    }).on('error', reject);
  });
}

// ---------------------------------------------------------------------------
// Build classification prompt for one project
// ---------------------------------------------------------------------------

function buildPrompt(projectPath, sessions, taxonomyStr, isTest) {
  const slug = projectPath.split('/').filter(Boolean).pop() || 'unknown';

  // Gather prompt samples: first_prompt + sampled_prompts from up to 5 sessions
  const samples = [];
  const picked = sessions.slice(0, 5);
  for (const s of picked) {
    const lines = [`[Session ${s.session_id.substring(0, 8)} | ${s.user_message_count} msgs | ${Math.round(s.duration_minutes)}min]`];
    if (s.first_prompt) lines.push(`  First: ${String(s.first_prompt).substring(0, 300)}`);
    const sp = s.sampled_prompts || [];
    for (const p of sp.slice(0, 2)) {
      lines.push(`  Sample: ${String(p).substring(0, 200)}`);
    }
    samples.push(lines.join('\n'));
  }

  return `Classify this project and pick the best domain/subdomain.

## Project
Path slug: ${slug}
Sessions: ${sessions.length} total

## Message samples (from up to 5 sessions)
${samples.join('\n\n')}

## Available domains/subdomains
${taxonomyStr}

## Task
${isTest
    ? 'TEST MODE: Accept both research AND engineering projects. Map engineering to computer-science/software-engineering or the closest match.'
    : 'PRODUCTION MODE: Only classify as "research" if the sessions involve genuine scientific inquiry, research methodology, hypothesis testing, or academic writing. Software engineering (web dev, deployment, debugging, UI work) is NOT research regardless of difficulty.'}

Respond with EXACTLY this JSON (no markdown fences, no other text):
{"type":"research","domain":"...","subdomain":"...","project_name":"...","reason":"one sentence why","skip_patterns":["pattern1"]}

- type: "research" or "engineering" or "other"
- domain/subdomain: from the taxonomy list above. For engineering use "computer-science/software-engineering"
- project_name: a short, descriptive name (3-8 words) summarizing the research topic of this project based on the session content. Do NOT use the folder name. Examples: "Protein Folding Simulation Pipeline", "Neural ODE Parameter Estimation", "Galaxy Merger Classification". For engineering projects, describe the tool/system being built.
- reason: one sentence explaining classification
- skip_patterns: substrings in first_prompt that indicate non-research sessions to skip (e.g. "extract-knowhow", "npm run build"). Empty array if none.`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const platform = parsePlatformFlag();
  const runner = createRunner(platform);
  const opts = parseArgs();
  if (!opts.workListPath) {
    console.error('Usage: classify-projects.js <work-list.json> [--cc|--codex] [--test] [--verbose]');
    process.exit(1);
  }

  const workList = JSON.parse(fs.readFileSync(opts.workListPath, 'utf-8'));
  const sessions = workList.sessions || [];
  const projectMap = workList.projects || {};

  // Fetch taxonomy
  let taxonomy;
  try {
    taxonomy = await fetchTaxonomy();
  } catch (e) {
    console.error(`⚠ Failed to fetch taxonomy: ${e.message}. Using fallback.`);
    taxonomy = { 'computer-science': ['artificial-intelligence', 'software-engineering'] };
  }
  const taxonomyStr = Object.entries(taxonomy)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([d, subs]) => `${d}: ${subs.join(', ')}`)
    .join('\n');

  // Group sessions by project
  const byProject = {};
  for (const s of sessions) {
    const p = s.project_path;
    if (!byProject[p]) byProject[p] = [];
    byProject[p].push(s);
  }

  const result = { projects: {} };
  const projectPaths = Object.keys(byProject);

  console.log(`\nClassifying ${projectPaths.length} projects (${CONCURRENCY} at a time)...\n`);

  // Classify projects with bounded concurrency
  const classifyOne = async (projPath) => {
    const projSessions = byProject[projPath];
    const slug = projPath.split('/').filter(Boolean).pop() || 'unknown';

    const prompt = buildPrompt(projPath, projSessions, taxonomyStr, opts.test);
    const { ok, output, error } = await runner.classify(prompt);

    if (!ok) {
      return {
        projPath, slug, type: 'error', domain: null, subdomain: null,
        session_ids: projSessions.map(s => s.session_id),
        research_session_ids: [],
        skipped_session_ids: projSessions.map(s => s.session_id),
        reason: `Classification failed: ${error}`,
      };
    }

    // Parse JSON from Sonnet output.
    // Use bracket-balanced extraction instead of a greedy regex — if any text
    // follows the JSON (e.g. a Claude Code hook prints to stdout after the
    // response), the greedy /\{[\s\S]*\}/ would stretch to the last "}" in
    // that trailing text and produce invalid JSON for JSON.parse.
    let classification;
    try {
      const start = output.indexOf('{');
      if (start === -1) throw new Error('No JSON found in output');
      let depth = 0, end = -1;
      for (let i = start; i < output.length; i++) {
        if (output[i] === '{') depth++;
        else if (output[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
      }
      if (end === -1) throw new Error('Unbalanced JSON object in output');
      classification = JSON.parse(output.slice(start, end + 1));
    } catch (e) {
      if (opts.verbose) console.log(`  ${slug}: PARSE ERROR — ${e.message}\n    Output: ${output.substring(0, 200)}`);
      return {
        projPath, slug, type: 'error', domain: null, subdomain: null,
        session_ids: projSessions.map(s => s.session_id),
        research_session_ids: [],
        skipped_session_ids: projSessions.map(s => s.session_id),
        reason: `Parse error: ${e.message}`,
      };
    }

    // Filter sessions using skip_patterns
    const skipPatterns = classification.skip_patterns || [];
    const researchIds = [];
    const skippedIds = [];
    for (const s of projSessions) {
      const fp = String(s.first_prompt || '');
      if (skipPatterns.some(pat => fp.includes(pat))) {
        skippedIds.push(s.session_id);
      } else {
        researchIds.push(s.session_id);
      }
    }

    return {
      projPath, slug,
      type: classification.type || 'other',
      domain: classification.domain || null,
      subdomain: classification.subdomain || null,
      project_name: classification.project_name || null,
      session_ids: projSessions.map(s => s.session_id),
      research_session_ids: researchIds,
      skipped_session_ids: skippedIds,
      reason: classification.reason || '',
    };
  };

  // Process in batches of CONCURRENCY to avoid spawning too many CLI processes
  const classifications = [];
  for (let i = 0; i < projectPaths.length; i += CONCURRENCY) {
    const batch = projectPaths.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(batch.map(classifyOne));
    classifications.push(...batchResults);
    if (i + CONCURRENCY < projectPaths.length) {
      console.log(`  ... classified ${Math.min(i + CONCURRENCY, projectPaths.length)}/${projectPaths.length} projects`);
    }
  }

  // Collect results and print
  for (const c of classifications) {
    result.projects[c.projPath] = c;

    const tag = c.type === 'research' ? '✓ RESEARCH' :
                c.type === 'engineering' ? '✗ engineering' :
                c.type === 'error' ? '✗ ERROR' : '? other';
    console.log(`  ${c.slug} (${c.session_ids.length} sessions): ${tag}`);
    if (c.project_name) console.log(`    → "${c.project_name}"`);
    if (c.domain) console.log(`    → ${c.domain}/${c.subdomain}`);
    if (c.skipped_session_ids.length > 0) {
      console.log(`    → ${c.research_session_ids.length} research, ${c.skipped_session_ids.length} skipped`);
    }
    if (opts.verbose) console.log(`    Reason: ${c.reason}`);
  }

  // Write output
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));
  console.log(`\n✓ Classification saved to ${OUTPUT_PATH}`);

  // Summary
  const projects = Object.values(result.projects);
  const research = projects.filter(p => p.type === 'research');
  const totalResearchSessions = research.reduce((n, p) => n + p.research_session_ids.length, 0);
  console.log(`\n  ${research.length}/${projects.length} projects classified as research`);
  console.log(`  ${totalResearchSessions} research sessions to extract\n`);
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(1);
});

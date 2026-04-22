#!/usr/bin/env node
/**
 * extract-skills.js
 *
 * Orchestrates per-session skill extraction using AI CLI (via platform.js).
 * For each uncached session: format → call AI → validate.
 *
 * This script is the deterministic loop; Sonnet does the AI judgment.
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
 *   --project-name <name>     Project name (default: derived from session project_path)
 *   --project-slug <slug>     Project slug (default: derived from project-name)
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
const { execFileSync } = require('child_process');
const { parsePlatformFlag, createRunner } = require('./platform');

const FORMAT_SCRIPT = path.join(__dirname, 'format-session.js');
const VALIDATE_SCRIPT = path.join(__dirname, 'validate-skills.js');

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
    projectName: null,
    projectSlug: null,
    batchSize: Infinity,
    concurrency: 5,
    sessionIds: null,
    singleBatch: false,
    test: false,
    verbose: false,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--domain':        opts.domain = args[++i]; break;
      case '--subdomain':     opts.subdomain = args[++i]; break;
      case '--contributor':   opts.contributor = args[++i]; break;
      case '--project-name':  opts.projectName = args[++i]; break;
      case '--project-slug':  opts.projectSlug = args[++i]; break;
      case '--batch-size':    opts.batchSize = parseInt(args[++i], 10); break;
      case '--concurrency':   opts.concurrency = parseInt(args[++i], 10); break;
      case '--session-ids':   opts.sessionIds = args[++i].split(','); break;
      case '--single-batch':  opts.singleBatch = true; break;
      case '--test':          opts.test = true; break;
      case '--verbose':       opts.verbose = true; break;
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

function isSegmentCached(sessionId, segInfo) {
  const dir = path.join(os.homedir(), '.researchskills', 'cache', 'skills', sessionId);
  if (!segInfo) {
    // Single-segment session: cached if skills exist OR .done marker present
    try {
      const entries = fs.readdirSync(dir);
      if (entries.includes('.done')) return true;
      return entries.filter(f => f.endsWith('.md')).some(f => !/-s\d+-/.test(f));
    } catch { return false; }
  }
  // Multi-segment: check for segment-specific .done marker or skill files
  try {
    const entries = fs.readdirSync(dir);
    if (entries.includes(`.done-s${segInfo.index}`)) return true;
    const prefix = `-s${segInfo.index}-`;
    return entries.filter(f => f.endsWith('.md') && f.includes(prefix)).length > 0;
  } catch { return false; }
}

function formatSession(filePath, outputPath) {
  const stdout = run('node', [FORMAT_SCRIPT, filePath, outputPath]);
  try { return JSON.parse(stdout); } catch { return null; }
}

// ---------------------------------------------------------------------------
// Extraction prompt builder
// ---------------------------------------------------------------------------

function deriveProjectName(session, opts) {
  if (opts.projectName) return opts.projectName;
  // Derive from project_path (the cwd or CC project directory)
  const pp = session.project_path;
  if (!pp) return null;
  // Use the last path component as project name
  return path.basename(pp);
}

function slugify(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

function buildPrompt(segmentFile) {
  const sessionText = fs.readFileSync(segmentFile, 'utf-8');

  return `Extract research skills from this scientist-AI conversation. Output 0–10 skills. 0 is often correct.

## Quality Gate — ALL three must pass

1. **Non-obvious** — would a domain expert find this surprising?
2. **Session-specific** — grounded in a concrete event here, not generic advice?
3. **Research-only** — about scientific methodology, reasoning, or knowledge? Reject all engineering (UI, DevOps, database, build tools, git, auth, package management, visualization) even if the project is research-related.

## Boundary examples — same project, different verdicts

A research project contains BOTH research and engineering work. Extract only the research.

❌ REJECT (engineering):
- "Supabase onAuthStateChange callback deadlocks on re-entry" → auth/infra debugging
- "GitHub Rulesets vs Branch Protection Rules show different UI warnings" → platform ops
- "Static PNG unreadable at 130+ nodes, switch to interactive HTML/JS tree" → UI/visualization choice
- "Repository transfer converts collaborators to Outside Collaborators" → GitHub admin
- "README tables don't scale beyond 10 contributors" → UI/UX layout

✅ EXTRACT (research):
- "Claim-level diffing between paper and chat logs reveals unpublished research decisions" → methodology for tacit knowledge capture
- "LLMs fail at research due to task structure mismatch (long horizon + no verifier), not reasoning deficits" → frontier knowledge about AI capabilities
- "Predefined 20-action vocabulary with escape hatch balances structure vs flexibility for research ontology" → schema design for knowledge representation

When in doubt, ask: "Is this about HOW to do science, or HOW to build software?" Only the former qualifies.

## Skill types

Output each skill as a \`\`\`skill-md fenced block. YAML frontmatter: name, memory_type, subtype, llm_score (0–5), tags. Then markdown sections.

**procedural** — IF-THEN rules for research impasses (Soar impasse taxonomy):
- \`tie\`: Multiple viable paths, agent cannot rank them. Provide decision heuristics to break the tie.
- \`no-change\`: Completely stuck, no candidate action. Provide exploration strategies or problem reframing.
- \`constraint-failure\`: A methodological assumption turns out violated. Provide applicability boundaries and alternatives.
- \`operator-fail\`: Correct approach selected but execution fails. Provide diagnostics and failure patterns.
Sections: When + Exclusions → Decision (Preferred / Rejected / Reasoning) → Local Verifiers → Failure Handling → Anti-exemplars

**semantic** — Facts missing from LLM training data (ACT-R declarative memory):
- \`frontier\`: Post-training-cutoff knowledge — fact does not exist in model weights.
- \`non-public\`: Lab-internal or unpublished — never in any training corpus.
- \`correction\`: LLM actively gets this wrong — confident but incorrect default belief.
Sections: Fact → Evidence → LLM Default Belief (correction only) → Expiry Signal

**episodic** — Concrete research episodes as situation-action-outcome triples (CBR, Kolodner 1993):
- \`failure\`: Attempted X, failed due to hidden reason Y. Trigger: agent about to do something similar.
- \`adaptation\`: Standard method failed, workaround Z succeeded. Trigger: agent stuck with standard approach.
- \`anomalous\`: Expected A, observed B, turned out important. Trigger: agent observes similar anomaly.
Sections: Situation → Action → Outcome → Lesson → Retrieval Cues

## Rules

- De-identify: strip paths, usernames, project names, private URLs. Paraphrase non-English quotes in English. Preserve scientific content (materials, parameters, methods, public libraries).
- llm_score: 4–5 genuinely novel, 3 useful, 0–2 skip.

## Final line

SKILLS_EXTRACTED: <total> (E:<episodic> S:<semantic> P:<procedural>)

<session>
${sessionText}
</session>`;
}

// ---------------------------------------------------------------------------
// Parse skill-md blocks from Sonnet output → write files → validate
// ---------------------------------------------------------------------------

function injectProjectMeta(content, projectMeta) {
  if (!projectMeta || !content.startsWith('---')) return content;
  const lines = content.split('\n');
  const endIdx = lines.indexOf('---', 1);
  if (endIdx <= 0) return content;
  const insert = [];
  // Inject fixed fields that Sonnet no longer outputs
  if (projectMeta.domain) insert.push(`domain: ${projectMeta.domain}`);
  if (projectMeta.subdomain) insert.push(`subdomain: ${projectMeta.subdomain}`);
  if (projectMeta.contributor) insert.push(`contributor: ${projectMeta.contributor}`);
  if (projectMeta.sessionId) {
    insert.push(`source:`);
    insert.push(`  type: session`);
    insert.push(`  session_id: "${projectMeta.sessionId}"`);
  }
  if (projectMeta.extractedAt) insert.push(`extracted_at: "${projectMeta.extractedAt}"`);
  if (projectMeta.projectName) insert.push(`project_name: "${projectMeta.projectName}"`);
  if (projectMeta.projectSlug) insert.push(`project_slug: "${projectMeta.projectSlug}"`);
  if (insert.length === 0) return content;
  lines.splice(endIdx, 0, ...insert);
  return lines.join('\n');
}

function markSegmentDone(sessionId, segInfo) {
  const dir = path.join(os.homedir(), '.researchskills', 'cache', 'skills', sessionId);
  fs.mkdirSync(dir, { recursive: true });
  const marker = segInfo ? `.done-s${segInfo.index}` : '.done';
  fs.writeFileSync(path.join(dir, marker), '');
}

function writeAndValidateSkills(sessionId, output, projectMeta, segInfo) {
  const blocks = [];
  const regex = /```skill-md\n([\s\S]*?)```/g;
  let m;
  while ((m = regex.exec(output)) !== null) {
    blocks.push(m[1].trim());
  }

  if (blocks.length === 0) {
    markSegmentDone(sessionId, segInfo);
    return 0;
  }

  const segPrefix = segInfo ? `s${segInfo.index}-` : '';
  const skillFiles = [];
  for (let i = 0; i < blocks.length; i++) {
    const content = injectProjectMeta(blocks[i], projectMeta);
    const filePath = path.join(os.tmpdir(), `skill-${sessionId}-${segPrefix}${i + 1}.md`);
    fs.writeFileSync(filePath, content + '\n');
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

function prepareSession(session) {
  const sid = session.session_id;

  // Pre-filter by first_prompt
  const fp = (session.first_prompt || '').trim();
  if (fp && SKIP_PROMPT_PATTERNS.some(p => p.test(fp))) {
    return { sid, skip: 'trivial prompt' };
  }

  // The file_path recorded in work-list.json may have disappeared between
  // scan and extract (user cleanup, Claude Code retention, project rename).
  // Treat that as a per-session error so the batch keeps going instead of
  // the format-session subprocess throwing out of prepareSession().
  if (!fs.existsSync(session.file_path)) {
    return { sid, error: 'session file not found (removed after scan?)' };
  }

  // Format
  const outPath = path.join(os.tmpdir(), `session-${sid}.txt`);
  let meta;
  try {
    meta = formatSession(session.file_path, outPath);
  } catch (e) {
    return { sid, error: `format threw: ${(e.message || String(e)).split('\n')[0]}` };
  }
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
// Parse Sonnet output and collect result
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
  const platform = parsePlatformFlag();
  const runner = createRunner(platform);
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

  console.log(`\nSessions: ${sessions.length} total`);
  console.log(`Concurrency: ${opts.concurrency} parallel Sonnet calls\n`);

  // Phase 1: Pre-filter and format all sessions (fast, serial)
  // Segment-level caching is checked later in Phase 2
  console.log('Phase 1: Pre-filtering and formatting...');
  const prepared = [];
  const totals = { episodic: 0, semantic: 0, procedural: 0, errors: 0, skipped: 0 };

  for (const session of sessions) {
    const result = prepareSession(session);
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

  const batch = sessions;
  // Sessions that passed pre-filter but didn't fit in batch-size
  const remaining = sessions.length - totals.skipped - totals.errors - prepared.length;

  console.log(`  ${prepared.length} sessions ready, ${totals.skipped} skipped, ${totals.errors} errors\n`);

  if (prepared.length === 0) {
    console.log('No sessions to extract. Done.');
    process.exit(0);
  }

  // Phase 2: Build work units (one per segment, not per session)
  // Multi-segment sessions produce multiple work units, all processed in parallel
  // Segment-level caching: skip segments that already have cached skills
  const workUnits = [];
  let segmentsCached = 0;
  for (const { sid, formattedFiles } of prepared) {
    const totalSegs = formattedFiles.length;
    for (let si = 0; si < totalSegs; si++) {
      const segInfo = totalSegs > 1 ? { index: si + 1, total: totalSegs } : null;
      if (isSegmentCached(sid, segInfo)) {
        segmentsCached++;
        // Clean up formatted file for cached segment
        try { fs.unlinkSync(formattedFiles[si]); } catch {}
        continue;
      }
      // Find the original session object to pass to buildPrompt
      const session = batch.find(s => s.session_id === sid);
      const prompt = buildPrompt(formattedFiles[si]);
      const projectName = deriveProjectName(session, opts) || 'unknown';
      const projectSlug = opts.projectSlug || slugify(projectName) || 'unknown';
      const projectMeta = {
        projectName, projectSlug,
        domain: opts.domain || 'computer-science',
        subdomain: opts.subdomain || 'general',
        contributor: opts.contributor || 'anonymous',
        sessionId: sid,
        extractedAt: new Date().toISOString().split('T')[0],
      };
      workUnits.push({ sid, prompt, segFile: formattedFiles[si], segInfo, projectMeta });
    }
  }

  if (segmentsCached > 0) {
    console.log(`  ${segmentsCached} segments already cached, skipped`);
  }

  if (workUnits.length === 0) {
    console.log('All segments already cached. Nothing to do.');
    process.exit(0);
  }

  console.log(`\nPhase 2: Extracting skills (${prepared.length} sessions → ${workUnits.length} Sonnet calls, ${opts.concurrency} at a time)...`);
  const results = [];
  let completed = 0;

  for (let i = 0; i < workUnits.length; i += opts.concurrency) {
    const chunk = workUnits.slice(i, i + opts.concurrency);
    const batchNum = Math.floor(i / opts.concurrency) + 1;
    const totalBatches = Math.ceil(workUnits.length / opts.concurrency);

    console.log(`\n  Batch ${batchNum}/${totalBatches} (${chunk.length} calls):`);

    const promises = chunk.map(async ({ sid, prompt, segFile, segInfo, projectMeta }) => {
      const segLabel = segInfo ? ` seg${segInfo.index}/${segInfo.total}` : '';
      const startTime = Date.now();
      const { ok, output, error } = await runner.extract(prompt, 300_000);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      // Clean up segment file
      try { fs.unlinkSync(segFile); } catch {}

      if (!ok) {
        console.log(`    ${sid}${segLabel} → ERROR (${error}) [${elapsed}s]`);
        totals.errors++;
        return null;
      }

      // Parse skill-md blocks from output → inject project metadata → write files → validate
      const written = writeAndValidateSkills(sid, output, projectMeta, segInfo);

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

    if (opts.singleBatch) {
      const remainingCalls = workUnits.length - completed;
      console.log(`\n  --single-batch: stopping after batch ${batchNum}. ${remainingCalls} Sonnet calls remaining.`);
      break;
    }
  }

  // Clean up any remaining formatted files
  for (const { formattedFiles } of prepared) {
    for (const f of formattedFiles) { try { fs.unlinkSync(f); } catch {} }
  }

  // Count actual cached skills by reading cache directories
  const cachedCounts = { total: 0, episodic: 0, semantic: 0, procedural: 0 };
  const processedSids = new Set(prepared.map(p => p.sid));
  for (const sid of processedSids) {
    const cacheDir = path.join(os.homedir(), '.researchskills', 'cache', 'skills', sid);
    try {
      const files = fs.readdirSync(cacheDir).filter(f => f.endsWith('.md'));
      for (const file of files) {
        const content = fs.readFileSync(path.join(cacheDir, file), 'utf-8');
        const typeMatch = content.match(/memory_type:\s*(\w+)/);
        const memType = typeMatch ? typeMatch[1] : null;
        cachedCounts.total++;
        if (memType === 'episodic') cachedCounts.episodic++;
        else if (memType === 'semantic') cachedCounts.semantic++;
        else if (memType === 'procedural') cachedCounts.procedural++;
      }
    } catch {}
  }

  // Sonnet-reported totals (what Sonnet claimed to extract)
  const sonnetTotal = totals.episodic + totals.semantic + totals.procedural;

  console.log(`
═══════════════════════════════════════════════
  Extraction Complete
═══════════════════════════════════════════════
  Sessions processed: ${prepared.length}
  Sonnet reported:     ${sonnetTotal} skills (E:${totals.episodic} S:${totals.semantic} P:${totals.procedural})
  Actually cached:    ${cachedCounts.total} skills (E:${cachedCounts.episodic} S:${cachedCounts.semantic} P:${cachedCounts.procedural})
  Skipped:            ${totals.skipped} (trivial/too short)
  Errors:             ${totals.errors}
${remaining > 0 ? `  Remaining:          ${remaining} (run again to continue)` : ''}
═══════════════════════════════════════════════`);

  const summaryPath = path.join(os.tmpdir(), 'extract-skills-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    batch_size: prepared.length,
    model_reported: sonnetTotal,
    cached: cachedCounts,
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

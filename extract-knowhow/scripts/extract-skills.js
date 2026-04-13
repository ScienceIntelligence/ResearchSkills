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
    projectName: null,
    projectSlug: null,
    batchSize: Infinity,
    concurrency: 10,
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
  if (!isCached(sessionId)) return false;
  if (!segInfo) {
    // Single-segment session: cached if any non-segment-prefixed skill exists
    const dir = path.join(os.homedir(), '.openscientist', 'cache', 'skills', sessionId);
    try {
      const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
      return files.some(f => !/-s\d+-/.test(f));
    } catch { return false; }
  }
  // Multi-segment: check if any skill file with this segment prefix exists
  const dir = path.join(os.homedir(), '.openscientist', 'cache', 'skills', sessionId);
  try {
    const prefix = `-s${segInfo.index}-`;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f.includes(prefix));
    return files.length > 0;
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

  return `You extract research skills from scientist-AI conversations. Output AT MOST 3 skills per segment. 0 is acceptable and often correct.

## Quality Gate — every candidate must pass ALL three

1. **Non-obvious** — would a domain expert find this surprising? If not, skip.
2. **Session-specific** — grounded in a concrete event here, not generic advice you could write without the session? If not, skip.
3. **Research-relevant** — about research methodology, scientific reasoning, knowledge extraction, or academic writing? Reject all standard software engineering (debugging, git, CI/CD, deployment, npm, Docker, frontend, CSS, platform API quirks) and textbook-level advice.

## What to look for

- **Impasse moments**: researcher got stuck, assumptions failed, had to choose between approaches
- **Knowledge gaps**: facts the human provided that an LLM wouldn't know from training
- **Notable episodes**: failures, adaptations, or anomalous findings with transferable lessons

## Skill types and required sections

Output each skill as a \`\`\`skill-md fenced block with YAML frontmatter (name, memory_type, subtype, llm_score 0-5, tags) followed by markdown sections:

**episodic** — subtypes: failure (tried and failed), adaptation (hit obstacle, changed approach), anomalous (unexpected/counterintuitive result)
Sections: Situation → Action → Outcome → Lesson → Retrieval Cues

**semantic** — subtypes: frontier (cutting-edge, not in textbooks), non-public (internal/unpublished knowledge), correction (LLM believes X but Y is true)
Sections: Fact → Evidence → LLM Default Belief (correction only) → Expiry Signal

**procedural** — subtypes: tie (two viable options, one better), no-change (tempting to act but should hold), constraint-failure (plan failed due to hidden constraint), operator-fail (right strategy, wrong execution)
Sections: When + Exclusions → Decision (Preferred / Rejected alternatives / Reasoning) → Local Verifiers → Failure Handling → Anti-exemplars

## Rules

- Specific to THIS session. No generic advice.
- De-identify: strip file paths, usernames, project names, private URLs. Preserve scientific content.
- llm_score: 4-5 = genuinely novel, 3 = useful, 0-2 = probably should not extract.

## Final line

After all blocks: SKILLS_EXTRACTED: <total> (E:<episodic> S:<semantic> P:<procedural>)

## Session Text

<session>
${sessionText}
</session>`;
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

function injectProjectMeta(content, projectMeta) {
  if (!projectMeta || !content.startsWith('---')) return content;
  const lines = content.split('\n');
  const endIdx = lines.indexOf('---', 1);
  if (endIdx <= 0) return content;
  const insert = [];
  // Inject fixed fields that Haiku no longer outputs
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

function writeAndValidateSkills(sessionId, output, projectMeta, segInfo) {
  const blocks = [];
  const regex = /```skill-md\n([\s\S]*?)```/g;
  let m;
  while ((m = regex.exec(output)) !== null) {
    blocks.push(m[1].trim());
  }

  if (blocks.length === 0) return 0;

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

  console.log(`\nSessions: ${sessions.length} total`);
  console.log(`Concurrency: ${opts.concurrency} parallel Haiku calls\n`);

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

  console.log(`\nPhase 2: Extracting skills (${prepared.length} sessions → ${workUnits.length} Haiku calls, ${opts.concurrency} at a time)...`);
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
      const { ok, output, error } = await runClaudeAsync(prompt, 300_000);
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
      console.log(`\n  --single-batch: stopping after batch ${batchNum}. ${remainingCalls} Haiku calls remaining.`);
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
    const cacheDir = path.join(os.homedir(), '.openscientist', 'cache', 'skills', sid);
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

  // Haiku-reported totals (what Haiku claimed to extract)
  const haikuTotal = totals.episodic + totals.semantic + totals.procedural;

  console.log(`
═══════════════════════════════════════════════
  Extraction Complete
═══════════════════════════════════════════════
  Sessions processed: ${prepared.length}
  Haiku reported:     ${haikuTotal} skills (E:${totals.episodic} S:${totals.semantic} P:${totals.procedural})
  Actually cached:    ${cachedCounts.total} skills (E:${cachedCounts.episodic} S:${cachedCounts.semantic} P:${cachedCounts.procedural})
  Skipped:            ${totals.skipped} (trivial/too short)
  Errors:             ${totals.errors}
${remaining > 0 ? `  Remaining:          ${remaining} (run again to continue)` : ''}
═══════════════════════════════════════════════`);

  const summaryPath = path.join(os.tmpdir(), 'extract-skills-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify({
    batch_size: prepared.length,
    haiku_reported: haikuTotal,
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

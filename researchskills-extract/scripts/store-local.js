#!/usr/bin/env node
/**
 * store-local.js
 *
 * Install extracted research skills into the user's local AI coding tool
 * configuration so they are available as commands/skills in future sessions.
 *
 * Targets:
 *   - Claude Code: ~/.claude/commands/researchskills/<skill>.md
 *   - Codex:       ~/.codex/skills/researchskills/<skill>.md
 *
 * Usage:
 *   store-local.js --target claude|codex|both --session-ids id1,id2,...
 *
 * Reads validated skills from ~/.researchskills/cache/skills/<session_id>/
 * and copies them to the chosen target(s). Deduplicates by skill filename.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const CACHE_DIR = path.join(os.homedir(), '.researchskills', 'cache', 'skills');

const TARGETS = {
  claude: path.join(os.homedir(), '.claude', 'commands', 'researchskills'),
  codex: path.join(os.homedir(), '.codex', 'skills', 'researchskills'),
};

function collectSkills(sessionIds) {
  const skills = new Map(); // filename → { src, sessionId }
  for (const sid of sessionIds) {
    const sessionDir = path.join(CACHE_DIR, sid);
    if (!fs.existsSync(sessionDir)) continue;
    for (const file of fs.readdirSync(sessionDir)) {
      if (!file.endsWith('.md')) continue;
      // Later sessions overwrite earlier ones for same-named skills (dedup)
      skills.set(file, { src: path.join(sessionDir, file), sessionId: sid });
    }
  }
  return skills;
}

function storeToTarget(targetName, skills) {
  const targetDir = TARGETS[targetName];
  if (!targetDir) {
    console.error(`Unknown target: ${targetName}`);
    return { installed: 0, skipped: 0 };
  }

  fs.mkdirSync(targetDir, { recursive: true });

  let installed = 0;
  let skipped = 0;

  for (const [filename, { src }] of skills) {
    const dst = path.join(targetDir, filename);
    if (fs.existsSync(dst)) {
      // Check if content is identical
      const srcContent = fs.readFileSync(src, 'utf-8');
      const dstContent = fs.readFileSync(dst, 'utf-8');
      if (srcContent === dstContent) {
        skipped++;
        continue;
      }
    }
    fs.copyFileSync(src, dst);
    installed++;
  }

  return { installed, skipped, dir: targetDir };
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  let target = null;
  let sessionIds = [];

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--target':     target = args[++i]; break;
      case '--session-ids': sessionIds = args[++i].split(',').filter(Boolean); break;
    }
  }

  if (!target || sessionIds.length === 0) {
    console.error('Usage: store-local.js --target claude|codex|both --session-ids id1,id2,...');
    process.exit(1);
  }

  const skills = collectSkills(sessionIds);

  if (skills.size === 0) {
    console.log('No cached skills found for the given session IDs.');
    process.exit(0);
  }

  const targets = target === 'both' ? ['claude', 'codex'] : [target];
  const results = {};

  for (const t of targets) {
    const result = storeToTarget(t, skills);
    results[t] = result;
    if (result.installed > 0) {
      console.log(`✓ ${t}: ${result.installed} skill(s) installed to ${result.dir}`);
    }
    if (result.skipped > 0) {
      console.log(`  ${t}: ${result.skipped} skill(s) already up-to-date`);
    }
  }

  // Output JSON summary for the calling agent to parse
  console.log(`\n${JSON.stringify({ total: skills.size, results })}`);
}

module.exports = { collectSkills, storeToTarget, TARGETS };

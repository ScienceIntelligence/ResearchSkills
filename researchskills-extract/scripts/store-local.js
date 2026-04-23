#!/usr/bin/env node
/**
 * store-local.js
 *
 * Install extracted research skills into the user's local AI coding tool
 * configuration so they are available as commands/skills in future sessions.
 *
 * Targets:
 *   - Claude Code: ~/.claude/commands/researchskills/<slug>.md
 *   - Codex:       ~/.codex/skills/researchskills-<slug>/SKILL.md
 *
 * Skill slugs are derived from the YAML frontmatter `name` field, not from
 * cache temp filenames. Deduplication uses the slug, so re-extractions that
 * produce the same skill name will overwrite cleanly.
 *
 * Usage:
 *   store-local.js --target claude|codex|both --session-ids id1,id2,...
 *
 * Reads validated skills from ~/.researchskills/cache/skills/<session_id>/
 * and copies them to the chosen target(s).
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const CACHE_DIR = path.join(os.homedir(), '.researchskills', 'cache', 'skills');

/**
 * Extract a field from YAML frontmatter.
 * Returns null if not found.
 */
function extractField(content, field) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fieldMatch = match[1].match(new RegExp(`^${field}:\\s*["']?(.+?)["']?\\s*$`, 'm'));
  return fieldMatch ? fieldMatch[1].trim() : null;
}

/**
 * Turn a skill name into a filesystem-safe slug.
 */
function slugify(name) {
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80) || 'unnamed-skill';
}

function collectSkills(sessionIds) {
  const skills = new Map(); // slug → { src, content, name }
  for (const sid of sessionIds) {
    const sessionDir = path.join(CACHE_DIR, sid);
    if (!fs.existsSync(sessionDir)) continue;
    for (const file of fs.readdirSync(sessionDir)) {
      if (!file.endsWith('.md')) continue;
      const src = path.join(sessionDir, file);
      const content = fs.readFileSync(src, 'utf-8');
      const name = extractField(content, 'name');
      const slug = slugify(name || path.basename(file, '.md'));
      const existing = skills.get(slug);
      // Keep the longer body for same-slug duplicates (matches validate-skills.js collect behavior)
      if (existing && existing.content.length >= content.length) continue;
      skills.set(slug, { src, content, name: name || slug });
    }
  }
  return skills;
}

function storeToTarget(targetName, skills) {
  let installed = 0;
  let skipped = 0;
  let dir;

  if (targetName === 'claude') {
    // Claude Code: ~/.claude/commands/researchskills/<slug>.md
    dir = path.join(os.homedir(), '.claude', 'commands', 'researchskills');
    fs.mkdirSync(dir, { recursive: true });

    for (const [slug, { content }] of skills) {
      const dst = path.join(dir, `${slug}.md`);
      if (fs.existsSync(dst) && fs.readFileSync(dst, 'utf-8') === content) {
        skipped++;
        continue;
      }
      fs.writeFileSync(dst, content);
      installed++;
    }
  } else if (targetName === 'codex') {
    // Codex: ~/.codex/skills/researchskills-<slug>/SKILL.md
    dir = path.join(os.homedir(), '.codex', 'skills');
    fs.mkdirSync(dir, { recursive: true });

    for (const [slug, { content, name }] of skills) {
      // Codex requires a `description` field in frontmatter to index the skill
      let finalContent = content;
      if (!extractField(content, 'description')) {
        const memoryType = extractField(content, 'memory_type') || 'research';
        const desc = `ResearchSkills ${memoryType} skill: ${name}`;
        finalContent = content.replace(/^(---\s*\n)/, `$1description: "${desc}"\n`);
      }
      const skillDir = path.join(dir, `researchskills-${slug}`);
      fs.mkdirSync(skillDir, { recursive: true });
      const dst = path.join(skillDir, 'SKILL.md');
      if (fs.existsSync(dst) && fs.readFileSync(dst, 'utf-8') === finalContent) {
        skipped++;
        continue;
      }
      fs.writeFileSync(dst, finalContent);
      installed++;
    }
  } else {
    console.error(`Unknown target: ${targetName}`);
    return { installed: 0, skipped: 0 };
  }

  return { installed, skipped, dir };
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

module.exports = { collectSkills, storeToTarget, slugify, extractField };

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
const crypto = require('crypto');

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

/**
 * Hash the contributor field for de-identification (matches validate-skills.js).
 */
function hashContributor(content) {
  const match = content.match(/^contributor:\s*(.+)$/m);
  if (!match) return content;
  const raw = match[1].trim().replace(/^["']|["']$/g, '');
  if (raw.startsWith('anon-')) return content; // already hashed
  const hash = crypto.createHash('sha256').update(raw).digest('hex').substring(0, 8);
  return content.replace(/^contributor:\s*.+$/m, `contributor: anon-${hash}`);
}

/**
 * Extract the body (everything after the closing ---) from a skill file.
 */
function extractBody(content) {
  const match = content.match(/^---\s*\n[\s\S]*?\n---\s*\n([\s\S]*)$/);
  return match ? match[1] : content;
}

function collectSkills(sessionIds) {
  // Dedup by (name, domain, subdomain, memory_type) to preserve distinct skills
  // while still collapsing true duplicates
  const byKey = new Map();
  for (const sid of sessionIds) {
    const sessionDir = path.join(CACHE_DIR, sid);
    if (!fs.existsSync(sessionDir)) continue;
    for (const file of fs.readdirSync(sessionDir)) {
      if (!file.endsWith('.md')) continue;
      const src = path.join(sessionDir, file);
      const content = fs.readFileSync(src, 'utf-8');
      const name = extractField(content, 'name') || path.basename(file, '.md');
      const domain = (extractField(content, 'domain') || '').toLowerCase();
      const subdomain = (extractField(content, 'subdomain') || '').toLowerCase();
      const memType = (extractField(content, 'memory_type') || '').toLowerCase();
      const key = `${name.toLowerCase()}|${domain}|${subdomain}|${memType}`;
      const bodyLen = extractBody(content).length;
      const existing = byKey.get(key);
      // Keep the longer body for duplicates (matches validate-skills.js collect behavior)
      if (existing && existing.bodyLen >= bodyLen) continue;
      byKey.set(key, { content, name, bodyLen });
    }
  }
  // Convert to slug-keyed map, appending suffix on collision
  const skills = new Map();
  for (const { content, name } of byKey.values()) {
    let slug = slugify(name);
    let finalSlug = slug;
    let suffix = 2;
    while (skills.has(finalSlug)) {
      finalSlug = `${slug}-${suffix++}`;
    }
    skills.set(finalSlug, { content: hashContributor(content), name });
  }
  return skills;
}

function storeToTarget(targetName, skills) {
  let installed = 0;
  let skipped = 0;
  let dir;

  if (targetName === 'claude') {
    // Claude Code: ~/.claude/commands/researchskills/<slug>.md
    // Strip YAML frontmatter — Claude commands are plain markdown prompts
    dir = path.join(os.homedir(), '.claude', 'commands', 'researchskills');
    fs.mkdirSync(dir, { recursive: true });

    for (const [slug, { content, name }] of skills) {
      const body = extractBody(content).trim();
      // Prepend a markdown title from the skill name
      const commandContent = `# ${name}\n\n${body}\n`;
      const dst = path.join(dir, `${slug}.md`);
      if (fs.existsSync(dst) && fs.readFileSync(dst, 'utf-8') === commandContent) {
        skipped++;
        continue;
      }
      fs.writeFileSync(dst, commandContent);
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
        const rawDesc = `ResearchSkills ${memoryType} skill: ${name}`;
        // Escape quotes and backslashes for valid YAML
        const desc = rawDesc.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
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
    throw new Error(`Unknown target: "${targetName}". Must be "claude", "codex", or "both".`);
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

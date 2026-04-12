#!/usr/bin/env node
/**
 * validate-skills.js
 *
 * Helper for the /extract-knowhow AI phase. The AI reads a formatted
 * session and extracts cognitive memory-type skills as markdown files.
 * This script validates the skill markdown (frontmatter + required
 * sections) and caches validated skills per session.
 *
 * Subcommands:
 *   save <session_id> <file1.md> [file2.md ...]
 *       Validate each skill file and copy to cache dir.
 *
 *   list [session_id]
 *       Print JSON array of cached sessions, or skills within a session.
 *
 *   collect <output_dir> [session_ids_csv]
 *       Copy cached skills to output dir. Print count.
 *
 *   is-cached <session_id>
 *       Exit 0 if any cached skills exist for this session, 1 otherwise.
 *
 * Cache location: ~/.openscientist/cache/skills/<session_id>/
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');

const CACHE_DIR = path.join(os.homedir(), '.openscientist', 'cache', 'skills');

const VALID_MEMORY_TYPES = new Set(['procedural', 'semantic', 'episodic']);

const VALID_SUBTYPES = {
  procedural: new Set(['tie', 'no-change', 'constraint-failure', 'operator-fail']),
  semantic: new Set(['frontier', 'non-public', 'correction']),
  episodic: new Set(['failure', 'adaptation', 'anomalous']),
};

const REQUIRED_SECTIONS = {
  procedural: ['When', 'Decision', 'Local Verifiers', 'Failure Handling'],
  semantic: ['Fact', 'Evidence'],
  episodic: ['Situation', 'Action', 'Outcome', 'Retrieval Cues'],
};

const REQUIRED_FRONTMATTER_FIELDS = [
  'name', 'memory_type', 'subtype', 'domain', 'subdomain', 'contributor',
];

/**
 * Parse simple YAML frontmatter from markdown content.
 * Handles flat keys, one level of nesting, and arrays in [a, b] format.
 */
function parseFrontmatter(content) {
  const lines = content.split('\n');
  if (lines[0].trim() !== '---') return null;

  let endIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      endIdx = i;
      break;
    }
  }
  if (endIdx === -1) return null;

  const fm = {};
  let currentKey = null;

  for (let i = 1; i < endIdx; i++) {
    const line = lines[i];
    // Skip empty lines and comments
    if (line.trim() === '' || line.trim().startsWith('#')) continue;

    // Check for nested key (indented with spaces)
    if (/^\s+\w/.test(line) && currentKey) {
      const match = line.match(/^\s+(\w[\w_-]*):\s*(.*)/);
      if (match) {
        if (typeof fm[currentKey] !== 'object' || Array.isArray(fm[currentKey])) {
          fm[currentKey] = {};
        }
        fm[currentKey][match[1]] = parseValue(match[2]);
      }
      continue;
    }

    // Top-level key
    const match = line.match(/^(\w[\w_-]*):\s*(.*)/);
    if (match) {
      currentKey = match[1];
      fm[currentKey] = parseValue(match[2]);
    }
  }

  return { frontmatter: fm, body: lines.slice(endIdx + 1).join('\n') };
}

function parseValue(raw) {
  const val = raw.trim();
  if (val === '') return '';
  // Array in [a, b] format
  if (val.startsWith('[') && val.endsWith(']')) {
    return val
      .slice(1, -1)
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }
  // Strip quotes
  if ((val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))) {
    return val.slice(1, -1);
  }
  return val;
}

/**
 * Validate a skill markdown file. Returns an array of error strings.
 */
function validateSkill(content, filename) {
  const errors = [];
  const parsed = parseFrontmatter(content);

  if (!parsed) {
    errors.push(`${filename}: missing or malformed YAML frontmatter`);
    return errors;
  }

  const { frontmatter: fm, body } = parsed;

  // Check required frontmatter fields
  for (const field of REQUIRED_FRONTMATTER_FIELDS) {
    if (!fm[field] || (typeof fm[field] === 'string' && fm[field].trim() === '')) {
      errors.push(`${filename}: missing required frontmatter field "${field}"`);
    }
  }

  // Validate memory_type
  const memType = fm.memory_type;
  if (memType && !VALID_MEMORY_TYPES.has(memType)) {
    errors.push(`${filename}: invalid memory_type "${memType}"`);
    return errors; // Can't validate further without valid type
  }

  // Validate subtype against memory_type
  if (memType && fm.subtype) {
    const validSubs = VALID_SUBTYPES[memType];
    if (validSubs && !validSubs.has(fm.subtype)) {
      errors.push(
        `${filename}: invalid subtype "${fm.subtype}" for memory_type "${memType}" ` +
        `(valid: ${[...validSubs].join(', ')})`
      );
    }
  }

  // Check required body sections for the memory type
  if (memType && REQUIRED_SECTIONS[memType]) {
    const requiredSections = REQUIRED_SECTIONS[memType];
    for (const section of requiredSections) {
      const pattern = new RegExp(`^##\\s+${escapeRegExp(section)}\\s*$`, 'm');
      if (!pattern.test(body)) {
        errors.push(`${filename}: missing required section "## ${section}"`);
      }
    }
  }

  return errors;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sessionCacheDir(sessionId) {
  return path.join(CACHE_DIR, sessionId);
}

function saveSkill(sessionId, filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const errors = validateSkill(content, filename);

  if (errors.length > 0) {
    return { ok: false, errors, filename };
  }

  const dest = sessionCacheDir(sessionId);
  fs.mkdirSync(dest, { recursive: true });
  fs.copyFileSync(filePath, path.join(dest, filename));
  return { ok: true, errors: [], filename };
}

function isCached(sessionId) {
  const dir = sessionCacheDir(sessionId);
  if (!fs.existsSync(dir)) return false;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  return files.length > 0;
}

function listCachedSessions() {
  if (!fs.existsSync(CACHE_DIR)) return [];
  return fs
    .readdirSync(CACHE_DIR)
    .filter((f) => {
      const full = path.join(CACHE_DIR, f);
      return fs.statSync(full).isDirectory();
    });
}

function listSkillsInSession(sessionId) {
  const dir = sessionCacheDir(sessionId);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
}

function collectSkills(outputDir, filterIds) {
  const sessions = listCachedSessions();
  const filter = filterIds && filterIds.length > 0 ? new Set(filterIds) : null;
  let count = 0;

  fs.mkdirSync(outputDir, { recursive: true });

  for (const sid of sessions) {
    if (filter && !filter.has(sid)) continue;
    const srcDir = sessionCacheDir(sid);
    const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      fs.copyFileSync(
        path.join(srcDir, file),
        path.join(outputDir, file)
      );
      count++;
    }
  }
  return count;
}

function printUsage() {
  console.error('Usage: validate-skills.js <command> [args...]');
  console.error('');
  console.error('Commands:');
  console.error('  save <session_id> <file1.md> [file2.md ...]');
  console.error('      Validate skill files and cache them.');
  console.error('  list [session_id]');
  console.error('      List cached sessions or skills within a session.');
  console.error('  collect <output_dir> [session_ids_csv]');
  console.error('      Copy cached skills to output dir.');
  console.error('  is-cached <session_id>');
  console.error('      Exit 0 if cached skills exist, 1 otherwise.');
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  const cmd = args[0];

  try {
    if (cmd === 'save') {
      if (args.length < 3) {
        printUsage();
        process.exit(1);
      }
      const sessionId = args[1];
      const files = args.slice(2).map((f) => path.resolve(f));
      let allOk = true;

      for (const filePath of files) {
        const result = saveSkill(sessionId, filePath);
        if (result.ok) {
          console.log(`✓ ${result.filename}`);
        } else {
          allOk = false;
          console.error(`✗ ${result.filename}`);
          result.errors.forEach((e) => console.error(`  - ${e}`));
        }
      }

      if (!allOk) process.exit(1);
    } else if (cmd === 'list') {
      if (args[1]) {
        console.log(JSON.stringify(listSkillsInSession(args[1]), null, 2));
      } else {
        console.log(JSON.stringify(listCachedSessions(), null, 2));
      }
    } else if (cmd === 'collect') {
      if (args.length < 2) {
        printUsage();
        process.exit(1);
      }
      const outputDir = path.resolve(args[1]);
      const filter = args[2] ? args[2].split(',').map((s) => s.trim()) : null;
      const count = collectSkills(outputDir, filter);
      console.log(
        `✓ Collected ${count} skills → ${path.relative(process.cwd(), outputDir)}`
      );
    } else if (cmd === 'is-cached') {
      if (args.length < 2) {
        printUsage();
        process.exit(1);
      }
      process.exit(isCached(args[1]) ? 0 : 1);
    } else {
      printUsage();
      process.exit(1);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = {
  parseFrontmatter,
  validateSkill,
  saveSkill,
  isCached,
  listCachedSessions,
  listSkillsInSession,
  collectSkills,
  CACHE_DIR,
  VALID_MEMORY_TYPES,
  VALID_SUBTYPES,
  REQUIRED_SECTIONS,
};

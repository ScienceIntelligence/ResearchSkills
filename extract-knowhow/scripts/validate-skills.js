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
 * Cache location: ~/.researchskills/cache/skills/<session_id>/
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const CACHE_DIR = path.join(os.homedir(), '.researchskills', 'cache', 'skills');

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

// Engineering tags — if a skill's tags hit 2+ of these, reject as engineering
const ENGINEERING_TAGS = new Set([
  'canvas', 'canvas-2d', 'css', 'frontend', 'deployment', 'railway', 'vercel',
  'docker', 'supabase', 'database', 'npm', 'webpack', 'vite', 'browser',
  'rendering', 'ui', 'devops', 'ci-cd', 'hosting', 'dns', 'tls',
  'postgresql', 'redis', 'connection-pooling', 'responsive-design',
  'svg', 'animations', 'websocket', 'localstorage', 'typescript-config',
  'github-actions', 'codeowners', 'pr-workflows', 'git',
  'ui-performance', 'fractal-geometry', 'browser-quirks', 'color-formats',
  'environment-variables', 'nodejs',
  'mermaid', 'diagram', 'visualization', 'd3', 'chart',
  'oauth', 'jwt', 'authentication', 'session-management',
  'logging', 'debugging', 'error-handling', 'stack-trace',
  'naming-convention', 'terminology', 'ux-copy', 'localization',
]);

const MIN_LLM_SCORE = 3;

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

  // Reject low llm_score
  const score = Number(fm.llm_score);
  if (!isNaN(score) && score < MIN_LLM_SCORE) {
    errors.push(`${filename}: rejected (llm_score ${score} < ${MIN_LLM_SCORE})`);
  }

  // Reject engineering content by tag overlap
  const tags = Array.isArray(fm.tags) ? fm.tags.map(t => String(t).toLowerCase()) : [];
  const engHits = tags.filter(t => ENGINEERING_TAGS.has(t));
  if (engHits.length >= 2) {
    errors.push(`${filename}: rejected as engineering (tags: ${engHits.join(', ')})`);
  }

  // PII detection — reject skills with leaked personal/private data
  const bodyText = body || '';
  const SAFE_URL_HOSTS = /^https?:\/\/(?:arxiv\.org|doi\.org|github\.com|en\.wikipedia\.org|researchskills\.ai)/;
  const PLACEHOLDER_EMAIL = /^[a-z]@[a-z]\.[a-z]+$/; // e.g. x@y.com
  const piiChecks = [
    {
      pattern: /https?:\/\/[^\s)"`]+/g,
      label: 'private URL',
      filter: (m) => !SAFE_URL_HOSTS.test(m),
    },
    { pattern: /[\u4e00-\u9fff]{4,}/g, label: 'CJK text (possible direct quote)', filter: null },
    {
      pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      label: 'email address',
      filter: (m) => !PLACEHOLDER_EMAIL.test(m.toLowerCase()),
    },
  ];
  for (const { pattern, label, filter } of piiChecks) {
    const matches = bodyText.match(pattern) || [];
    const real = filter ? matches.filter(filter) : matches;
    if (real.length > 0) {
      errors.push(`${filename}: potential PII — ${label}: "${real[0].substring(0, 60)}"`);
    }
  }

  return errors;
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hashContributor(content) {
  const match = content.match(/^contributor:\s*(.+)$/m);
  if (!match) return content;
  const raw = match[1].trim().replace(/^["']|["']$/g, '');
  const hash = crypto.createHash('sha256').update(raw).digest('hex').substring(0, 8);
  return content.replace(/^contributor:\s*.+$/m, `contributor: anon-${hash}`);
}

function sessionCacheDir(sessionId) {
  return path.join(CACHE_DIR, sessionId);
}

function saveSkill(sessionId, filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const filename = path.basename(filePath);
  const errors = validateSkill(content, filename);

  if (errors.length > 0) {
    return { ok: false, errors, filename };
  }

  const dest = sessionCacheDir(sessionId);
  fs.mkdirSync(dest, { recursive: true });
  fs.writeFileSync(path.join(dest, filename), content);
  return { ok: true, errors: [], filename };
}

function isCached(sessionId) {
  const dir = sessionCacheDir(sessionId);
  if (!fs.existsSync(dir)) return false;
  const entries = fs.readdirSync(dir);
  // Cached if skills exist OR .done marker present (segment produced 0 skills)
  return entries.some((f) => f.endsWith('.md') || f.startsWith('.done'));
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
  let duplicates = 0;

  fs.mkdirSync(outputDir, { recursive: true });

  // Deduplicate by skill name across segments/sessions.
  // For same-name skills, keep the one with longer body content.
  const seenNames = new Map(); // name → { file, srcPath, bodyLen }

  for (const sid of sessions) {
    if (filter && !filter.has(sid)) continue;
    const srcDir = sessionCacheDir(sid);
    const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.md'));
    for (const file of files) {
      const srcPath = path.join(srcDir, file);
      const content = fs.readFileSync(srcPath, 'utf-8');
      const parsed = parseFrontmatter(content);
      const name = parsed && parsed.frontmatter && parsed.frontmatter.name
        ? String(parsed.frontmatter.name).trim().toLowerCase()
        : null;

      if (name && seenNames.has(name)) {
        // Duplicate — keep the longer one
        const existing = seenNames.get(name);
        const bodyLen = parsed.body ? parsed.body.length : 0;
        if (bodyLen > existing.bodyLen) {
          seenNames.set(name, { file, srcPath, bodyLen });
        }
        duplicates++;
        continue;
      }

      const bodyLen = parsed && parsed.body ? parsed.body.length : 0;
      if (name) {
        seenNames.set(name, { file, srcPath, bodyLen });
      } else {
        // No parseable name — copy directly (don't deduplicate)
        fs.copyFileSync(srcPath, path.join(outputDir, file));
        count++;
      }
    }
  }

  // Copy deduplicated skills, hashing contributor for de-identification
  for (const { file, srcPath } of seenNames.values()) {
    let content = fs.readFileSync(srcPath, 'utf-8');
    content = hashContributor(content);
    fs.writeFileSync(path.join(outputDir, file), content);
    count++;
  }

  if (duplicates > 0) {
    console.log(`  Deduplicated: ${duplicates} duplicate skills removed`);
  }
  return count;
}

function revalidateCache(filterSessionId) {
  const sessions = filterSessionId ? [filterSessionId] : listCachedSessions();
  let total = 0, removed = 0;

  for (const sid of sessions) {
    const dir = sessionCacheDir(sid);
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));

    for (const file of files) {
      total++;
      const filePath = path.join(dir, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const errors = validateSkill(content, file);
      if (errors.length > 0) {
        removed++;
        fs.unlinkSync(filePath);
        console.log(`  ✗ ${sid}/${file}`);
        errors.forEach((e) => console.log(`    ${e}`));
      }
    }

    // Clean up empty session dirs
    if (fs.existsSync(dir) && fs.readdirSync(dir).filter(f => f.endsWith('.md')).length === 0) {
      fs.rmdirSync(dir);
    }
  }

  console.log(`\nRevalidated ${total} skills: ${removed} removed, ${total - removed} kept.`);
  return { total, removed };
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
  console.error('  revalidate [session_id]');
  console.error('      Re-validate cached skills with current rules. Removes failures.');
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
    } else if (cmd === 'revalidate') {
      revalidateCache(args[1] || null);
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

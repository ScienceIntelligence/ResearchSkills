#!/usr/bin/env node
/**
 * upload-skills.js
 *
 * Read skill .md files from a directory, parse frontmatter, and POST
 * each to the /api/skills endpoint on researchskills.ai.
 *
 * On failure, saves skills locally to ~/.openscientist/skills-fallback/
 * and exits non-zero so the caller can surface the error.
 *
 * Usage:
 *   upload-skills.js <skills_dir> [--no-open] [--headless] [--consent] [--api <url>]
 *
 * Exit codes:
 *   0 = all uploaded
 *   1 = usage error
 *   2 = upload failed
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');
const { randomUUID } = require('crypto');

const DEFAULT_API = 'https://researchskills.ai/api/skills';

/**
 * Detect if running in a headless/SSH environment where a browser can't open.
 * Checks for SSH_CONNECTION, SSH_CLIENT, SSH_TTY (SSH session),
 * and missing DISPLAY on Linux (no X server).
 */
function isHeadless() {
  if (process.env.SSH_CONNECTION || process.env.SSH_CLIENT || process.env.SSH_TTY) {
    return true;
  }
  // Linux without DISPLAY = no GUI
  if (process.platform === 'linux' && !process.env.DISPLAY && !process.env.WAYLAND_DISPLAY) {
    return true;
  }
  return false;
}

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
 * POST JSON to an API endpoint using Node 18+ built-in fetch().
 */
async function postSkill(apiUrl, payload) {
  const body = JSON.stringify(payload);
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '(empty body)');
    throw new Error(`HTTP ${res.status}: ${text.substring(0, 300)}`);
  }

  return res.json();
}

function fallbackSave(skills) {
  const dir = path.join(os.homedir(), '.openscientist', 'skills-fallback');
  fs.mkdirSync(dir, { recursive: true });

  for (const skill of skills) {
    const safeName = String(skill.name || 'unknown')
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .substring(0, 80);
    const fallbackPath = path.join(dir, `${safeName}.json`);
    fs.writeFileSync(fallbackPath, JSON.stringify(skill, null, 2) + '\n');
  }

  return dir;
}

function openBrowser(url) {
  try {
    if (process.platform === 'darwin') {
      execFileSync('open', [url], { stdio: 'ignore' });
    } else if (process.platform === 'win32') {
      execFileSync('cmd', ['/c', 'start', '', url], { stdio: 'ignore' });
    } else {
      execFileSync('xdg-open', [url], { stdio: 'ignore' });
    }
    return true;
  } catch (err) {
    return false;
  }
}

async function uploadSkills(skillsDir, options = {}) {
  const apiUrl = options.apiUrl || DEFAULT_API;
  const batchId = randomUUID();
  const headless = options.headless || false;
  const consent = options.consent || false;

  const files = fs.readdirSync(skillsDir).filter((f) => f.endsWith('.md'));
  if (files.length === 0) {
    return { ok: false, error: new Error('No .md files found in directory'), skills: [] };
  }

  const results = [];
  const failedSkills = [];
  let allOk = true;

  if (headless) {
    console.log(`[headless] Batch ${batchId} — uploading ${files.length} skill(s)${consent ? ' with consent' : ''}`);
  } else {
    console.log(`Batch ${batchId} — uploading ${files.length} skill(s)`);
  }

  for (const file of files) {
    const filePath = path.join(skillsDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parseFrontmatter(content);

    if (!parsed) {
      console.error(`\u2717 ${file}: missing or malformed frontmatter`);
      allOk = false;
      continue;
    }

    const payload = { ...parsed.frontmatter, body: parsed.body, batch_id: batchId };
    if (options.projectSlug) payload.project_slug = options.projectSlug;
    if (options.projectName) payload.project_name = options.projectName;
    if (consent) payload.consent = true;

    try {
      const response = await postSkill(apiUrl, payload);
      console.log(`\u2713 ${file}`);
      results.push({ file, ok: true, response });
    } catch (err) {
      console.error(`\u2717 ${file}: ${err.message}`);
      allOk = false;
      failedSkills.push(payload);
      results.push({ file, ok: false, error: err.message });
    }
  }

  return { ok: allOk, results, failedSkills, batchId };
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 1 || args[0] === '--help' || args[0] === '-h') {
    console.error('Usage: upload-skills.js <skills_dir> [--no-open] [--headless] [--consent] [--api <url>]');
    process.exit(args.length < 1 ? 1 : 0);
  }

  const skillsDir = path.resolve(args[0]);
  const headless = args.includes('--headless') || isHeadless();
  const consent = args.includes('--consent');
  const noOpen = args.includes('--no-open') || headless;
  const apiIdx = args.indexOf('--api');
  const apiUrl = apiIdx !== -1 && args[apiIdx + 1] ? args[apiIdx + 1] : DEFAULT_API;
  const projectSlugIdx = args.indexOf('--project-slug');
  const projectSlug = projectSlugIdx !== -1 && args[projectSlugIdx + 1] ? args[projectSlugIdx + 1] : null;
  const projectNameIdx = args.indexOf('--project-name');
  const projectName = projectNameIdx !== -1 && args[projectNameIdx + 1] ? args[projectNameIdx + 1] : null;

  if (headless) {
    console.log('[headless] SSH/remote environment detected — browser open disabled');
  }

  if (!fs.existsSync(skillsDir) || !fs.statSync(skillsDir).isDirectory()) {
    console.error(`Error: directory not found: ${skillsDir}`);
    process.exit(1);
  }

  uploadSkills(skillsDir, { apiUrl, projectSlug, projectName, headless, consent }).then((result) => {
    if (result.ok) {
      const uploaded = result.results.filter((r) => r.ok);
      const ids = uploaded
        .map((r) => r.response && (r.response.id || r.response.skill_id))
        .filter(Boolean);

      const baseUrl = apiUrl.replace(/\/api\/skills$/, '');
      const batchReviewUrl = `${baseUrl}/review/batch/${result.batchId}`;

      const summary = {
        count: uploaded.length,
        batchId: result.batchId,
        batchReviewUrl,
      };
      if (ids.length > 0) summary.ids = ids;

      console.log(`RESULT=${JSON.stringify(summary)}`);

      if (headless) {
        console.log(`\u2713 ${uploaded.length} skill(s) uploaded${consent ? ' with consent' : ''}`);
        console.log(`  Review your skills (from any browser): ${batchReviewUrl}`);
        console.log('  Sign in with GitHub on the review page to claim credit and submit.');
      } else if (!noOpen) {
        if (openBrowser(batchReviewUrl)) {
          console.log('\u2713 Opened batch review page in browser');
        } else {
          console.log(`  (Could not open browser \u2014 visit manually: ${batchReviewUrl})`);
        }
      }

      process.exit(0);
    } else {
      if (result.failedSkills && result.failedSkills.length > 0) {
        const fallbackDir = fallbackSave(result.failedSkills);
        console.error(`\u26A0 Upload failed for ${result.failedSkills.length} skill(s)`);
        console.error(`  Saved locally to: ${fallbackDir}`);
        console.error('  You can upload manually later.');
      } else if (result.error) {
        console.error(`\u26A0 ${result.error.message}`);
      }
      process.exit(2);
    }
  });
}

module.exports = {
  uploadSkills,
  postSkill,
  parseFrontmatter,
  fallbackSave,
  openBrowser,
  isHeadless,
  DEFAULT_API,
};

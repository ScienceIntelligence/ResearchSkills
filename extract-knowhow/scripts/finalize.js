#!/usr/bin/env node
/**
 * finalize.js
 *
 * Project finalizer for /extract-knowhow. Given a project metadata file
 * describing which cached skills belong to one project, this script:
 *
 *   1. Collects validated skills  (validate-skills.js collect)
 *   2. Uploads to researchskills.ai  (upload-skills.js)
 *   3. Cleans up temp dir
 *
 * Usage:
 *   finalize.js <project-meta.json> [--no-upload] [--no-open]
 *
 * project-meta.json shape:
 *   {
 *     "project_slug":   "my-project",
 *     "session_ids":    ["id1", "id2", ...],
 *     "anchor":         { "type": "project", "project_name": "...", "project_description": "..." },
 *     "domain":         "physics",
 *     "subdomain":      "computational-physics",
 *     "contributor":    "Name (Institution)",
 *     "is_test":        false
 *   }
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { execFileSync } = require('child_process');

const UTILS_DIR = path.join(os.homedir(), '.claude', 'utils');
const VALIDATE_SKILLS = path.join(UTILS_DIR, 'validate-skills.js');
const UPLOAD_SKILLS = path.join(UTILS_DIR, 'upload-skills.js');

function runNode(script, args, opts = {}) {
  return execFileSync('node', [script, ...args], {
    encoding: 'utf-8',
    stdio: opts.inherit ? 'inherit' : ['ignore', 'pipe', 'inherit'],
  });
}

function slugify(s) {
  return String(s || 'project')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60) || 'project';
}

function finalize(metaPath, options = {}) {
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  const slug = slugify(meta.project_slug || (meta.anchor && meta.anchor.project_name));
  const tmp = os.tmpdir();
  const outputDir = path.join(tmp, `${slug}-skills`);

  const sessionIds = meta.session_ids || [];
  if (sessionIds.length === 0) {
    throw new Error('project-meta.json has empty session_ids');
  }

  // 1. Collect validated skills
  runNode(VALIDATE_SKILLS, ['collect', outputDir, sessionIds.join(',')]);
  console.log(`✓ Skills collected → ${outputDir}`);

  if (!options.upload) {
    console.log(`⚠ Skills collected but NOT uploaded (no --upload flag).`);
    console.log(`  Review the skills locally at: ${outputDir}`);
    console.log(`  To upload, re-run with --upload`);
    return { outputDir, uploaded: false };
  }

  // 2. Upload skills
  const uploadArgs = [outputDir];
  if (options.noOpen) uploadArgs.push('--no-open');
  if (meta.project_slug) {
    uploadArgs.push('--project-slug', meta.project_slug);
  }
  if (meta.anchor && meta.anchor.project_name) {
    uploadArgs.push('--project-name', meta.anchor.project_name);
  }
  try {
    const out = runNode(UPLOAD_SKILLS, uploadArgs);
    process.stdout.write(out);
    return { outputDir, uploaded: true };
  } catch (err) {
    console.error('⚠ Upload step failed (see output above)');
    return { outputDir, uploaded: false };
  } finally {
    // 3. Clean up temp dir
    try {
      fs.rmSync(outputDir, { recursive: true, force: true });
    } catch (_) {
      // best-effort cleanup
    }
  }
}

// CLI
if (require.main === module) {
  const args = process.argv.slice(2);

  // Parse CLI args — supports both JSON file and inline flags
  let metaPath = null;
  const cliOpts = {};
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--domain':         cliOpts.domain = args[++i]; break;
      case '--subdomain':      cliOpts.subdomain = args[++i]; break;
      case '--contributor':    cliOpts.contributor = args[++i]; break;
      case '--session-ids':    cliOpts.sessionIds = args[++i].split(','); break;
      case '--project-name':   cliOpts.projectName = args[++i]; break;
      case '--project-slug':   cliOpts.projectSlug = args[++i]; break;
      case '--description':    cliOpts.description = args[++i]; break;
      case '--test':           cliOpts.isTest = true; break;
      case '--upload':          cliOpts.upload = true; break;
      case '--no-upload':      cliOpts.noUpload = true; break;
      case '--no-open':        cliOpts.noOpen = true; break;
      default:
        if (!args[i].startsWith('-') && !metaPath) metaPath = args[i];
    }
  }

  // Build meta from CLI args or read from JSON file
  let resolvedMetaPath;
  if (metaPath) {
    resolvedMetaPath = path.resolve(metaPath);
    if (!fs.existsSync(resolvedMetaPath)) {
      console.error(`Error: not found: ${resolvedMetaPath}`);
      process.exit(1);
    }
  } else if (cliOpts.sessionIds && cliOpts.sessionIds.length > 0) {
    // Build meta JSON from CLI flags and write to temp file
    const name = cliOpts.projectName || 'project';
    const meta = {
      project_slug: cliOpts.projectSlug || slugify(name),
      session_ids: cliOpts.sessionIds,
      anchor: {
        type: 'project',
        project_name: name,
        project_description: cliOpts.description || '',
      },
      domain: cliOpts.domain || 'computer-science',
      subdomain: cliOpts.subdomain || 'general',
      contributor: cliOpts.contributor || 'anonymous',
      is_test: cliOpts.isTest || false,
    };
    resolvedMetaPath = path.join(os.tmpdir(), `finalize-meta-${Date.now()}.json`);
    fs.writeFileSync(resolvedMetaPath, JSON.stringify(meta, null, 2));
  } else {
    console.error('Usage: finalize.js <project-meta.json> [--no-upload] [--no-open]');
    console.error('   or: finalize.js --session-ids id1,id2 --domain ... --project-name ...');
    process.exit(1);
  }

  try {
    finalize(resolvedMetaPath, {
      upload: cliOpts.upload && !cliOpts.noUpload,
      noOpen: cliOpts.noOpen || false,
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { finalize, slugify };

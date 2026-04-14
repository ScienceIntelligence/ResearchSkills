#!/usr/bin/env node
/**
 * platform.js
 *
 * Adapter module for spawning AI CLI processes across platforms.
 * Supports Claude Code (`--cc`) and Codex (`--codex`).
 *
 * Usage:
 *   const { parsePlatformFlag, createRunner } = require('./platform');
 *   const platform = parsePlatformFlag();   // reads --cc / --codex from argv
 *   const runner = createRunner(platform);
 *   const { ok, output, error } = await runner.extract(prompt, timeoutMs);
 */

'use strict';

const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn } = require('child_process');

// ---------------------------------------------------------------------------
// Flag parsing
// ---------------------------------------------------------------------------

/**
 * Scans process.argv for --cc or --codex, removes the flag, returns the value.
 * Defaults to 'cc' if neither is present (backward compat).
 */
function parsePlatformFlag() {
  const idx = process.argv.findIndex(a => a === '--cc' || a === '--codex');
  if (idx === -1) return 'cc';
  const flag = process.argv[idx] === '--cc' ? 'cc' : 'codex';
  process.argv.splice(idx, 1);
  return flag;
}

// ---------------------------------------------------------------------------
// CC (Claude Code) runners
// ---------------------------------------------------------------------------

function spawnCC(args, prompt, verbose, timeoutMs) {
  return new Promise((resolve) => {
    const chunks = [];
    const proc = spawn('claude', args, { stdio: ['pipe', 'pipe', 'pipe'] });

    proc.stdin.write(prompt);
    proc.stdin.end();

    proc.stdout.on('data', (d) => {
      chunks.push(d);
      if (verbose) process.stderr.write(d);
    });
    proc.stderr.on('data', (d) => {
      if (verbose) process.stderr.write(d);
    });

    const timer = setTimeout(() => {
      proc.kill('SIGTERM');
      resolve({ ok: false, output: Buffer.concat(chunks).toString('utf-8'), error: 'timeout' });
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

function createCCRunner() {
  return {
    extract(prompt, timeoutMs = 600_000) {
      return spawnCC(
        ['-p', '--model', 'sonnet', '--no-session-persistence'],
        prompt, false, timeoutMs
      );
    },
    clean(prompt, verbose = false, timeoutMs = 900_000) {
      return spawnCC(
        ['-p', '--model', 'opus', '--dangerously-skip-permissions', '--allowedTools', 'Read,Edit,Write,Bash'],
        prompt, verbose, timeoutMs
      );
    },
    score(prompt, verbose = false, timeoutMs = 900_000) {
      return spawnCC(
        ['-p', '--model', 'opus', '--dangerously-skip-permissions', '--allowedTools', 'Read,Edit'],
        prompt, verbose, timeoutMs
      );
    },
    classify(prompt, timeoutMs = 300_000) {
      return spawnCC(
        ['-p', '--model', 'sonnet', '--no-session-persistence'],
        prompt, false, timeoutMs
      );
    },
  };
}

// ---------------------------------------------------------------------------
// Codex runners
// ---------------------------------------------------------------------------

function spawnCodex(args, prompt, verbose, timeoutMs) {
  return new Promise((resolve) => {
    const chunks = [];
    const outputFile = path.join(
      os.tmpdir(),
      `codex-last-message-${Date.now()}-${Math.random().toString(36).slice(2)}.txt`
    );

    const proc = spawn('codex', [...args, '-o', outputFile, '-'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    proc.stdin.write(prompt);
    proc.stdin.end();

    proc.stdout.on('data', (d) => {
      chunks.push(d);
      if (verbose) process.stderr.write(d);
    });
    proc.stderr.on('data', (d) => {
      if (verbose) process.stderr.write(d);
    });

    const timer = setTimeout(() => {
      proc.kill('SIGTERM');
      try { fs.unlinkSync(outputFile); } catch {}
      resolve({ ok: false, output: Buffer.concat(chunks).toString('utf-8'), error: 'timeout' });
    }, timeoutMs);

    proc.on('close', (code) => {
      clearTimeout(timer);
      let output = Buffer.concat(chunks).toString('utf-8');
      try {
        const lastMessage = fs.readFileSync(outputFile, 'utf-8').trim();
        if (lastMessage) output = lastMessage;
      } catch {}
      try { fs.unlinkSync(outputFile); } catch {}
      resolve({ ok: code === 0, output, error: code !== 0 ? `exit ${code}` : null });
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      try { fs.unlinkSync(outputFile); } catch {}
      resolve({ ok: false, output: '', error: err.message });
    });
  });
}

function codexBaseArgs(reasoningEffort) {
  return [
    '-a', 'never',
    'exec',
    '-s', 'danger-full-access',
    '--ephemeral',
    '--skip-git-repo-check',
    '-m', 'gpt-5.4',
    '-c', `model_reasoning_effort="${reasoningEffort}"`,
  ];
}

function createCodexRunner() {
  return {
    extract(prompt, timeoutMs = 600_000) {
      return spawnCodex(codexBaseArgs('medium'), prompt, false, timeoutMs);
    },
    clean(prompt, verbose = false, timeoutMs = 900_000) {
      return spawnCodex(codexBaseArgs('high'), prompt, verbose, timeoutMs);
    },
    score(prompt, verbose = false, timeoutMs = 900_000) {
      return spawnCodex(codexBaseArgs('high'), prompt, verbose, timeoutMs);
    },
    classify(prompt, timeoutMs = 300_000) {
      return spawnCodex(codexBaseArgs('medium'), prompt, false, timeoutMs);
    },
  };
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

function createRunner(platform) {
  if (platform === 'codex') return createCodexRunner();
  return createCCRunner();
}

module.exports = { parsePlatformFlag, createRunner };

#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const HELPER_SCRIPTS = [
  "platform.js",
  "scan-sessions.js",
  "classify-projects.js",
  "format-session.js",
  "extract-skills.js",
  "validate-skills.js",
  "clean-skills.js",
  "score-skills.js",
  "upload-skills.js",
  "finalize.js",
];

// --- Claude Code ---
const CC_COMMAND_TARGET = path.join(os.homedir(), ".claude", "commands", "extract-knowhow.md");
const CC_UTILS_DIR = path.join(os.homedir(), ".claude", "utils");

try {
  if (fs.existsSync(CC_COMMAND_TARGET)) {
    fs.unlinkSync(CC_COMMAND_TARGET);
    console.log("✓ Claude Code: /extract-knowhow removed");
  }
  for (const script of HELPER_SCRIPTS) {
    const p = path.join(CC_UTILS_DIR, script);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  console.log("✓ Claude Code: helper scripts removed");
} catch (err) {
  // ignore
}

// --- Codex ---
const CODEX_SKILL_DIR = path.join(os.homedir(), ".codex", "skills", "extract-knowhow");
const CODEX_SKILL_TARGET = path.join(CODEX_SKILL_DIR, "SKILL.md");
const CODEX_SCRIPTS_DIR = path.join(CODEX_SKILL_DIR, "scripts");

try {
  if (fs.existsSync(CODEX_SKILL_TARGET)) {
    fs.unlinkSync(CODEX_SKILL_TARGET);
    console.log("✓ Codex: /extract-knowhow SKILL.md removed");
  }
  for (const script of HELPER_SCRIPTS) {
    const p = path.join(CODEX_SCRIPTS_DIR, script);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  // Remove dirs if empty
  try {
    const remaining = fs.readdirSync(CODEX_SCRIPTS_DIR);
    if (remaining.length === 0) fs.rmdirSync(CODEX_SCRIPTS_DIR);
    const skillRemaining = fs.readdirSync(CODEX_SKILL_DIR);
    if (skillRemaining.length === 0) fs.rmdirSync(CODEX_SKILL_DIR);
  } catch (_) { /* best effort */ }
  console.log("✓ Codex: helper scripts removed");
} catch (err) {
  // ignore
}

// Note: cache directory ~/.researchskills/cache/ is intentionally preserved,
// so reinstalling retains previously extracted subtrees.

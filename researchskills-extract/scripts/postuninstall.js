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
  "store-local.js",
];

// --- Claude Code ---
const CC_SKILL_DIR = path.join(os.homedir(), ".claude", "skills", "researchskills-extract");
const CC_SKILL_TARGET = path.join(CC_SKILL_DIR, "SKILL.md");
const CC_SCRIPTS_DIR = path.join(CC_SKILL_DIR, "scripts");
const CC_CONVERT_DIR = path.join(os.homedir(), ".claude", "skills", "researchskills-convert");

try {
  if (fs.existsSync(CC_SKILL_TARGET)) {
    fs.unlinkSync(CC_SKILL_TARGET);
    console.log("✓ Claude Code: /researchskills-extract SKILL.md removed");
  }
  for (const script of HELPER_SCRIPTS) {
    const p = path.join(CC_SCRIPTS_DIR, script);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  // Remove dirs if empty
  try {
    if (fs.existsSync(CC_SCRIPTS_DIR)) {
      const remaining = fs.readdirSync(CC_SCRIPTS_DIR);
      if (remaining.length === 0) fs.rmdirSync(CC_SCRIPTS_DIR);
    }
    if (fs.existsSync(CC_SKILL_DIR)) {
      const skillRemaining = fs.readdirSync(CC_SKILL_DIR);
      if (skillRemaining.length === 0) fs.rmdirSync(CC_SKILL_DIR);
    }
  } catch (_) { /* best effort */ }
  if (fs.existsSync(CC_CONVERT_DIR)) {
    fs.rmSync(CC_CONVERT_DIR, { recursive: true, force: true });
    console.log("✓ Claude Code: /researchskills-convert removed");
  }
  console.log("✓ Claude Code: helper scripts removed");
} catch (err) {
  // ignore
}

// --- Clean up legacy Claude Code paths (in case they still exist) ---
try {
  const LEGACY_CC_COMMANDS_DIR = path.join(os.homedir(), ".claude", "commands");
  const LEGACY_CC_UTILS_DIR = path.join(os.homedir(), ".claude", "utils");
  const legacyCcExtract = path.join(LEGACY_CC_COMMANDS_DIR, "researchskills-extract.md");
  const legacyCcConvert = path.join(LEGACY_CC_COMMANDS_DIR, "researchskills-convert.md");
  if (fs.existsSync(legacyCcExtract)) fs.unlinkSync(legacyCcExtract);
  if (fs.existsSync(legacyCcConvert)) fs.unlinkSync(legacyCcConvert);
  for (const script of HELPER_SCRIPTS) {
    const p = path.join(LEGACY_CC_UTILS_DIR, script);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  try {
    if (fs.existsSync(LEGACY_CC_UTILS_DIR)) {
      const remaining = fs.readdirSync(LEGACY_CC_UTILS_DIR);
      if (remaining.length === 0) fs.rmdirSync(LEGACY_CC_UTILS_DIR);
    }
  } catch (_) { /* best effort */ }
} catch (err) {
  // ignore — legacy paths may not exist
}

// --- Codex ---
const CODEX_SKILL_DIR = path.join(os.homedir(), ".codex", "skills", "researchskills-extract");
const CODEX_SKILL_TARGET = path.join(CODEX_SKILL_DIR, "SKILL.md");
const CODEX_SCRIPTS_DIR = path.join(CODEX_SKILL_DIR, "scripts");

try {
  if (fs.existsSync(CODEX_SKILL_TARGET)) {
    fs.unlinkSync(CODEX_SKILL_TARGET);
    console.log("✓ Codex: /researchskills-extract SKILL.md removed");
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

// --- Codex: researchskills-convert ---
const CODEX_CONVERT_DIR = path.join(os.homedir(), ".codex", "skills", "researchskills-convert");
try {
  if (fs.existsSync(CODEX_CONVERT_DIR)) {
    fs.rmSync(CODEX_CONVERT_DIR, { recursive: true, force: true });
    console.log("✓ Codex: /researchskills-convert removed");
  }
} catch (err) {
  // ignore
}

// Note: cache directory ~/.researchskills/cache/ is intentionally preserved,
// so reinstalling retains previously extracted subtrees.

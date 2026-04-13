#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const SOURCE_CC_COMMAND = path.join(__dirname, "..", "commands", "extract-knowhow.md");
const SOURCE_CODEX_SKILL = path.join(__dirname, "..", "commands", "SKILL.md");

// Helper scripts that must be available at runtime
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
const CC_COMMANDS_DIR = path.join(os.homedir(), ".claude", "commands");
const CC_COMMAND_TARGET = path.join(CC_COMMANDS_DIR, "extract-knowhow.md");
const CC_UTILS_DIR = path.join(os.homedir(), ".claude", "utils");

try {
  fs.mkdirSync(CC_COMMANDS_DIR, { recursive: true });
  fs.mkdirSync(CC_UTILS_DIR, { recursive: true });
  fs.copyFileSync(SOURCE_CC_COMMAND, CC_COMMAND_TARGET);
  console.log("✓ Claude Code: /extract-knowhow installed to ~/.claude/commands/");

  for (const script of HELPER_SCRIPTS) {
    const src = path.join(__dirname, script);
    const dst = path.join(CC_UTILS_DIR, script);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
    } else {
      console.warn(`⚠ Claude Code: ${script} not found in package, skipping`);
    }
  }
  console.log(`✓ Claude Code: ${HELPER_SCRIPTS.length} scripts installed to ~/.claude/utils/`);
} catch (err) {
  console.error("⚠ Claude Code: could not install —", err.message);
}

// --- Codex ---
const CODEX_SKILL_DIR = path.join(os.homedir(), ".codex", "skills", "extract-knowhow");
const CODEX_SKILL_TARGET = path.join(CODEX_SKILL_DIR, "SKILL.md");
const CODEX_SCRIPTS_DIR = path.join(CODEX_SKILL_DIR, "scripts");

try {
  fs.mkdirSync(CODEX_SKILL_DIR, { recursive: true });
  fs.mkdirSync(CODEX_SCRIPTS_DIR, { recursive: true });
  fs.copyFileSync(SOURCE_CODEX_SKILL, CODEX_SKILL_TARGET);
  console.log("✓ Codex:   /extract-knowhow installed to ~/.codex/skills/extract-knowhow/");

  for (const script of HELPER_SCRIPTS) {
    const src = path.join(__dirname, script);
    const dst = path.join(CODEX_SCRIPTS_DIR, script);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
    } else {
      console.warn(`⚠ Codex: ${script} not found in package, skipping`);
    }
  }
  console.log(`✓ Codex:   ${HELPER_SCRIPTS.length} scripts installed to ~/.codex/skills/extract-knowhow/scripts/`);
} catch (err) {
  console.error("⚠ Codex: could not install —", err.message);
}

// --- Cache directory ---
// Any version change wipes all caches (skills + meta + sessions).
// Reason: both extraction prompts AND raw-conversation preprocessing can change
// between versions, so nothing is safe to reuse.
const CACHE_DIR = path.join(os.homedir(), ".openscientist", "cache");
const VERSION_FILE = path.join(CACHE_DIR, ".version");
const CURRENT_VERSION = require(path.join(__dirname, "..", "package.json")).version;

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  for (const entry of fs.readdirSync(p)) {
    const full = path.join(p, entry);
    if (fs.statSync(full).isDirectory()) rmrf(full);
    else fs.unlinkSync(full);
  }
  fs.rmdirSync(p);
}

try {
  fs.mkdirSync(CACHE_DIR, { recursive: true });

  const previousVersion = fs.existsSync(VERSION_FILE)
    ? fs.readFileSync(VERSION_FILE, "utf-8").trim()
    : null;

  if (previousVersion && previousVersion !== CURRENT_VERSION) {
    // Version changed — wipe all processed caches (keep nothing)
    rmrf(path.join(CACHE_DIR, "skills"));
    rmrf(path.join(CACHE_DIR, "meta"));
    rmrf(path.join(CACHE_DIR, "sessions"));
    console.log(`✓ Cache:       version ${previousVersion} → ${CURRENT_VERSION}, previous cache cleared`);
  } else if (!previousVersion) {
    console.log(`✓ Cache:       initialized at version ${CURRENT_VERSION}`);
  } else {
    console.log(`✓ Cache:       version ${CURRENT_VERSION} (reusing existing cache)`);
  }

  fs.mkdirSync(path.join(CACHE_DIR, "meta"), { recursive: true });
  fs.mkdirSync(path.join(CACHE_DIR, "skills"), { recursive: true });
  fs.mkdirSync(path.join(CACHE_DIR, "sessions"), { recursive: true });
  fs.writeFileSync(VERSION_FILE, CURRENT_VERSION);
} catch (err) {
  console.error("⚠ Cache: could not prepare —", err.message);
}

console.log("\n  Usage: /extract-knowhow (Claude Code) or $extract-knowhow (Codex)");

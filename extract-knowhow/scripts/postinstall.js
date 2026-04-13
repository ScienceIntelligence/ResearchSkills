#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const SOURCE_COMMAND = path.join(__dirname, "..", "commands", "extract-knowhow.md");

// Helper scripts that must be available at runtime
const HELPER_SCRIPTS = [
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
  fs.copyFileSync(SOURCE_COMMAND, CC_COMMAND_TARGET);
  console.log("✓ Claude Code: /extract-knowhow installed to ~/.claude/commands/");

  for (const script of HELPER_SCRIPTS) {
    const src = path.join(__dirname, script);
    const dst = path.join(CC_UTILS_DIR, script);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
      console.log(`✓ Claude Code: ${script} installed to ~/.claude/utils/`);
    } else {
      console.warn(`⚠ Claude Code: ${script} not found in package, skipping`);
    }
  }
} catch (err) {
  console.error("⚠ Claude Code: could not install —", err.message);
}

// --- Cache directory ---
const CACHE_DIR = path.join(os.homedir(), ".openscientist", "cache");
try {
  fs.mkdirSync(path.join(CACHE_DIR, "meta"), { recursive: true });
  fs.mkdirSync(path.join(CACHE_DIR, "skills"), { recursive: true });
  fs.mkdirSync(path.join(CACHE_DIR, "sessions"), { recursive: true });
  console.log("✓ Cache:       ~/.openscientist/cache/ ready");
} catch (err) {
  console.error("⚠ Cache: could not prepare —", err.message);
}

console.log("\n  Usage: /extract-knowhow");

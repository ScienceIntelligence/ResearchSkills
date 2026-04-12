#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const HELPER_SCRIPTS = [
  "scan-sessions.js",
  "format-session.js",
  "extract-skills.js",
  "validate-skills.js",
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
    if (fs.existsSync(p)) {
      fs.unlinkSync(p);
      console.log(`✓ Claude Code: ${script} removed`);
    }
  }
} catch (err) {
  // ignore
}

// Note: cache directory ~/.openscientist/cache/ is intentionally preserved,
// so reinstalling retains previously extracted subtrees.

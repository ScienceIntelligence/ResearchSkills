#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const SOURCE_COMMAND = path.join(__dirname, "..", "commands", "extract-knowhow.md");
const TEMPLATE_SOURCE = path.join(__dirname, "..", "templates", "skill-template.md");

// Helper scripts that must be available at runtime
const HELPER_SCRIPTS = [
  "scan-sessions.js",
  "format-session.js",
  "extract-skills.js",
  "validate-skills.js",
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

// --- Codex CLI ---
const CODEX_DIR = path.join(os.homedir(), ".codex", "skills", "extract-knowhow");
const CODEX_COMMAND_TARGET = path.join(CODEX_DIR, "SKILL.md");
const CODEX_REF_DIR = path.join(CODEX_DIR, "references");
const CODEX_REF_TARGET = path.join(CODEX_REF_DIR, "skill-template.md");
const CODEX_UTILS_DIR = path.join(CODEX_DIR, "scripts");

try {
  fs.mkdirSync(CODEX_DIR, { recursive: true });
  fs.mkdirSync(CODEX_REF_DIR, { recursive: true });
  fs.mkdirSync(CODEX_UTILS_DIR, { recursive: true });

  // Codex SKILL.md needs YAML frontmatter for discovery
  const CODEX_FRONTMATTER = [
    "---",
    'name: "extract-knowhow"',
    'description: "Analyze your conversation history and extract reusable scientific research know-how into OpenScientist skill files. Use when you want to turn your research conversations into structured, shareable skills."',
    "---",
    "",
  ].join("\n");
  const sourceContent = fs.readFileSync(SOURCE_COMMAND, "utf-8");
  fs.writeFileSync(CODEX_COMMAND_TARGET, CODEX_FRONTMATTER + sourceContent);

  if (fs.existsSync(TEMPLATE_SOURCE)) {
    fs.copyFileSync(TEMPLATE_SOURCE, CODEX_REF_TARGET);
  }

  for (const script of HELPER_SCRIPTS) {
    const src = path.join(__dirname, script);
    const dst = path.join(CODEX_UTILS_DIR, script);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
    }
  }

  console.log("✓ Codex CLI:   $extract-knowhow installed to ~/.codex/skills/");
} catch (err) {
  console.error("⚠ Codex CLI: could not install —", err.message);
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

console.log("\n  Usage: /extract-knowhow (Claude Code) or $extract-knowhow (Codex CLI)");

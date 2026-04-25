#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");

const SOURCE_CC_COMMAND = path.join(__dirname, "..", "commands", "researchskills-extract.md");
const SOURCE_CC_CONVERT = path.join(__dirname, "..", "commands", "researchskills-convert.md");
const SOURCE_CODEX_SKILL = path.join(__dirname, "..", "commands", "SKILL.md");
const SOURCE_CODEX_CONVERT = path.join(__dirname, "..", "commands", "CONVERT-SKILL.md");

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
  "store-local.js",
];

// --- Claude Code ---
const CC_SKILL_DIR = path.join(os.homedir(), ".claude", "skills", "researchskills-extract");
const CC_SKILL_TARGET = path.join(CC_SKILL_DIR, "SKILL.md");
const CC_SCRIPTS_DIR = path.join(CC_SKILL_DIR, "scripts");

try {
  fs.mkdirSync(CC_SKILL_DIR, { recursive: true });
  fs.mkdirSync(CC_SCRIPTS_DIR, { recursive: true });
  fs.copyFileSync(SOURCE_CC_COMMAND, CC_SKILL_TARGET);
  const CC_CONVERT_DIR = path.join(os.homedir(), ".claude", "skills", "researchskills-convert");
  fs.mkdirSync(CC_CONVERT_DIR, { recursive: true });
  fs.copyFileSync(SOURCE_CC_CONVERT, path.join(CC_CONVERT_DIR, "SKILL.md"));
  console.log("✓ Claude Code: /researchskills-extract installed to ~/.claude/skills/researchskills-extract/");
  console.log("✓ Claude Code: /researchskills-convert installed to ~/.claude/skills/researchskills-convert/");

  for (const script of HELPER_SCRIPTS) {
    const src = path.join(__dirname, script);
    const dst = path.join(CC_SCRIPTS_DIR, script);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
    } else {
      console.warn(`⚠ Claude Code: ${script} not found in package, skipping`);
    }
  }
  console.log(`✓ Claude Code: ${HELPER_SCRIPTS.length} scripts installed to ~/.claude/skills/researchskills-extract/scripts/`);
} catch (err) {
  console.error("⚠ Claude Code: could not install —", err.message);
}

// --- Clean up legacy Claude Code paths ---
const LEGACY_CC_COMMANDS_DIR = path.join(os.homedir(), ".claude", "commands");
const LEGACY_CC_UTILS_DIR = path.join(os.homedir(), ".claude", "utils");
try {
  const legacyCcExtract = path.join(LEGACY_CC_COMMANDS_DIR, "researchskills-extract.md");
  if (fs.existsSync(legacyCcExtract)) {
    fs.unlinkSync(legacyCcExtract);
    console.log("✓ Removed legacy ~/.claude/commands/researchskills-extract.md");
  }
  const legacyCcConvert = path.join(LEGACY_CC_COMMANDS_DIR, "researchskills-convert.md");
  if (fs.existsSync(legacyCcConvert)) {
    fs.unlinkSync(legacyCcConvert);
    console.log("✓ Removed legacy ~/.claude/commands/researchskills-convert.md");
  }
  for (const script of HELPER_SCRIPTS) {
    const p = path.join(LEGACY_CC_UTILS_DIR, script);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }
  // Remove utils dir if empty
  try {
    if (fs.existsSync(LEGACY_CC_UTILS_DIR)) {
      const remaining = fs.readdirSync(LEGACY_CC_UTILS_DIR);
      if (remaining.length === 0) fs.rmdirSync(LEGACY_CC_UTILS_DIR);
    }
  } catch (_) { /* best effort */ }
  console.log("✓ Cleaned up legacy ~/.claude/commands/ and ~/.claude/utils/ paths");
} catch (err) {
  console.warn("⚠ Could not clean up legacy Claude Code paths —", err.message);
}

// --- Codex ---
const CODEX_SKILL_DIR = path.join(os.homedir(), ".codex", "skills", "researchskills-extract");
const CODEX_SKILL_TARGET = path.join(CODEX_SKILL_DIR, "SKILL.md");
const CODEX_SCRIPTS_DIR = path.join(CODEX_SKILL_DIR, "scripts");

try {
  fs.mkdirSync(CODEX_SKILL_DIR, { recursive: true });
  fs.mkdirSync(CODEX_SCRIPTS_DIR, { recursive: true });
  fs.copyFileSync(SOURCE_CODEX_SKILL, CODEX_SKILL_TARGET);
  console.log("✓ Codex:   /researchskills-extract installed to ~/.codex/skills/researchskills-extract/");

  // --- Codex: researchskills-convert ---
  const CODEX_CONVERT_DIR = path.join(os.homedir(), ".codex", "skills", "researchskills-convert");
  fs.mkdirSync(CODEX_CONVERT_DIR, { recursive: true });
  fs.copyFileSync(SOURCE_CODEX_CONVERT, path.join(CODEX_CONVERT_DIR, "SKILL.md"));
  console.log("✓ Codex:   /researchskills-convert installed to ~/.codex/skills/researchskills-convert/");

  for (const script of HELPER_SCRIPTS) {
    const src = path.join(__dirname, script);
    const dst = path.join(CODEX_SCRIPTS_DIR, script);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
    } else {
      console.warn(`⚠ Codex: ${script} not found in package, skipping`);
    }
  }
  console.log(`✓ Codex:   ${HELPER_SCRIPTS.length} scripts installed to ~/.codex/skills/researchskills-extract/scripts/`);
} catch (err) {
  console.error("⚠ Codex: could not install —", err.message);
}

// --- Clean up legacy extract-knowhow command files ---
const LEGACY_CC_COMMAND = path.join(os.homedir(), ".claude", "commands", "extract-knowhow.md");
const LEGACY_CODEX_DIR = path.join(os.homedir(), ".codex", "skills", "extract-knowhow");
try {
  if (fs.existsSync(LEGACY_CC_COMMAND)) {
    fs.unlinkSync(LEGACY_CC_COMMAND);
    console.log("✓ Removed legacy ~/.claude/commands/extract-knowhow.md");
  }
  if (fs.existsSync(LEGACY_CODEX_DIR)) {
    fs.rmSync(LEGACY_CODEX_DIR, { recursive: true, force: true });
    console.log("✓ Removed legacy ~/.codex/skills/extract-knowhow/");
  }
} catch (err) {
  console.warn("⚠ Could not clean up legacy files —", err.message);
}

// --- Migrate legacy cache from @openscientist/extract-knowhow ---
const OLD_CACHE_ROOT = path.join(os.homedir(), ".openscientist");
const NEW_CACHE_ROOT = path.join(os.homedir(), ".researchskills");

if (fs.existsSync(OLD_CACHE_ROOT)) {
  if (!fs.existsSync(NEW_CACHE_ROOT)) {
    // Simple case: just rename
    try {
      fs.renameSync(OLD_CACHE_ROOT, NEW_CACHE_ROOT);
      console.log("✓ Migrated ~/.openscientist/ → ~/.researchskills/");
    } catch (err) {
      console.warn("⚠ Could not migrate ~/.openscientist/ —", err.message);
      console.warn("  You can manually run: mv ~/.openscientist ~/.researchskills");
    }
  } else {
    // Both exist: recursively merge missing files from old into new
    function mergeDirs(src, dst) {
      if (!fs.existsSync(src)) return;
      fs.mkdirSync(dst, { recursive: true });
      for (const entry of fs.readdirSync(src)) {
        const s = path.join(src, entry);
        const d = path.join(dst, entry);
        if (fs.statSync(s).isDirectory()) {
          mergeDirs(s, d); // recurse into subdirs even if they exist
        } else if (!fs.existsSync(d)) {
          fs.copyFileSync(s, d);
        }
      }
    }
    try {
      for (const sub of ["cache/meta", "cache/skills", "cache/sessions", "skills-fallback"]) {
        mergeDirs(path.join(OLD_CACHE_ROOT, sub), path.join(NEW_CACHE_ROOT, sub));
      }
      console.log("✓ Merged legacy ~/.openscientist/ into ~/.researchskills/");
    } catch (err) {
      console.warn("⚠ Could not merge ~/.openscientist/ —", err.message);
    }
  }
}

// --- Handle old package coexistence ---
// The old @openscientist/extract-knowhow postuninstall deletes the same
// command files we just installed. Proactively reinstall our files after
// detecting the old package, so users can safely uninstall it later.
try {
  const { execSync } = require("child_process");
  const out = execSync("npm ls -g @openscientist/extract-knowhow --depth=0 2>/dev/null", { encoding: "utf-8" });
  if (out.includes("@openscientist/extract-knowhow")) {
    console.log("\n⚠ Old @openscientist/extract-knowhow is still installed.");
    console.log("  After uninstalling it, run this to restore command files:");
    console.log("  npm install -g @scienceintelligence/researchskills-extract\n");
  }
} catch (_) { /* not installed or npm ls failed — fine */ }

// --- Cache directory ---
// Any version change wipes all caches (skills + meta + sessions).
// Reason: both extraction prompts AND raw-conversation preprocessing can change
// between versions, so nothing is safe to reuse.
const CACHE_DIR = path.join(os.homedir(), ".researchskills", "cache");
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

console.log("\n  Usage:");
console.log("    /researchskills-extract  (Claude Code) or $researchskills-extract  (Codex) — extract from history");
console.log("    /researchskills-convert  (Claude Code) or $researchskills-convert  (Codex) — convert existing skills");

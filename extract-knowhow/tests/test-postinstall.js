#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const os = require("os");
const { execFileSync } = require("child_process");

const COMMANDS_DIR = path.join(os.homedir(), ".claude", "commands");
const TARGET = path.join(COMMANDS_DIR, "extract-knowhow.md");
const SCRIPT_DIR = path.join(__dirname, "..", "scripts");

let passed = 0;
let failed = 0;

function assert(condition, msg) {
  if (condition) {
    console.log("  ✓ " + msg);
    passed++;
  } else {
    console.error("  ✗ " + msg);
    failed++;
  }
}

// Clean up any existing file first
if (fs.existsSync(TARGET)) {
  fs.unlinkSync(TARGET);
}

console.log("Test: postinstall.js");
execFileSync(process.execPath, [path.join(SCRIPT_DIR, "postinstall.js")], { stdio: "pipe" });
assert(fs.existsSync(TARGET), "Command file exists after install");

const content = fs.readFileSync(TARGET, "utf-8");
assert(content.includes("extract-knowhow"), "Command file contains expected content");
assert(content.startsWith("#"), "Command file starts with markdown header");

console.log("\nTest: consent gate");
const REPORT_TEMPLATE = path.join(__dirname, "..", "templates", "report.html");
const reportTemplate = fs.readFileSync(REPORT_TEMPLATE, "utf-8");
assert(reportTemplate.includes('id="consent-cb"'), "Report template has consent checkbox");
assert(reportTemplate.includes('disabled'), "Submit buttons are disabled by default");
assert(reportTemplate.includes('consentGiven'), "Report template checks consent before submission");

console.log("\nTest: finalize.js requires --upload flag");
const FINALIZE_SCRIPT = path.join(__dirname, "..", "scripts", "finalize.js");
const finalizeContent = fs.readFileSync(FINALIZE_SCRIPT, "utf-8");
assert(finalizeContent.includes("if (!options.upload)"), "finalize.js defaults to no-upload without --upload flag");
assert(finalizeContent.includes("'--upload'"), "finalize.js supports --upload CLI flag");

console.log("\nTest: postuninstall.js");
execFileSync(process.execPath, [path.join(SCRIPT_DIR, "postuninstall.js")], { stdio: "pipe" });
assert(!fs.existsSync(TARGET), "Command file removed after uninstall");

console.log("\n" + passed + " passed, " + failed + " failed");
process.exit(failed > 0 ? 1 : 0);

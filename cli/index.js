#!/usr/bin/env node
const https = require('https');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// OpenScientist CLI
const API_URL = 'https://api.github.com/repos/HHHHHejia/OpenScientist/git/trees/main?recursive=1';
const RAW_URL = 'https://raw.githubusercontent.com/HHHHHejia/OpenScientist/main/';

const args = process.argv.slice(2);

if (args.length === 0 || args[0] === 'help' || args[0] === '--help') {
  console.log(`
🌍 OpenScientist CLI 

Usage:
  npx @openscientist/cli search <keyword>   - Search for skills by name
  npx @openscientist/cli install <path>     - Install a skill to ~/.claude/skills/
  npx @openscientist/cli help               - Show this help menu

Examples:
  npx @openscientist/cli search quantum
  npx @openscientist/cli install skills/physics/quantum-physics/quantum-entanglement.md
`);
  process.exit(0);
}

// GitHub API requires a User-Agent header
const reqOpts = {
  headers: { 'User-Agent': 'OpenScientist-CLI/1.0' }
};

function fetchTree(callback) {
  https.get(API_URL, reqOpts, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        if (!json.tree) {
          console.error("❌ Failed to fetch skills tree. GitHub API limit might be reached.");
          process.exit(1);
        }
        // Filter out everything that isn't a proper markdown skill
        const skills = json.tree.filter(f => 
          f.path.startsWith('skills/') && 
          f.path.endsWith('.md') && 
          !f.path.includes('_template') && 
          !f.path.endsWith('README.md')
        );
        callback(skills);
      } catch (e) {
        console.error("❌ Invalid response from GitHub:", e.message);
      }
    });
  }).on('error', err => {
    console.error("❌ Error connecting to GitHub:", err.message);
  });
}

function searchSkills(term) {
  console.log(`\n🔍 Searching OpenScientist for "${term || '*'}"...\n`);
  fetchTree((skills) => {
    let matches = skills;
    if (term) {
      matches = skills.filter(s => s.path.toLowerCase().includes(term.toLowerCase()));
    }
    
    if (matches.length === 0) {
      console.log(`❌ No skills found matching "${term}".\n`);
      console.log("💡 Why not request it? -> https://github.com/HHHHHejia/OpenScientist/discussions\n");
      return;
    }
    
    console.log(`✅ Found ${matches.length} skill(s):\n`);
    matches.forEach(s => {
      console.log(`  - ${s.path.replace('skills/', '')}`);
      console.log(`    Install: npx @openscientist/cli install ${s.path}\n`);
    });
  });
}

function installSkill(skillPath) {
  if (!skillPath.startsWith('skills/')) {
    console.error("❌ Invalid path. It should look like: skills/physics/quant/quant.md");
    return;
  }
  
  const home = process.env.HOME || process.env.USERPROFILE;
  const claudeSkillsDir = path.join(home, '.claude', 'skills');
  
  if (!fs.existsSync(claudeSkillsDir)) {
    console.log(`Creating directory: ${claudeSkillsDir}`);
    fs.mkdirSync(claudeSkillsDir, { recursive: true });
  }

  const fileName = path.basename(skillPath);
  const targetPath = path.join(claudeSkillsDir, fileName);

  console.log(`⏳ Downloading ${fileName}...`);
  
  const downloadOpts = { ...reqOpts };
  
  https.get(RAW_URL + skillPath, downloadOpts, (res) => {
    if (res.statusCode !== 200) {
      console.error(`❌ Failed to download! HTTP Status: ${res.statusCode}`);
      return;
    }
    const fileStream = fs.createWriteStream(targetPath);
    res.pipe(fileStream);
    fileStream.on('finish', () => {
      console.log(`\n🎉 Successfully installed to: ~/.claude/skills/${fileName}`);
      console.log(`✅ To use it, type /${fileName.replace('.md', '')} in Claude Code!`);
    });
  });
}

const command = args[0];
if (command === 'search') {
  searchSkills(args.slice(1).join(' '));
} else if (command === 'install') {
  if (!args[1]) {
    console.error("❌ Please provide the full path of the skill to install.");
    process.exit(1);
  }
  installSkill(args[1]);
} else {
  console.log(`❌ Unknown command: ${command}`);
  console.log(`Type 'npx @openscientist/cli help' for usage.`);
}

# /extract-knowhow

Extract research skills from the user's Claude Code + Codex CLI session history for **OpenScientist**.

**Run fully automatically with ZERO user interaction.** Do not pause or ask questions. Report progress at each milestone.

You extract three types of cognitive memory from research conversations:
- **Procedural** — IF-THEN rules for research impasses (hardest to extract, most valuable)
- **Semantic** — Facts the LLM doesn't know (frontier, non-public, correction)
- **Episodic** — Concrete research episodes (failure, adaptation, anomalous cases)

Everything else — discovery, formatting, validation, upload — is done by helper scripts. Do not reimplement their work.

---

## Pipeline

```
scan-sessions.js    ─┐
extract-skills.js   ─┤  deterministic scripts (you call them)
  └─ claude -p       │  ← Haiku CLI call per session, inside the script
finalize.js         ─┘

You (main agent)    ← call scripts, read summaries, report
```

Helper scripts (installed at `~/.claude/utils/`):

| Script | What it does |
|--------|-------------|
| `scan-sessions.js` | Discover sessions, extract metadata, filter, group by project |
| `extract-skills.js` | **The core loop**: format each session → call `claude -p --model haiku` → validate + cache skills |
| `validate-skills.js` | Validate skill markdown and cache to `~/.openscientist/cache/skills/` |
| `finalize.js` | Collect cached skills → upload to researchskills.ai |

---

## The Three Hard Rules

1. **Use the Read tool** on formatted text produced by `format-session.js`. Never pattern-match or grep raw `.jsonl` files.
2. **Timestamps** come from the `[ISO-timestamp]` prefix on each line of formatted text. Never fabricate timestamps.
3. **Skills must be specific** to what actually happened in the conversation. Never write generic textbook-style advice.

---

## Arguments

- `--test` (alias: `test`): Test mode. Accept engineering sessions too (not just research). Tag all output as test data.
- No argument: Production mode. Only research sessions proceed.

Detect mode at start. Announce: `"Running in TEST MODE"` or `"Running in production mode"`.

Create cache directory:
```bash
mkdir -p ~/.openscientist/cache/meta ~/.openscientist/cache/skills
```

---

## Stage 1 — Scan

```bash
node ~/.claude/utils/scan-sessions.js
```

Reads `~/.openscientist/cache/work-list.json` output. Report: `"Found N sessions across M projects."`

---

## Stage 2 — Classify & Pick Domain (AI)

For each project in the work-list:
1. Read the first_prompt of representative sessions
2. Classify as research / engineering / other
3. Map to OpenScientist taxonomy domain + subdomain
4. In test mode: engineering sessions accepted, mapped to `computer-science/test-data`

Report: `"Classified N projects. Proceeding with M."`

---

## Stage 3 — Extract Skills Per Session (script + Haiku CLI)

**Architecture:** A single script handles the entire extraction loop. For each session it formats the text, calls `claude -p --model haiku` to extract skills, then validates and caches the results. Each Haiku call is independent — no context accumulation. Your context stays clean.

**Do NOT loop through sessions yourself.** Call the script once and let it handle everything.

```bash
node ~/.claude/utils/extract-skills.js ~/.openscientist/cache/work-list.json \
  --domain <domain> \
  --subdomain <subdomain> \
  --contributor "$(git config user.name)" \
  --batch-size 50
```

For test mode, add `--test`. To process specific sessions only, use `--session-ids <csv>`.

The script:
1. Reads work-list.json, skips cached sessions
2. For each uncached session (up to batch-size):
   - Formats via `format-session.js`
   - Calls `claude -p --model haiku` with the extraction prompt
   - Haiku reads the formatted text, writes skill `.md` files, validates them
   - Parses the `SKILLS_EXTRACTED:` line from Haiku's output
3. Prints a summary with counts per memory type
4. Writes `/tmp/extract-skills-summary.json` for you to read

If you need to process multiple projects with different domains, call the script once per project with `--session-ids` filtering to that project's sessions.

After the script finishes, read `/tmp/extract-skills-summary.json` for the totals.

---

## Stage 4 — Finalize Per Project

For each project, write a project-meta.json and call finalize.js:

```bash
cat > /tmp/<slug>-meta.json <<'EOF'
{
  "project_slug": "<slug>",
  "session_ids": ["<id1>", "<id2>"],
  "anchor": { "type": "project", "project_name": "<name>", "project_description": "<desc>" },
  "domain": "<domain>",
  "subdomain": "<subdomain>",
  "contributor": "<git user.name>",
  "is_test": false
}
EOF

node ~/.claude/utils/finalize.js /tmp/<slug>-meta.json
```

---

## Stage 5 — Terminal Summary

```
═══════════════════════════════════════════════════════
  /extract-knowhow Complete!
═══════════════════════════════════════════════════════

Extracted N skills from M sessions across P projects:
  • Episodic:   E skills (F failure, A adaptation, X anomalous)
  • Semantic:   S skills (Fr frontier, Np non-public, C correction)
  • Procedural: Pr skills (T tie, Nc no-change, Cf constraint-failure, Of operator-fail)

Review your skills:
  → https://researchskills.ai/review/skill/abc123
═══════════════════════════════════════════════════════
```

---

## De-identification

All skills must be de-identified. Strip:
- File paths, directory names, usernames
- Project-specific names, dataset names, internal identifiers
- Email addresses, URLs to private resources
- Names of collaborators or lab members

Preserve: Scientific content — materials, compounds, parameters, methods, tool/library names.

---

## What to Extract vs What to Skip

**DO extract:**
- Research impasse moments and their resolutions
- Knowledge the human provided that LLMs wouldn't know
- Notable episodes (failures, adaptations, anomalies)
- The reasoning behind decisions (where tacit knowledge surfaces)
- Anti-exemplars and exclusions (as important as the skill itself)

**DO NOT extract:**
- Generic programming tasks (git, npm, environment setup)
- Textbook-level knowledge (LLMs already know this)
- Small talk, casual conversation
- The same impasse repeated across sessions (deduplicate)

# /extract-knowhow

Extract research skills from the user's Claude Code session history for **OpenScientist**.

**Run automatically with TWO pauses for user consent:** once after classifying projects (Stage 2.5 — choose which projects to scan), and once before upload (Stage 7 — choose whether to submit). Report progress at each milestone.

You extract three types of cognitive memory from research conversations:
- **Procedural** — IF-THEN rules for **scientific research** decisions: methodology choices, data interpretation strategies, research direction pivots. NOT engineering workflows.
- **Semantic** — **Frontier scientific knowledge** the LLM doesn't have: domain-specific constraints, unpublished findings, corrections to scientific misconceptions. NOT tool/API behaviors.
- **Episodic** — **Research cognitive turning points**: hypothesis overturned, methodology abandoned for scientific reasons, unexpected findings that changed direction. NOT debugging episodes.

Everything else — discovery, formatting, validation, upload — is done by helper scripts. Do not reimplement their work.

---

## Pipeline

```
scan-sessions.js       ─┐
classify-projects.js   ─┤
extract-skills.js      ─┤  deterministic scripts (you call them)
  └─ claude -p sonnet   │  ← Sonnet CLI call per session, inside the script
clean-skills.js        ─┤  ← Opus reviews: reject/fix/merge
score-skills.js        ─┤  ← Opus scores: 3-dim value assessment
finalize.js            ─┘

You (main agent)       ← call scripts, read summaries, report
```

Helper scripts (installed at `~/.claude/utils/`):

| Script | What it does |
|--------|-------------|
| `scan-sessions.js` | Discover sessions, extract metadata, filter, group by project |
| `classify-projects.js` | Classify projects as research/engineering via Sonnet, pick domain/subdomain |
| `extract-skills.js` | **The core loop**: format each session → call `claude -p --model sonnet` → validate + cache skills |
| `validate-skills.js` | Validate skill markdown and cache to `~/.openscientist/cache/skills/` |
| `clean-skills.js` | Review extracted skills with Opus: reject engineering, fix PII, merge duplicates |
| `score-skills.js` | Score surviving skills with Opus on 3 dimensions: procedural, semantic, episodic value |
| `finalize.js` | Collect cached skills → upload to researchskills.ai |

---

## Arguments

- `--test` (alias: `test`): Test mode. Accept engineering sessions too (not just research). Tag all output as test data.
- No argument: Production mode. Only research sessions proceed.

Detect mode at start. Announce: `"Running in TEST MODE"` or `"Running in production mode"`.

---

## Stage 1 — Scan

```bash
mkdir -p ~/.openscientist/cache/meta ~/.openscientist/cache/skills
node ~/.claude/utils/scan-sessions.js
```

Reads `~/.openscientist/cache/work-list.json` output. Report: `"Found N sessions across M projects."`

---

## Stage 2 — Classify Projects

**YOU MUST call this script. Do NOT classify projects yourself.**

```bash
node ~/.claude/utils/classify-projects.js ~/.openscientist/cache/work-list.json --cc --verbose
```

For test mode, add `--test`.

The script calls Sonnet to classify each project as research/engineering and picks domain/subdomain from the taxonomy. It also filters out non-research sessions (e.g., extract-knowhow runs, build/deploy tasks) via `skip_patterns`.

Output: `~/.openscientist/cache/classification.json`.

Read the output file. For each project with `type: "research"`, use its `research_session_ids` (NOT `session_ids`), `domain`, `subdomain`, and `project_name` in later stages. Do NOT include skipped sessions.

The script generates an AI-summarized `project_name` for each project (e.g. "Protein Folding Simulation Pipeline") instead of using the raw folder name. Use this `project_name` in Stage 6 finalize. If `project_name` is null, fall back to the `slug`.

Report: `"Classified N projects. Proceeding with M."`

---

## Stage 2.5 — Project Consent Gate

**PAUSE and ask the user.** After classification, show all discovered projects and let the user choose which to scan.

Read `~/.openscientist/cache/classification.json` and display:

```
Select which projects to scan for research skills:

  [x] 1. Protein Folding Pipeline     (4 sessions, research, quantitative-biology)
  [x] 2. Quantum Monte Carlo Study    (3 sessions, research, physics)
  [ ] 3. Personal Website             (3 sessions, engineering)
  [ ] 4. Dotfiles                     (2 sessions, other)

Enter numbers to toggle, or press Enter to continue:
```

Research projects are pre-selected; engineering/other are deselected.

**YOU MUST STOP HERE AND WAIT FOR THE USER TO RESPOND.** Use AskUserQuestion to present the project list and block until the user replies. Do NOT continue to Stage 3 without an explicit user response.

Only pass user-approved projects to Stage 3+. Remove deselected project session IDs from all subsequent `--session-ids` arguments.

Report: `"Proceeding with N projects (M sessions) after user confirmation."`

---

## Stage 3 — Extract Skills Per Session

### MANDATORY: Use --single-batch and loop. NEVER run all at once.

The extraction script MUST be called in a loop with `--single-batch`. Each call processes ONE batch (~5 parallel Sonnet calls) then exits. You call it again in a new Bash tool call. This keeps the user informed of progress and prevents the UI from freezing.

**FORBIDDEN patterns (will cause long freezes):**
- `run_in_background: true` — user sees nothing for 10+ minutes
- Omitting `--single-batch` — script runs all batches internally, no progress visible
- Using Monitor tool to watch output — still freezes, just with delayed notifications

**REQUIRED pattern:**

```bash
# REPEAT this exact Bash call in a loop. Each call = 1 batch.
node ~/.claude/utils/extract-skills.js ~/.openscientist/cache/work-list.json \
  --cc \
  --domain <domain> \
  --subdomain <subdomain> \
  --contributor "$(git config user.name)" \
  --session-ids <ALL-research-session-ids-csv> \
  --single-batch \
  --verbose
```

**Loop logic:**
1. Run the command above (foreground Bash, NOT background)
2. Read the output. Report to user: "Batch N/M done: X skills extracted, Y calls remaining"
3. If output says `0 Sonnet calls remaining` or `All sessions already cached` → **stop, go to Stage 4**
4. Otherwise → run the **same command again** (it auto-skips cached segments)

Pass ALL research session IDs from Stage 2. Do NOT drop sessions or pick a subset.

If you need to process multiple projects with different domains, call the script once per project with `--session-ids` filtering to that project's sessions.

---

## Stage 4 — Clean Skills

Run Opus to review all extracted skills: reject engineering content, fix PII leaks, merge duplicates.

```bash
node ~/.claude/utils/clean-skills.js \
  --cc \
  --session-ids <ALL-research-session-ids-csv> \
  --verbose
```

This spawns a Claude Code instance with Opus that directly reads, deletes, and edits skill files on disk.

Report: `"Clean: kept N, rejected M, merged K."`

---

## Stage 5 — Score Skills

Run Opus to assess the value of each surviving skill on 3 dimensions.

```bash
node ~/.claude/utils/score-skills.js \
  --cc \
  --session-ids <ALL-research-session-ids-csv> \
  --verbose
```

This spawns a Claude Code instance with Opus that reads each skill and writes `review_scores` (procedural, semantic, episodic — each 0-5) into the YAML frontmatter.

Report: `"Scored N skills. Avg: procedural X.X, semantic X.X, episodic X.X."`

---

## Stage 6 — Finalize Per Project (collect only, no upload yet)

Use the AI-generated `project_name` from classification.json (Stage 2). Do NOT use the raw folder name.

**Do NOT pass `--upload` here.** Collect skills locally first. Upload requires explicit user consent in Stage 7.

```bash
node ~/.claude/utils/finalize.js \
  --session-ids <ALL-research-session-ids-csv> \
  --domain <domain> \
  --subdomain <subdomain> \
  --contributor "$(git config user.name)" \
  --project-name "<project_name from classification>" \
  --project-slug "<slug>"
```

---

## Stage 7 — Consent and Upload

**Second consent gate.** Pause and ask the user before uploading anything.

Show the user what was extracted:

```
═══════════════════════════════════════════════════════
  /extract-knowhow — Extraction Complete!
═══════════════════════════════════════════════════════

Extracted N skills from M sessions across P projects:
  • Episodic:   E skills
  • Semantic:   S skills
  • Procedural: Pr skills

Review (Opus):
  • Kept: K / Rejected: R / Merged: G
  • Avg scores: procedural X.X, semantic X.X, episodic X.X

⚠ Nothing has been uploaded yet. Your skills are saved
  locally. Would you like to submit them to OpenScientist
  for reviewer review?

  Skills will be stored on researchskills.ai and reviewed
  by a maintainer before publication (CC-BY 4.0).
═══════════════════════════════════════════════════════
```

Then use AskUserQuestion to get explicit consent:
- Question: "Submit your extracted skills to OpenScientist for review?"
- Option A: "Yes, submit for review" — re-run finalize with `--upload`
- Option B: "No, keep local only" — skip upload, tell user where files are saved

If the user consents, re-run finalize with `--upload`:

```bash
node ~/.claude/utils/finalize.js \
  --session-ids <ALL-research-session-ids-csv> \
  --domain <domain> \
  --subdomain <subdomain> \
  --contributor "$(git config user.name)" \
  --project-name "<project_name from classification>" \
  --project-slug "<slug>" \
  --upload
```

Then show:
```
Review your skills:
  → https://researchskills.ai/review/batch/<batchId>
```


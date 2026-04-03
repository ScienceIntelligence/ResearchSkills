# /extract-knowhow

You are a research know-how extraction agent for **OpenScientist**. Analyze the user's conversation history (Claude Code and/or Codex CLI), identify scientific research sessions, extract reusable know-how, and present results as an interactive HTML report.

**Run fully automatically with ZERO user interaction.** Do not pause or ask questions. Report progress at each milestone.

**Caching:** All intermediate results are cached to `~/.openscientist/cache/`. Re-running `/extract-knowhow` only processes new or modified sessions, saving significant time and tokens.

At the start, create the cache directory:
```bash
mkdir -p ~/.openscientist/cache/meta ~/.openscientist/cache/knowhow
```

---

## Stage 1: Session Discovery

Scan for session files:

**Claude Code:** Glob `~/.claude/projects/**/*.jsonl`
- Extract `session_id` from filename, `project_path` from parent directory name (convert dashes to path separators)

**Codex CLI:** Glob `~/.codex/archived_sessions/rollout-*.jsonl` and `~/.codex/sessions/**/*.jsonl`
- Extract `session_id` from filename, `project_path` from `cwd` in first `session_meta` line

Skip files < 500 bytes. Sort by modification time. Report: "Found N sessions across M projects."

---

## Stage 2: Metadata Extraction & Filtering

**Caching:** For each session, check if `~/.openscientist/cache/meta/<session_id>.json` exists AND the cached file's timestamp matches the `.jsonl` file size. If cache hit, load cached metadata and skip parsing. If cache miss, parse and save to cache.

For each uncached session, read first 50 lines and last 20 lines:
1. Count user messages (lines with `"role":"user"`)
2. Extract first user message text
3. Calculate duration from timestamps
4. Extract `cwd` field
5. Classify as research / engineering / other (see Stage 3 rules below)

Save the extracted metadata + classification to `~/.openscientist/cache/meta/<session_id>.json`:
```json
{
  "session_id": "abc123",
  "project_path": "/Users/x/project",
  "first_prompt": "...",
  "user_message_count": 15,
  "duration_minutes": 45,
  "file_size": 123456,
  "classification": "research",
  "research_topic": "...",
  "activity_types": ["06-coding-and-execution", "07-result-analysis"]
}
```

**Deduplication:** If multiple sessions have the same content (identical `first_prompt` and similar `user_message_count`), keep the one with more user messages.

**Filter out:** < 2 user messages, < 1 minute duration, agent sub-sessions (first 5 lines contain `"RESPOND WITH ONLY A VALID JSON OBJECT"` or `"record_facets"`)

Report: "After filtering, N sessions remain (X from cache, Y newly analyzed)."

---

## Stage 3: Research Relevance Filter

**Note:** Classification is now done in Stage 2 (and cached). This stage simply aggregates the results.

Classification rules for reference:

**research:** literature search, hypothesis formation, derivation, experiment design, data collection, statistical analysis, scientific writing, peer review, scientific tool development, grant writing

**engineering:** web/mobile dev, DevOps, general software, business logic

**other:** casual, setup, unrelated

For research sessions, also record `research_topic` (1-2 sentences) and likely `activity_types`.

Only research sessions proceed. Report: "Identified N research sessions out of M total."

If zero research sessions: report and stop.

---

## Stage 4: Project Clustering & Domain Mapping

**Automatic — no user confirmation.**

1. Group by `project_path`
2. Merge sessions with same research topic across directories
3. Map each project to OpenScientist taxonomy:
   - **domain:** physics | mathematics | computer-science | quantitative-biology | statistics | eess | economics | quantitative-finance
   - **subdomain:** arXiv-aligned (e.g. machine-learning, quantum-physics)

Report: "Mapped N research projects to domains."

---

## Stage 5: Know-How Extraction

For each project, extract ALL know-how automatically.

**Parallel processing:** If there are multiple research projects, process them in parallel using the Agent tool — dispatch one subagent per project. Each subagent receives the project's session file paths and the extraction instructions below, and returns the extracted know-how items as JSON. This significantly speeds up extraction when the user has many research projects.

**Caching:** Check if `~/.openscientist/cache/knowhow/<session_id>.json` exists for each session in the project. If ALL sessions in a project have cached know-how AND no session files have changed, load from cache and skip extraction. Otherwise, re-extract for that project only.

**Incremental limit:** Process at most 50 new (uncached) sessions per run. If more remain, report: "Processed 50 sessions. Run /extract-knowhow again to analyze the remaining N sessions."

### Read Content
Read full `.jsonl` files. For sessions > 30,000 chars, split into 25,000-char segments, summarize preserving methods/tools/parameters/pitfalls, merge.

### Extract by 10 Categories

| Category ID | What to look for |
|-------------|-----------------|
| `01-literature-search` | Search strategies, databases, filtering, citations |
| `02-hypothesis-and-ideation` | Hypothesis formation, idea evaluation |
| `03-math-and-modeling` | Proofs, modeling, mathematical formulations |
| `04-experiment-planning` | Protocols, controls, variable selection |
| `05-data-acquisition` | Data sources, cleaning, labeling |
| `06-coding-and-execution` | Coding patterns, libraries, debugging |
| `07-result-analysis` | Statistics, visualization, interpretation |
| `08-reusable-tooling` | Tools built, method innovations, workflows |
| `09-paper-writing` | Writing structure, figures, claims |
| `10-review-and-rebuttal` | Self-critique, reviewer responses, revision |

**DO extract:** specific parameters, decision criteria, debugging patterns, tool rationale, domain conventions, methodological insights.

**DO NOT extract:** generic programming, AI tool usage, personal preferences, textbook basics.

### Output per item
```json
{
  "title": "Short descriptive title",
  "category": "06-coding-and-execution",
  "description": "2-3 sentences",
  "domain_knowledge": "Key concepts and principles",
  "reasoning_steps": ["Step 1...", "Step 2..."],
  "tools": ["tool — what it does"],
  "pitfalls": ["Mistake and how to avoid"],
  "confidence": "high | medium | low"
}
```

After extraction, save each session's know-how to `~/.openscientist/cache/knowhow/<session_id>.json`:
```json
{
  "session_id": "abc123",
  "project_name": "...",
  "domain": "physics",
  "subdomain": "computational-physics",
  "skills": [ ...extracted items... ],
  "file_size": 123456
}
```

Report: "Extracted N know-how items across all projects (X from cache, Y newly extracted)."

---

## Stage 6: HTML Report Generation

### Step 6.1: Collect Author (automatic)

Run silently via Bash:
```
git config user.name
git config user.email
```
If unavailable, use "Anonymous Contributor".

### Step 6.2: Build Data Object

Assemble all results into a single JSON object:
```json
{
  "author": "git user.name",
  "email": "git user.email",
  "total_sessions": 47,
  "date": "2026-04-02",
  "projects": [
    {
      "name": "Project Name",
      "domain": "physics",
      "subdomain": "computational-physics",
      "session_count": 5,
      "skills": [ ...array of know-how items from Stage 5... ]
    }
  ]
}
```

### Step 6.3: Generate HTML

Create directory: `mkdir -p ~/.openscientist`

Write a SINGLE self-contained HTML file to `~/.openscientist/report.html`. The HTML must:

1. **Embed the JSON data** as `const DATA = { ... };` in a `<script>` tag (replace actual values, no placeholders)
2. **Use dark theme** (GitHub-style: #0d1117 background, #e6edf3 text)
3. **Header section:** title "OpenScientist — Know-How Extraction Report", author, date, stats (projects count, skills count, sessions analyzed)
4. **Project cards:** one card per project with domain/subdomain badge
5. **Skill rows inside each project card:**
   - Checkbox (checked by default) to accept/reject
   - Category badge with color coding (different color per category)
   - Title, description, confidence level
   - "Show details" expand button → reveals domain_knowledge, reasoning_steps, tools, pitfalls
   - **All fields are editable inline** — title, description, domain_knowledge, reasoning_steps, tools, pitfalls all use `contenteditable="true"` so the user can refine content directly in the browser. Edited values must be used when generating the submit script.
6. **Submit section at bottom:**
   - "Save Approved Skills" button
   - On click: collects all accepted (and possibly edited) skills into a JSON object and triggers a browser download of `approved-skills.json`
   - Tells the user: "Go back to your terminal — Claude Code will submit these skills for you."
7. **All CSS and JS inline** — zero external dependencies
8. **Responsive** — works on any screen width

### Step 6.4: Open Report

```bash
open ~/.openscientist/report.html  # macOS
# or: xdg-open ~/.openscientist/report.html  # Linux
```

### Step 6.5: Terminal Message

Print:
```
Report opened in browser. Review your extracted skills, edit if needed, then click "Save Approved Skills".

Waiting for you to save approved-skills.json...
```

Then wait for the user to return. When the user comes back (they will say something like "done", "saved", "submitted", etc.), proceed to Stage 7.

---

## Stage 7: Submit to OpenScientist

After the user returns from the browser:

### Step 7.1: Find the approved skills JSON

Look for the downloaded file. Check these locations in order:
1. `~/Downloads/approved-skills.json`
2. `~/.openscientist/approved-skills.json`
3. Ask the user for the path if not found

### Step 7.2: Read and parse the JSON

The JSON structure is:
```json
{
  "author": "Name (Institution)",
  "author_name": "Name",
  "author_role": "PhD Candidate",
  "author_institution": "Institution",
  "date": "2026-04-02",
  "skills": [
    {
      "title": "...", "category": "06-coding-and-execution",
      "description": "...", "domain_knowledge": "...",
      "reasoning_steps": [...], "tools": [...], "pitfalls": [...],
      "confidence": "high",
      "project_name": "...", "domain": "physics", "subdomain": "computational-physics"
    }
  ]
}
```

### Step 7.3: Submit each skill as a GitHub Issue

For each skill in the array, run:

```bash
gh issue create --repo OpenScientists/OpenScientist \
  --title "Skill Submission: [slugified-title]" \
  --label "skill-submission" \
  --body "[issue body following submit-skill.yml template]"
```

The issue body must include these fields matching the `submit-skill.yml` template:
- **Full Name:** from `author_name`
- **Role:** from `author_role`
- **Affiliation:** from `author_institution`
- **Target Subdomain:** formatted as "Domain / Subdomain"
- **Research Activity Category:** category ID and label
- **Skill File Content:** full `.md` skill file in a markdown code block
- **How was this skill created?:** "Generated by /extract-knowhow, then reviewed by me"
- **Additional Notes:** confidence level

### Step 7.4: Final Summary

```
═══════════════════════════════════════════════════════
  /extract-knowhow Complete!
═══════════════════════════════════════════════════════

Submitted N skill(s) to OpenScientist!

View your submissions:
  https://github.com/OpenScientists/OpenScientist/issues?q=label%3Askill-submission

Thank you for contributing to the Library of Alexandria for AGI!
```

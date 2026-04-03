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

### Generalization Principle

**The goal is to extract tacit knowledge — the hard-won intuition, thinking frameworks, and principles that experts carry in their heads but never write down.** Skills should be useful to ANY researcher in the same subdomain, not just the original author.

When extracting from a specific project, always ask: "Would this help a new PhD student entering this field?" If yes, extract it. If it only makes sense in the context of this particular project, generalize it or skip it.

**Generalize:** "For our LiFePO4 simulation, AMIX=0.05 worked" → "For GGA+U calculations on any transition metal oxide with localized d-electrons, reduce AMIX to 0.05"

**Don't just copy:** "In /Users/jane/project-x/run3, I set ENCUT=520" → Extract the principle: "For transition metal oxides, converge ENCUT by testing 400-600 eV in 50 eV steps; most systems converge around 500-550 eV"

### Privacy & De-identification

**All generated skills must be fully de-identified.** Strip out:
- File paths, directory names, usernames (e.g. `/Users/jane/project/`)
- Project-specific names, dataset names, or internal identifiers
- Email addresses, URLs to private resources
- Names of collaborators or lab members
- Any information that could identify the researcher (except the author field, which is intentionally public)

Replace specific references with generic descriptions: "our internal dataset" → "a domain-specific dataset", "/home/user/exp3/results.csv" → "the results file"

### What to extract

**DO extract** — generalizable tacit knowledge:
- Decision-making principles ("always do X before Y because...")
- Diagnostic reasoning ("when you see symptom A, check B first, not C")
- Parameter selection heuristics with scientific justification
- Tool selection rationale applicable to the broader field
- Domain conventions that newcomers wouldn't know
- Methodological insights that transfer across projects in the subdomain
- Thinking frameworks for approaching common problems in the field

**DO NOT extract:**
- Project-specific implementation details with no transferable value
- Generic programming knowledge (git, for loops, package installation)
- AI tool usage patterns (how to prompt Claude, how to use Codex)
- Personal preferences with no scientific basis
- Standard textbook knowledge with no novel application
- Any personally identifiable information

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

Read the HTML template from the npm package at `templates/report.html` (installed alongside this command). The template contains all CSS, JS, and the interactive UI. Replace the `__REPORT_DATA__` placeholder in the template with the actual JSON data object from Step 6.2.

If the template file is not found, fall back to writing a minimal HTML page that embeds the JSON data and displays it.

Write the result to `~/.openscientist/report.html`.

The HTML template provides:
1. Dark theme UI with project cards and skill rows
2. Checkbox to accept/reject each skill
3. Inline editing of all fields (title, description, domain knowledge, etc.)
4. Per-skill **"Submit to GitHub"** button — opens a new browser tab with the `01-submit-skill.yml` issue template pre-filled with all fields
5. **"Submit All Accepted"** button — opens one tab per accepted skill
6. No terminal commands needed — submission is entirely browser-based

### Step 6.4: Open Report

```bash
open ~/.openscientist/report.html  # macOS
# or: xdg-open ~/.openscientist/report.html  # Linux
```

### Step 6.5: Terminal Summary

```
═══════════════════════════════════════════════════════
  /extract-knowhow Complete!
═══════════════════════════════════════════════════════

Extracted N know-how items from M research projects.

Report saved to: ~/.openscientist/report.html

In the report you can:
  ✓ Review and edit each extracted skill
  ✓ Accept or reject individual items
  ✓ Submit directly to OpenScientist via GitHub (one click per skill)
```

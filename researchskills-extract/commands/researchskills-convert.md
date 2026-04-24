# /researchskills-convert

Convert existing research skills from any format (notes, documents, other AI tools) into **ResearchSkills** format, then fork the repo and open a PR — all in one step.

**This is an interactive skill.** Ask the user ONE question at a time. Do not dump all questions at once.

---

## Stage 1 — Collect Input

Ask the user:

> **Where are your skills?**
> Provide a file path, a directory, or paste them here.

Read the files or accept the pasted text. If a directory, recursively read all `.md`, `.txt`, `.json`, and `.yaml` files in it.

---

## Stage 2 — Identify the User

Get the GitHub username for the `contributor` field:

```bash
gh api user --jq '.login'
```

If `gh` is not installed or not authenticated, tell the user:

> `gh` (GitHub CLI) is required for PR creation. Install it:
> - macOS: `brew install gh`
> - Linux: see https://cli.github.com
>
> Then run `gh auth login` to authenticate.

**Stop here until `gh api user` succeeds.**

---

## Stage 3 — Convert Skills

Analyze the input and convert each genuine **research** skill into the ResearchSkills format. Apply these filters:

### What to INCLUDE
- Domain-specific research insights a researcher would find non-obvious
- Methodology decisions, scientific corrections, experimental lessons
- Knowledge that is frontier, non-public, or corrects LLM misconceptions

### What to SKIP
- Generic software engineering (git workflows, CI/CD, Docker, deployment)
- DevOps, infrastructure, or tooling knowledge
- Textbook material readily available in LLM training data
- Content that is not related to scientific research

### Memory Types and Required Sections

**Procedural** (subtypes: `tie`, `no-change`, `constraint-failure`, `operator-fail`)
- When — trigger conditions and exclusions
- Decision — Preferred, Rejected, Reasoning
- Local Verifiers — concrete diagnostics
- Failure Handling — fallback strategies
- Anti-exemplars — when NOT to use (recommended)

**Semantic** (subtypes: `frontier`, `non-public`, `correction`)
- Fact — precise core claim
- Evidence — how you know this is true
- LLM Default Belief — **correction subtype only**, delete for others
- Expiry Signal — when to revisit

**Episodic** (subtypes: `failure`, `adaptation`, `anomalous`)
- Situation — tools, dataset, parameters, expectations
- Action — what was done, with specifics
- Outcome — concrete result with metrics
- Lesson — specific IF-THEN rule
- Retrieval Cues — trigger conditions for recall

### Frontmatter

Every skill file must have this exact frontmatter:

```yaml
---
name: "Skill Name In Title Case"
memory_type: procedural          # procedural | semantic | episodic
subtype: tie                     # see subtypes above
domain: computer-science         # see domain list below
subdomain: machine-learning      # arXiv-aligned subdomain
contributor: gh-username          # from Stage 2
---
```

### Valid Domains

Pick from these arXiv-aligned domains:
- `physics`
- `mathematics`
- `computer-science`
- `quantitative-biology`
- `statistics`
- `eess` (electrical engineering and systems science)
- `economics`
- `quantitative-finance`

For subdomain, use an arXiv-aligned subcategory (e.g., `machine-learning`, `geophysics`, `genomics`, `methodology`).

### De-identification

Before outputting, strip:
- Personal names (replace with role descriptions)
- Private file paths (use generic paths)
- Internal URLs and hostnames
- Lab-specific identifiers
- API keys, tokens, credentials

All output MUST be in English. If source material is in another language, paraphrase in English.

---

## Stage 4 — Show Preview

Show the user all converted skills in a summary table:

```
Converted N skills:

  #  Type         Subtype              Domain / Subdomain                   Name
  1  procedural   constraint-failure   statistics / methodology             AUC Computation With Masked Data
  2  semantic     correction           computer-science / machine-learning  Batch Norm Placement Misconception
  3  episodic     adaptation           physics / geophysics                 Gradient Explosion Under FP16

Proceed with forking and PR creation? (y/n)
```

**STOP and wait for user confirmation.** Do not proceed without explicit consent.

If the user wants to edit, adjust, or remove specific skills, do so before proceeding.

---

## Stage 5 — Fork and Create PR

### 5.1 — Check for existing fork

```bash
gh repo view "$(gh api user --jq '.login')/ResearchSkills" --json name 2>/dev/null
```

If no fork exists:

```bash
gh repo fork ScienceIntelligence/ResearchSkills --clone=false
```

### 5.2 — Clone the fork into a temp directory

```bash
WORK_DIR=$(mktemp -d)
gh repo clone "$(gh api user --jq '.login')/ResearchSkills" "$WORK_DIR" -- --depth=1
cd "$WORK_DIR"
git remote add upstream https://github.com/ScienceIntelligence/ResearchSkills.git
git fetch upstream main --depth=1
git reset --hard upstream/main
```

### 5.3 — Create a branch

```bash
BRANCH="convert/$(gh api user --jq '.login')-$(date +%Y%m%d-%H%M%S)"
git checkout -b "$BRANCH"
```

### 5.4 — Place skill files

Each skill must be placed at the correct path. **Create directories that don't exist.**

```
skills/<domain>/<subdomain>/<contributor>/<memory_type>/<subtype>--<skill-name>.md
```

Rules:
- `<domain>` — lowercase (e.g., `computer-science`)
- `<subdomain>` — lowercase, hyphen-separated (e.g., `machine-learning`)
- `<contributor>` — GitHub username from Stage 2
- `<memory_type>` — `procedural`, `semantic`, or `episodic`
- `<subtype>--<skill-name>` — lowercase, hyphen-separated (e.g., `correction--batch-norm-placement-misconception.md`)

Example paths:
```
skills/statistics/methodology/jdoe/procedural/constraint-failure--auc-computation-with-masked-data.md
skills/computer-science/machine-learning/jdoe/semantic/correction--batch-norm-placement-misconception.md
skills/physics/geophysics/jdoe/episodic/adaptation--gradient-explosion-under-fp16.md
```

For each skill:

```bash
SKILL_DIR="skills/<domain>/<subdomain>/<contributor>/<memory_type>"
mkdir -p "$SKILL_DIR"
```

Then write the skill file to `$SKILL_DIR/<subtype>--<skill-name>.md`.

### 5.5 — Commit

```bash
git add skills/
git commit -m "add(skills): N skills by <contributor>"
```

### 5.6 — Push and create PR

```bash
git push -u origin "$BRANCH"
```

Create a PR to the upstream repo:

```bash
gh pr create \
  --repo ScienceIntelligence/ResearchSkills \
  --head "$(gh api user --jq '.login'):$BRANCH" \
  --title "[convert] Add N research skills by <contributor>" \
  --body "$(cat <<'EOF'
## Submission Type
- [x] Research Skill (converted from existing notes/documents via `/researchskills-convert`)

## Skills Added
<list each skill: type, subtype, domain/subdomain, name>

## Checklist
- [x] Files placed in `skills/<domain>/<subdomain>/<contributor>/<memory_type>/`
- [x] Filenames follow pattern `<subtype>--<skill-name>.md`
- [x] All required frontmatter fields filled
- [x] All required body sections present
- [x] Content is de-identified
- [x] All content in English
EOF
)"
```

### 5.7 — Clean up

```bash
rm -rf "$WORK_DIR"
```

---

## Stage 6 — Report

Show the user:

```
═══════════════════════════════════════════════════════
  /researchskills-convert — Done!
═══════════════════════════════════════════════════════

  Submitted N skills via PR:
    → <PR URL>

  A domain reviewer will review your PR and merge it.
  You can track the status on GitHub.
═══════════════════════════════════════════════════════
```

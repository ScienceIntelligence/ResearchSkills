# @openscientist/extract-knowhow

> Automatically extract **research skills** from Claude Code / Codex conversation history and submit them to [OpenScientist](https://github.com/OpenScientists/OpenScientist).

## What It Does

When you use Claude Code or Codex for scientific research — data analysis, paper writing, experiment design, theoretical derivation — your conversations contain valuable tacit knowledge: judgment calls, abandoned approaches, tool choices, and reasoning patterns.

`/extract-knowhow` extracts three types of cognitive memory from your research sessions:

- **Procedural memory:** IF-THEN rules for navigating research impasses (e.g., "IF gradient explodes THEN check learning rate before architecture")
- **Semantic memory:** Domain facts that LLMs don't reliably know (e.g., calibration constants, undocumented tool behaviors)
- **Episodic memory:** Concrete research episodes capturing what was tried, what failed, and what was learned

## Install

```bash
npm install -g @openscientist/extract-knowhow
```

This installs the command automatically to both platforms:
- **Claude Code** → `~/.claude/commands/extract-knowhow.md`
- **Codex** → `~/.codex/skills/extract-knowhow/SKILL.md`

## Usage

**Claude Code:**
```
/extract-knowhow
```

**Codex** (start with `codex -a never -s danger-full-access`):
```
$extract-knowhow
```

> 💡 **For best results:** use the most powerful model with the highest reasoning effort — **Claude Code:** Opus 4.6 + max effort. **Codex:** GPT-5.4 + x-high. Don't worry about token usage — conversations are heavily compressed before analysis, and per-session extraction is delegated to lighter models behind the scenes. Your chosen model mainly orchestrates the pipeline.

The command runs a 7-stage pipeline:

1. **Scan** — discover all Claude Code and Codex sessions
2. **Classify** — identify research vs. engineering projects (Sonnet)
3. **Confirm** — you choose which projects to scan (multi-select)
4. **Extract** — extract research skills per session (Sonnet)
5. **Clean & Score** — Opus reviews, rejects, merges, and scores skills
6. **Finalize** — collect results; upload only with your consent
7. **Summary** — report results with review statistics

## Output

Each skill is a markdown file with YAML frontmatter, including three review scores:

```yaml
---
name: gradient-explosion-diagnosis
memory_type: procedural
subtype: operator-fail
llm_score: 4
review_scores:
  procedural: 4   # decision frameworks AI doesn't know
  semantic: 2      # facts/beliefs AI doesn't have
  episodic: 3      # concrete research experiences
tags: [gradient-descent, debugging, neural-networks]
domain: computer-science
subdomain: machine-learning
contributor: anon-7f3b42c9
---

## When
Using Adam or SGD with deep networks; loss spikes unpredictably.

## Decision
Check learning rate first (most common cause), not architecture.

## Local Verifiers
- nan_count in gradients > threshold
- loss jump > 10x in single step

## Failure Handling
If gradient norm clipping doesn't fix: check batch normalization placement
```

## Contributing Back

After extraction, an interactive review page opens at `researchskills.ai/review/batch/<id>` where you can:

- Review and edit skill content
- See the 3-dimension review scores
- Assign domain/subdomain taxonomy
- Submit to OpenScientist

## Uninstall

```bash
npm uninstall -g @openscientist/extract-knowhow
```

## Privacy

- All analysis happens locally via your Claude Code / Codex session
- Session data is read from `~/.claude/projects/` and `~/.codex/` on your machine
- **You choose which projects to scan** — the tool pauses after classification for your selection
- Unselected projects are skipped for extraction (classification reads only brief message samples)
- AI auto-strips personal information; you review before submitting
- Nothing is uploaded without your explicit consent

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## Part of [OpenScientist](https://github.com/OpenScientists/OpenScientist)

> Building the Library of Alexandria for AGI — Accelerating Automated Scientific Discovery.

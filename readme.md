<div align="right">

[English](#-researchskills) · [中文](readme_zh.md)

</div>

<div align="center">

# 🌍 ResearchSkills

[![GitHub stars](https://img.shields.io/github/stars/ScienceIntelligence/ResearchSkills?style=social)](https://github.com/ScienceIntelligence/ResearchSkills/stargazers) [![GitHub forks](https://img.shields.io/github/forks/ScienceIntelligence/ResearchSkills?style=social)](https://github.com/ScienceIntelligence/ResearchSkills/fork) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

2015: 5,154 scientists co-authored one paper on the Higgs boson.

Today: We're launching the largest academic collaboration in human history

**— 🏛️ Building the Library of Alexandria for AGI, Accelerating Automated Scientific Discovery.**

<p align="center">
  <a href="https://researchskills.ai/">https://researchskills.ai/</a>
</p>

---

<h2 align="center">1. About ResearchSkills</h2>

</div>

**Science is the last important problem left for AI to solve.** Real scientific breakthroughs require something no model has: the hard-won intuition of researchers who've spent years at the frontier.

This intuition lives in your head — the know-how, the heuristics, the reasoning patterns, the "I just know this won't work" instinct. It never makes it into papers. It dies when you retire.

**ResearchSkills captures it before it's lost.** We turn the tacit knowledge of the world's top researchers — their skills, thinking frameworks, and principles — into reusable AI agent skills (compatible with **Claude Code** and **Codex**). Every contribution makes every AI scientist — now and in the future — smarter, permanently.

Each skill encodes the knowledge, tools, reasoning protocols, and common pitfalls of a scientific field. Skills can be written by domain experts or **auto-extracted from your research conversations** using `/extract-knowhow`. The command extracts three types of cognitive memory from your research sessions — **procedural** (IF-THEN rules for research impasses), **semantic** (facts LLMs don't know), and **episodic** (concrete research episodes) — then packages them as reusable skills. Point your AI agent at a skill, and it reasons like a domain expert.

> **Note:** Applying a skill may trigger broad edits, long workflows, and significant token usage — review the expected scope before running one deeply.

---

<h2 align="center">Why Contribute?</h2>

- **Your skills make YOUR AI smarter first.** Extracted skills are cached locally. Your Claude Code / Codex / Cursor immediately reasons better in your domain — before you ever submit anything.

- **Privacy first.** Nothing is scanned or uploaded without your explicit consent. A blocking consent gate asks before every operation. You review everything before submission.

- **Low cost, smart caching.** Conversations are compressed before analysis. Already-processed sessions are cached and skipped on re-runs. The heavy lifting is delegated to lighter models.

- **Works everywhere.** Claude Code, Codex, Cursor, Windsurf, VS Code, JetBrains — any tool that reads markdown instructions. Skills are plain `.md` files, not locked to one platform.

- **Works on remote servers.** SSH and headless environments are auto-detected. No browser needed — the submission URL is printed to your terminal.

- **Immortalize your expertise.** Your decades of know-how become a permanent, citable contribution to science. Every skill you contribute trains every future AI scientist.

---

<h2 align="center">2. How to Contribute</h2>

### Method A: Auto-Extract with `/extract-knowhow` (Recommended)

```bash
npm install -g @researchskills/extract-knowhow
```

**Claude Code:**
```
/extract-knowhow
```

**Codex** (start with `codex -a never -s danger-full-access`):
```
$extract-knowhow
```

> 💡 **For best results:** use the most powerful model with the highest reasoning effort — **Claude Code:** Opus 4.6 + max effort. **Codex:** GPT-5.4 + x-high. Don't worry about token usage — conversations are heavily compressed before analysis, and the per-session extraction is delegated to lighter models behind the scenes. Your chosen model mainly orchestrates the pipeline.

The command scans your conversation history and extracts **research skills** organized by cognitive memory type:

- **Procedural memory:** IF-THEN rules for navigating research impasses (e.g., "IF gradient explodes THEN check learning rate before architecture")
- **Semantic memory:** Domain facts that LLMs don't reliably know (e.g., calibration constants, method limitations, undocumented tool behaviors)
- **Episodic memory:** Concrete research episodes capturing what was tried, what failed, and what the researcher learned

An interactive browser review page lets you verify the extracted skills, check de-identification, and bind them to your paper (arXiv/DOI) or project. Submit your skills to ResearchSkills, where they become part of a growing knowledge base for building better AI scientists.

### Method B: One-Click Prompt for Web Users (ChatGPT / Claude / Gemini)
After running, submit via [**here →**](https://researchskills.ai/submit-manually/#auto-parse)

### Method C: Write Manually

Write your own skill following the [**guide →**](https://researchskills.ai/submit-manually/#manual-entry)

> Don't see your field? [Propose a new area →](https://github.com/ScienceIntelligence/ResearchSkills/issues/new?template=04-propose-new-area.md) · Need a skill but can't write it yourself? [Request a skill →](https://github.com/ScienceIntelligence/ResearchSkills/issues/new?template=02-skill-request.yml)

---

<h2 align="center">3. Skill Architecture</h2>

ResearchSkills skills are grounded in cognitive architecture theory — [Soar](https://en.wikipedia.org/wiki/Soar_(cognitive_architecture)) (Laird, 2012), [ACT-R](https://en.wikipedia.org/wiki/ACT-R) (Anderson, 1996), and [Case-Based Reasoning](https://en.wikipedia.org/wiki/Case-based_reasoning) (Kolodner, 1993). Skills are organized by **how researchers' minds actually store and retrieve expertise**, not by arbitrary categories.

### Three Memory Types

| Type | What it stores | When it triggers |
|------|---------------|-----------------|
| **Procedural** | IF-THEN rules for research impasses | Agent faces a decision, gets stuck, or assumptions fail |
| **Semantic** | Facts missing from LLM training data | Agent needs domain knowledge it doesn't have |
| **Episodic** | Concrete research episodes | Agent encounters a situation similar to a past experience |

### Procedural Memory — "How to decide"

Classified by the type of **research impasse** (adapted from Soar's impasse taxonomy):

| Subtype | Impasse | Example |
|---------|---------|---------|
| `tie` | Multiple paths, unclear which to choose | "Ablation vs. full retrain — which first?" |
| `no-change` | Completely stuck, no idea what to do next | "Results are bizarre, nothing makes sense" |
| `constraint-failure` | A methodological assumption doesn't hold | "Data violates i.i.d. assumption" |
| `operator-fail` | Chose the right approach but execution fails | "Correct method, but CUDA OOM on large batch" |

Each procedural skill contains: **When** (trigger condition + exclusions) → **Decision** (preferred action + rejected alternatives + reasoning) → **Local Verifiers** (how to check) → **Failure Handling** (what if it doesn't work) → **Anti-exemplars** (when NOT to use this).

### Semantic Memory — "What LLMs don't know"

Only three sub-types qualify — everything else is redundant with LLM training data:

| Subtype | What it stores | Example |
|---------|---------------|---------|
| `frontier` | Post-training-cutoff knowledge | "Flash Attention 3 renamed the `causal` parameter" |
| `non-public` | Lab-internal, unpublished knowledge | "This vendor's H100 batch has NCCL topology issues" |
| `correction` | Fixes for LLM's incorrect default beliefs | "Adam eps=1e-8 is unstable for mixed-precision; use 1e-5" |

### Episodic Memory — "What happened"

Classified using Case-Based Reasoning terminology:

| Subtype | Signal | Retrieval trigger |
|---------|--------|------------------|
| `failure` | "Did X, broke because of hidden reason Y" | Agent is about to do something similar |
| `adaptation` | "Standard method failed, but workaround Z worked" | Agent is stuck with the standard approach |
| `anomalous` | "Expected A, observed B — turned out to be important" | Agent observes a similar anomaly |

### Directory Structure

```
skills/
└── {domain}/                    # 8 arXiv-aligned domains
    └── {subdomain}/             # 155 subcategories
        └── {contributor}/       # Your name
            ├── procedural/      # tie--, no-change--, constraint-failure--, operator-fail--
            ├── semantic/        # frontier--, non-public--, correction--
            └── episodic/        # failure--, adaptation--, anomalous--
```

### Theoretical Foundation

For the full rationale — why research is hard, why LLMs struggle with it, and how skills change agent behavior — see [Why Research Is Hard](docs/why-research-is-hard.md). For the complete schema specification, see [Skill Schema Design](docs/superpowers/specs/2026-04-11-skill-schema-design.md).

---

<h2 align="center">4. Become a Reviewer</h2>

Reviewers are domain experts who guard the scientific quality of skills in their subdomain. You need substantial peer-review experience in the relevant field.

**What you do:** Review submitted skills for scientific accuracy and completeness. Provide constructive feedback to contributors. Promote skill status from `draft` to `reviewed` once verified.

**What you get:** Approve or request changes on submissions in your subdomain.

[**Apply to become a reviewer →**](https://github.com/ScienceIntelligence/ResearchSkills/issues/new?template=03-maintainer-application.yml)

---

<h2 align="center">5. Domains</h2>

<div align="center">

Aligned with the [arXiv category taxonomy](https://arxiv.org/category_taxonomy). 8 domains, 155 subcategories.

| Domain                                      | arXiv                                              | Subcategories | Reviewer(s)        |
| --------------------------------------------- | ---------------------------------------------------- | --------------- | -------------------- |
| ⚛️ Physics                                | astro-ph, cond-mat, gr-qc, hep, nlin, physics, ... | 51            | *Seeking reviewer* |
| ➗ Mathematics                              | math                                               | 32            | *Seeking reviewer* |
| 💻 Computer Science                         | cs                                                 | 40            | *Seeking reviewer* |
| 🧬 Quantitative Biology                     | q-bio                                              | 10            | *Seeking reviewer* |
| 📊 Statistics                               | stat                                               | 6             | *Seeking reviewer* |
| ⚡ Electrical Engineering & Systems Science | eess                                               | 4             | *Seeking reviewer* |
| 📈 Economics                                | econ                                               | 3             | *Seeking reviewer* |
| 💹 Quantitative Finance                     | q-fin                                              | 9             | *Seeking reviewer* |

[View all 155 subcategories in the interactive knowledge tree →](https://scienceintelligence.github.io/ResearchSkills/)

</div>

---

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — free to share and adapt, with attribution.

---

<div align="center">

## Acknowledgments

With gratitude to everyone who makes this possible:

[**Contributors →**](https://github.com/ScienceIntelligence/ResearchSkills/graphs/contributors) · [**Reviewers →**](https://scienceintelligence.github.io/ResearchSkills/reviewers.html) · [**Sponsors →**](https://scienceintelligence.github.io/ResearchSkills/organizers.html) · [**Organizers →**](https://scienceintelligence.github.io/ResearchSkills/organizers.html)

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=ScienceIntelligence/ResearchSkills&type=Date)](https://star-history.com/#ScienceIntelligence/ResearchSkills&Date)

</div>

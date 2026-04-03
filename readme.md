<div align="right">

[English](#-openscientist) · [中文](readme_zh.md)

</div>

<div align="center">

# 🌍 OpenScientist

[![GitHub stars](https://img.shields.io/github/stars/OpenScientists/OpenScientist?style=social)](https://github.com/OpenScientists/OpenScientist/stargazers) [![GitHub forks](https://img.shields.io/github/forks/OpenScientists/OpenScientist?style=social)](https://github.com/OpenScientists/OpenScientist/fork) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> *2015: 5,154 scientists co-authored one paper on the Higgs boson.*
>
> *Today: We're launching the largest academic collaboration in human history —*
> 🏛️ *Building the Library of Alexandria for AGI, Accelerating Automated Scientific Discovery.*

<p align="center">
  <a href="https://openscientists.github.io/OpenScientist/">
    <img src="https://raw.githubusercontent.com/OpenScientists/OpenScientist/main/utils/assets/knowledge-tree-v2.png" alt="Knowledge Tree" width="100%">
  </a>
</p>

<p align="center">
  <a href="https://openscientists.github.io/OpenScientist/">View Interactive Knowledge Tree →</a>
</p>

---

<h2 align="center">1. About OpenScientist</h2>

</div>

### 1.1 What is it

OpenScientist is a curated library of **AI agent skills** (compatible with **Claude Code** and **Codex CLI**) — structured Markdown files that give AI agents deep, expert-level reasoning capabilities in specific scientific domains.

### 1.2 How it works

Each skill encodes the knowledge, tools, reasoning protocols, and common pitfalls of a scientific field. Skills can be written by domain experts or **auto-extracted from your research conversations** using `/extract-knowhow`. Point your AI agent at a skill, and it reasons like a domain expert.

### 1.3 What can you do

Contribute your expertise, or use this repo to supercharge your AI agent's scientific discovery.

### 1.4 Open Source & Non-Profit

OpenScientist is a fully open-source, non-profit initiative. As the project grows, we plan to establish a non-profit organization (NGO) to ensure long-term governance, transparency, and stewardship of all contributed knowledge.

### 1.5 Why should you contribute?

Turning your know-how into AI-reusable knowledge means:

- **Boost your own research efficiency** — your AI agent gains your expertise and works alongside you
- **Boost humanity's research efficiency** — every scientist benefits from the collective knowledge
- **Survive the Singularity** — when ASI takes over, your contribution to this repo might just save your life

---

<h2 align="center">2. Domains</h2>

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

> [View all 155 subcategories in the interactive knowledge tree →](https://openscientists.github.io/OpenScientist/)

Skills are also classified by **research activity type** — 10 categories that span across all domains:

| # | Category | What it covers |
|---|----------|---------------|
| 1 | `01-literature-search` | Search strategies, paper filtering, citation analysis |
| 2 | `02-hypothesis-and-ideation` | Hypothesis formation, research question development |
| 3 | `03-math-and-modeling` | Proof strategies, modeling, mathematical formulation |
| 4 | `04-experiment-planning` | Protocols, control strategies, variable selection |
| 5 | `05-data-acquisition` | Data sources, cleaning pipelines, labeling |
| 6 | `06-coding-and-execution` | Coding patterns, library choices, debugging |
| 7 | `07-result-analysis` | Statistical methods, visualization, interpretation |
| 8 | `08-reusable-tooling` | Reusable tools, method innovations, workflows |
| 9 | `09-paper-writing` | Paper structure, figures, claim formulation |
| 10 | `10-review-and-rebuttal` | Self-critique, reviewer responses, revision |

---

<h2 align="center">3. How to Contribute</h2>

We welcome contributions from domain experts. See [CONTRIBUTING.md](utils/CONTRIBUTING.md) for the full guide.

### 3.1 Contributor Requirements

> **Who can contribute?** We maintain a high bar for scientific accuracy.

- **Academic credential** — PhD degree or equivalent research position (postdoc, research scientist, professor, etc.) is **required**
- **Real-name identity** — Contributors must use their real name and institutional affiliation in the `author` field (e.g., `"Dr. Albert Einstein (ETH Zürich Physics)"`)
- **Domain expertise** — You may only contribute skills within your area of professional expertise

### 3.2 Method A: Auto-Extract with `/extract-knowhow` (Recommended)

Let AI analyze your conversation history and automatically generate skill files from your research know-how:

```bash
npm install -g @openscientist/extract-knowhow
```

Then run the extraction:

**Claude Code:**
```
/model opus[1m]
/effort max
/extract-knowhow
```

**Codex CLI:**
```
/model gpt-5.4
/reasoning high
$extract-knowhow
```

> **Tip:** Use the most capable model with maximum effort for best extraction results.

The command will:
1. Scan your conversation history
2. Filter to research-related sessions only
3. Cluster by project and map to scientific domains
4. Extract reusable know-how across 10 categories (literature survey, ideation, formalization, experiment design, data collection, implementation, analysis, tool development, writing, peer review)
5. Present a report for your review
6. Generate skill files for you to review

After the command finishes, review the generated files for scientific accuracy, then submit:

- [**Submit your skill via GitHub Issue →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=submit-skill.yml) (just paste the file content — no git required!)
- Or, if you prefer git: fork the repo, copy the files into `skills/<domain>/<subdomain>/`, and open a PR

### 3.3 Method B: One-Click Prompt for Web Users (ChatGPT / Claude / Gemini)

Works with any AI chat that can reference your past conversations. First, enable memory so the AI can access your history:

| Platform | How to enable | Settings link |
|----------|--------------|---------------|
| **ChatGPT** | Settings > Personalization > turn on **Memory** and **Reference chat history** | [Settings](https://chatgpt.com/settings) |
| **Claude** | Settings > Capabilities > turn on **Memory** | [Settings](https://claude.ai/settings/capabilities) |
| **Gemini** | Settings > Personal context > turn on **Your past chats with Gemini** | [Settings](https://gemini.google.com/settings) |

Then paste this prompt into a **new conversation**:

<details>
<summary><b>Click to expand the full prompt</b></summary>

```
Review all our past conversations and extract every piece of reusable scientific research know-how. Focus exclusively on research activities — ignore general programming, setup, or casual conversations.

For each piece of know-how you find, classify it into one of these 10 categories:
1. Literature Search — search strategies, paper filtering, citation analysis
2. Hypothesis & Ideation — hypothesis formation, research question development
3. Math & Modeling — proof strategies, derivations, mathematical formulations
4. Experiment Planning — protocols, control strategies, variable selection
5. Data Acquisition — data sources, cleaning pipelines, labeling strategies
6. Coding & Execution — research coding patterns, library choices, debugging
7. Result Analysis — statistical methods, visualization, interpretation
8. Reusable Tooling — tools, methods, or workflows you helped me build
9. Paper Writing — writing structure, figure standards, claim formulation
10. Review & Rebuttal — self-critique, reviewer responses, revision strategies

Output each item in a SINGLE code block using this exact format, so I can copy-paste it directly:

---
name: short-descriptive-title
description: >
  2-3 sentences explaining what this know-how is and when to apply it.
domain: [physics|mathematics|computer-science|quantitative-biology|statistics|eess|economics|quantitative-finance]
subdomain: specific-area
category: [01-literature-search|02-hypothesis-and-ideation|03-math-and-modeling|04-experiment-planning|05-data-acquisition|06-coding-and-execution|07-result-analysis|08-reusable-tooling|09-paper-writing|10-review-and-rebuttal]
author: "My Name (My Institution)"
expertise_level: intermediate
tags: [keyword1, keyword2]
dependencies: []
version: 1.0.0
status: draft
reviewed_by: []
---

## Purpose

[Expand the description into a full paragraph]

## Tools

- **[Tool Name]**: what it does, when to use it

## Domain Knowledge

### Key Concepts

[Core concepts relevant to this know-how]

### Fundamental Principles

[Underlying scientific principles]

## Reasoning Protocol

Step 1: [specific step]
Step 2: [specific step]
Step 3: [specific step]

## Common Pitfalls

- [Pitfall 1: what goes wrong and how to avoid it]
- [Pitfall 2: what goes wrong and how to avoid it]

## References

- Extracted from conversation history
- Extraction date: [today's date]

---

Rules:
- Extract EVERY piece of research know-how, no matter how small
- Preserve my exact words and specific parameter values where possible
- DO NOT extract generic programming knowledge or textbook basics
- DO NOT summarize or group multiple items — one skill file per know-how item
- After the code block, confirm whether that is the complete set or if any remain
```

</details>

After running, review the output for accuracy, then submit:

- [**Submit your skill via GitHub Issue →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=submit-skill.yml) (just paste it — no git required!)

### 3.4 Method C: Write Manually

Write your own skill following the [template](skills/_template.md), then submit:

- [**Submit your skill via GitHub Issue →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=submit-skill.yml)

### 3.5 Don't see your field?

- [**Propose a new area →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=propose-new-area.md)

### 3.6 Need a skill but can't write it yourself?

- [**Request a skill →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=skill-request.yml)

---

<h2 align="center">4. Skill Format</h2>

### 4.1 What's inside a skill file?


| Section                 | Purpose                                                 |
| ------------------------- | --------------------------------------------------------- |
| YAML frontmatter        | Machine-readable metadata: name, domain, author, status |
| `## Purpose`            | When to invoke this skill                               |
| `## Domain Knowledge`   | Core concepts, equations, established facts             |
| `## Reasoning Protocol` | Step-by-step guide for AI reasoning                     |
| `## Tools`              | Key software, libraries, databases used in this domain  |
| `## Common Pitfalls`    | Mistakes and edge cases to avoid                        |
| `## Examples`           | Worked examples                                         |
| `## References`         | Key papers and textbooks                                |

### 4.2 Quality tiers


| Status     | Meaning                               |
| ------------ | --------------------------------------- |
| `draft`    | Authored, not yet peer-reviewed       |
| `reviewed` | Approved by a domain expert reviewer  |
| `verified` | Tested in real AI-scientist workflows |

---

<h2 align="center">5. How to Be a Reviewer</h2>

Reviewers are domain experts who ensure the scientific quality of skills in their subdomain.

### 5.1 Requirements

- Meet all requirements for [contributors](#3-how-to-contribute) (i.e. be a qualified contributor first)
- Have substantial peer-review experience in the relevant subdomain

### 5.2 Responsibilities

- Review skill PRs in your subdomain for scientific accuracy and completeness
- Provide constructive feedback to contributors
- Promote skill status from `draft` → `reviewed` after verification

### 5.3 Permissions

- Approve or request changes on PRs touching your subdomain
- Self-approve and merge your own PRs within your subdomain
- Auto-assigned as reviewer via CODEOWNERS when a PR touches your subdomain

### 5.4 Actions

- [**Apply to become a category reviewer →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=maintainer-application.yml)
- [**View all reviewers in the Knowledge Tree →**](https://openscientists.github.io/OpenScientist/)
- [**View all reviewers list →**](https://openscientists.github.io/OpenScientist/reviewers.html)

---

<h2 align="center">6. How We Work</h2>

### 6.1 Issue templates


| Template                                                                                                               | When to use                              |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| [Submit a Skill](https://github.com/OpenScientists/OpenScientist/issues/new?template=submit-skill.yml)                 | Submit a skill (from `/extract-knowhow` or manually written) |
| [Skill Request](https://github.com/OpenScientists/OpenScientist/issues/new?template=skill-request.yml)                 | Need a skill but can't write it yourself |
| [Reviewer Application](https://github.com/OpenScientists/OpenScientist/issues/new?template=maintainer-application.yml) | Apply to become a subdomain reviewer     |
| [Propose New Area](https://github.com/OpenScientists/OpenScientist/issues/new?template=propose-new-area.md)            | Propose a new top-level domain           |

### 6.2 Skill submission workflow

1. Contributor submits a skill via [GitHub Issue](https://github.com/OpenScientists/OpenScientist/issues/new?template=submit-skill.yml) (or opens a PR)
2. Subdomain reviewer checks scientific accuracy
3. Maintainer adds the skill file to the repo
4. Skill status starts as `draft`

**Status lifecycle:** `draft` → `reviewed` (reviewer approves) → `verified` (tested in a real AI workflow)

### 6.3 Automated reviewer onboarding

When a Reviewer Application issue receives the `approved` label, the [onboard-maintainer](/.github/workflows/onboard-maintainer.yml) workflow automatically:

- Adds the reviewer to `.github/CODEOWNERS`
- Adds their name to the [Knowledge Tree](https://openscientists.github.io/OpenScientist/) and [Reviewers page](https://openscientists.github.io/OpenScientist/reviewers.html)
- Closes the issue with a welcome comment

### 6.4 CODEOWNERS & review assignment

Each `skills/<domain>/<subdomain>/` path maps to a reviewer in [`.github/CODEOWNERS`](.github/CODEOWNERS). PRs touching that path automatically request the assigned reviewer. Unclaimed subdomains fall back to `@HHHHHejia`.

### 6.5 Join the core team

Want to help with CI, documentation, community management, or project operations? Reach out: **hejia@tapntell.ai**

---

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — free to share and adapt, with attribution.

---


---

<div align="center">

## Organizer & Sponsor

[**View all Organizers & Sponsors →**](https://openscientists.github.io/OpenScientist/organizers.html)

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=OpenScientists/OpenScientist&type=Date)](https://star-history.com/#OpenScientists/OpenScientist&Date)

</div>

<div align="right">

[English](#-openscientist) · [中文](readme_zh.md)

</div>

<div align="center">

# 🌍 OpenScientist

[![GitHub stars](https://img.shields.io/github/stars/OpenScientists/OpenScientist?style=social)](https://github.com/OpenScientists/OpenScientist/stargazers) [![GitHub forks](https://img.shields.io/github/forks/OpenScientists/OpenScientist?style=social)](https://github.com/OpenScientists/OpenScientist/fork) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

2015: 5,154 scientists co-authored one paper on the Higgs boson.

Today: We're launching the largest academic collaboration in human history

**— 🏛️ Building the Library of Alexandria for AGI, Accelerating Automated Scientific Discovery.**

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

**Science is the last important problem left for AI to solve.** Real scientific breakthroughs require something no model has: the hard-won intuition of researchers who've spent years at the frontier.

This intuition lives in your head — the know-how, the heuristics, the reasoning patterns, the "I just know this won't work" instinct. It never makes it into papers. It dies when you retire.

**OpenScientist captures it before it's lost.** We turn the tacit knowledge of the world's top researchers — their skills, thinking frameworks, and principles — into reusable AI agent skills (compatible with **Claude Code** and **Codex CLI**). Every contribution makes every AI scientist — now and in the future — smarter, permanently.

Each skill encodes the knowledge, tools, reasoning protocols, and common pitfalls of a scientific field. Skills can be written by domain experts or **auto-extracted from your research conversations** using `/extract-knowhow`. The command extracts three types of cognitive memory from your research sessions — **procedural** (IF-THEN rules for research impasses), **semantic** (facts LLMs don't know), and **episodic** (concrete research episodes) — then packages them as reusable skills. Point your AI agent at a skill, and it reasons like a domain expert.

---

<h2 align="center">2. How to Contribute</h2>

### Method A: Auto-Extract with `/extract-knowhow` (Recommended)

```bash
npm install -g @openscientist/extract-knowhow
```

**Claude Code:**
```
/extract-knowhow
```

**Codex CLI:**
```
$extract-knowhow
```

The command scans your conversation history and extracts **research skills** organized by cognitive memory type:

- **Procedural memory:** IF-THEN rules for navigating research impasses (e.g., "IF gradient explodes THEN check learning rate before architecture")
- **Semantic memory:** Domain facts that LLMs don't reliably know (e.g., calibration constants, method limitations, undocumented tool behaviors)
- **Episodic memory:** Concrete research episodes capturing what was tried, what failed, and what the researcher learned

An interactive browser review page lets you verify the extracted skills, check de-identification, and bind them to your paper (arXiv/DOI) or project. Submit your skills to OpenScientist, where they become part of a growing knowledge base for building better AI scientists.

### Method B: One-Click Prompt for Web Users (ChatGPT / Claude / Gemini)

Enable memory so the AI can access your history:

| Platform | How to enable | Settings link |
|----------|--------------|---------------|
| **ChatGPT** | Settings > Personalization > turn on **Memory** and **Reference chat history** | [Settings](https://chatgpt.com/settings) |
| **Claude** | Settings > Capabilities > turn on **Memory** | [Settings](https://claude.ai/settings/capabilities) |
| **Gemini** | Settings > Personal context > turn on **Your past chats with Gemini** | [Settings](https://gemini.google.com/settings) |

Then paste this prompt into a **new conversation**:

<details>
<summary><b>Click to expand the full prompt</b></summary>

```
Review all our past conversations and extract research skills organized by cognitive memory type. Focus exclusively on research activities — ignore general programming, setup, or casual conversations.

Extract three types of research knowledge:

1. **Procedural memory** — IF-THEN rules for navigating research impasses:
   - Format: "IF [situation] THEN [action] BECAUSE [reasoning]"
   - Focus on: decision points, failure recovery, method selection heuristics
   - Example: "IF model loss plateaus after 50 epochs THEN try reducing learning rate by 10x before changing architecture BECAUSE architecture changes are expensive and LR is the most common culprit"

2. **Semantic memory** — Domain facts that LLMs don't reliably know:
   - Calibration constants, undocumented tool behaviors, method limitations
   - Example: "Library X's default tokenizer silently truncates inputs over 512 tokens without warning"

3. **Episodic memory** — Concrete research episodes:
   - What was tried, what failed, what was learned
   - Include dead ends and abandoned approaches — these are the most valuable

For each skill, include:
- The research context (what problem was being solved)
- The domain/subdomain (e.g., physics/quantum-physics)
- Confidence level: high | medium | low

Output as a markdown document with sections for each memory type.

Rules:
- Extract the FULL research trajectory, including dead ends and abandoned paths
- DE-IDENTIFY all output: remove file paths, usernames, project names, private URLs, collaborator names. Keep scientific content (materials, parameters, methods)
- Focus on capturing the reasoning and judgment behind each action — the kind of intuition that never makes it into papers
- DO NOT skip failed attempts or abandoned directions — they reveal tacit knowledge
- DO NOT extract generic programming knowledge, AI tool usage patterns, or textbook basics
- After the output, ask if there are research conversations that were missed
```

</details>

After running, submit via: [**Submit your skill →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=01-submit-skill.yml)

### Method C: Write Manually

Write your own skill following the [template](skills/_template.md), then [**submit via GitHub Issue →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=01-submit-skill.yml)

> Don't see your field? [Propose a new area →](https://github.com/OpenScientists/OpenScientist/issues/new?template=04-propose-new-area.md) · Need a skill but can't write it yourself? [Request a skill →](https://github.com/OpenScientists/OpenScientist/issues/new?template=02-skill-request.yml)

---

<h2 align="center">3. Become a Reviewer</h2>

Reviewers are domain experts who guard the scientific quality of skills in their subdomain. You need substantial peer-review experience in the relevant field.

**What you do:** Review submitted skills for scientific accuracy and completeness. Provide constructive feedback to contributors. Promote skill status from `draft` to `reviewed` once verified.

**What you get:** Approve or request changes on submissions in your subdomain.

[**Apply to become a reviewer →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=03-maintainer-application.yml)

---

<h2 align="center">4. Domains</h2>

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

[View all 155 subcategories in the interactive knowledge tree →](https://openscientists.github.io/OpenScientist/)

</div>

---

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — free to share and adapt, with attribution.

---

<div align="center">

## Acknowledgments

With gratitude to everyone who makes this possible:

[**Contributors →**](https://github.com/OpenScientists/OpenScientist/graphs/contributors) · [**Reviewers →**](https://openscientists.github.io/OpenScientist/reviewers.html) · [**Sponsors →**](https://openscientists.github.io/OpenScientist/organizers.html) · [**Organizers →**](https://openscientists.github.io/OpenScientist/organizers.html)

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=OpenScientists/OpenScientist&type=Date)](https://star-history.com/#OpenScientists/OpenScientist&Date)

</div>

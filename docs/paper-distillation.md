# Paper-Based Skill Distillation

Reverse-engineer the tacit knowledge embedded in published papers into reusable ResearchSkills.

## Concept

Published papers contain far more expertise than what appears on the surface. Behind every methods section lie implicit decisions, rejected alternatives, domain-specific heuristics, and hard-won intuitions that the authors never explicitly state. These can be reverse-engineered ("distilled") into ResearchSkills.

The paper ["The Relic Condition: When Published Scholarship Becomes Material for Its Own Replacement"](https://arxiv.org/abs/2604.16116) (arXiv:2604.16116) discusses how published scholarship becomes raw material for AI systems — a dynamic that paper-based distillation makes explicit and constructive.

This approach complements the conversation-based extraction (`/researchskills-extract`). Conversation extraction captures skills from live research sessions; paper distillation captures skills from the published record.

## Process

1. **Select a researcher's body of work.** Choose 3–5 key papers from the same researcher or tightly related group. Focus on papers where the methodology is novel or non-obvious — not survey papers.

2. **Read for implicit decisions.** For each paper, ask:
   - What alternatives existed but were not chosen? Why?
   - What domain-specific heuristics are buried in the methods or supplementary material?
   - What would a competent-but-non-expert researcher get wrong if they tried to replicate this?
   - What failure modes does the paper hint at (e.g., "we found that X did not work")?

3. **Identify recurring patterns.** Across the 3–5 papers, look for:
   - Methodological choices that repeat across papers (likely a stable heuristic)
   - Non-obvious parameter choices or preprocessing steps
   - Warnings or caveats that appear in multiple works
   - Techniques the author consistently avoids (and why)

4. **Classify each pattern.** Map each extracted insight to one of the three memory types:
   - **Procedural** — IF-THEN rules for research decisions (subtypes: `tie`, `no-change`, `constraint-failure`, `operator-fail`)
   - **Semantic** — Facts that LLMs don't reliably know (subtypes: `frontier`, `non-public`, `correction`)
   - **Episodic** — Concrete research episodes with transferable lessons (subtypes: `failure`, `adaptation`, `anomalous`)

5. **Write the skill.** Use the standard ResearchSkills YAML+markdown template (see [Skill Schema Design](superpowers/specs/2026-04-11-skill-schema-design.md) for the full specification).

## Prompt Template

Copy-paste the following prompt into Claude Code, Codex, or ChatGPT. Replace the placeholder paper list with actual arXiv IDs or URLs.

````
I want to distill reusable research skills from published papers. Analyze the following papers and extract the implicit expertise embedded in them — the tacit decisions, methodological heuristics, and domain knowledge that a reader would need years of experience to notice.

## Papers to analyze

- arXiv:XXXX.XXXXX (replace with actual ID or URL)
- arXiv:YYYY.YYYYY
- arXiv:ZZZZ.ZZZZZ

## Instructions

1. Read each paper thoroughly. Focus on the methods, experimental setup, and any supplementary material.

2. For each paper, identify:
   - **Non-obvious methodological choices**: What did the authors choose that a naive researcher would not? Why?
   - **Rejected alternatives**: What approaches were available but explicitly or implicitly avoided?
   - **Hidden failure modes**: What pitfalls does the paper warn about or hint at?
   - **Domain heuristics**: What parameter choices, preprocessing steps, or evaluation practices reflect deep domain knowledge?
   - **Recurring patterns**: What techniques or principles appear across multiple papers by these authors?

3. For each extracted insight, classify it as one of:
   - **Procedural** (`tie` / `no-change` / `constraint-failure` / `operator-fail`) — a decision rule for research impasses
   - **Semantic** (`frontier` / `non-public` / `correction`) — a fact LLMs don't reliably know
   - **Episodic** (`failure` / `adaptation` / `anomalous`) — a concrete episode with a transferable lesson

4. Output each skill in this YAML+markdown format, separated by `===`:

```
---
name: short-kebab-case-name
memory_type: procedural | semantic | episodic
subtype: tie | no-change | constraint-failure | operator-fail | frontier | non-public | correction | failure | adaptation | anomalous
domain: computer-science
subdomain: machine-learning
tags: [tag1, tag2, tag3]
source_papers:
  - arXiv:XXXX.XXXXX
---

## When
[Trigger condition — when should an AI agent retrieve this skill?]

## Decision
[What to do and what NOT to do, with reasoning.]

## Why
[The underlying insight — why does this work or matter?]

## Local Verifiers
[How to check that this skill was applied correctly.]

## Anti-exemplars
[When NOT to use this skill.]
===
```

## Rules

- **Be specific.** "IF loss plateaus THEN try X" is weak. "IF loss plateaus after warmup when training >1B parameter Transformers with Adam THEN try X because Y" is strong.
- **Prioritize non-obvious insights.** Skip anything a frontier LLM would already know from textbook knowledge.
- **Preserve scientific accuracy.** Do not hallucinate claims the papers don't support.
- **De-identify.** Remove private file paths, usernames, or internal URLs. Keep scientific content (materials, parameters, methods, model names).
- **Dead ends are valuable.** Failed approaches and rejected alternatives are often the highest-value skills.
````

## Ethics

- **Public papers only.** This process should only be applied to publicly available, peer-reviewed or pre-print papers. Do not distill from confidential manuscripts, unpublished drafts shared in confidence, or papers behind paywalls that you do not have legitimate access to.
- **General insights, not proprietary details.** The extracted skills should capture general methodological insights — the kind of knowledge that advances a field. Do not extract proprietary datasets, confidential experimental configurations, or trade secrets.
- **Attribution.** Always include `source_papers` in the skill metadata to credit the original authors. The goal is to amplify their expertise, not to obscure its origin.
- **Respect author intent.** If a paper includes restrictions on reuse or derivative works, respect those terms.

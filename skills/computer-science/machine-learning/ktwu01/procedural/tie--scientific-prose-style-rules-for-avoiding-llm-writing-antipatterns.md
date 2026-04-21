---
name: "Scientific prose style rules for avoiding LLM writing antipatterns"
memory_type: procedural
subtype: tie
domain: computer-science
subdomain: machine-learning
contributor: ktwu01
source:
  type: literature
  ref: "yzhao062/agent-style; Strunk & White; Orwell 'Politics and the English Language'; Gopen & Swan 1990"
extracted_at: 2026-04-20
---

## Situation
An AI agent is writing or editing scientific prose (paper sections, technical reports, review articles) and must avoid characteristic LLM output patterns that reduce credibility and readability.

## Procedure

### Structure
- Do NOT use bullet lists in running prose. Convert lists into flowing paragraphs with explicit logical connectives.
- Do NOT start consecutive sentences with the same word or syntactic pattern.
- Do NOT use inline mini-headings (e.g., "**Key insight:**") inside a paragraph.

### Word Choice
- Do NOT use vague intensifiers: "significantly", "notably", "importantly", "interestingly" without quantitative backing.
- Do NOT use hedging fillers: "it is worth noting that", "it should be mentioned that" — just state the fact.
- Do NOT use LLM-signature words: "leverage", "utilize", "facilitate", "cutting-edge", "state-of-the-art" (unless citing a specific benchmark), "delve", "crucial", "paramount".
- Do NOT use em-dashes (—) as sentence connectors in formal prose; prefer semicolons, periods, or subordinate clauses.

### Claims and Evidence
- Do NOT make factual claims without a citation or direct experimental evidence. Every assertion of superiority, novelty, or importance must point to data.
- Do NOT write "as shown in Table X" without verifying the table actually supports the specific claim.
- Do NOT use "outperforms" or "superior to" without specifying the metric, dataset, and margin.

### Conciseness
- Do NOT pad sentences with unnecessary relative clauses. "The method that we propose" → "Our method".
- Do NOT repeat the same information in both the introduction and the abstract with trivially different wording.
- Do NOT add a summary paragraph at the end of each section that merely restates what was just said.

### Honesty of Tone
- Do NOT overstate contributions. If the improvement is 0.3%, say so plainly — do not frame it as "substantial".
- Do NOT use passive voice to obscure agency when the agent matters. "The experiment was conducted" → "We ran the experiment".
- Do NOT use "we believe" or "we feel" in place of evidence-backed claims.

## Retrieval Cues
- Drafting or editing any section of a research paper.
- Reviewing AI-generated prose for publication readiness.
- Polishing text to remove LLM-signature phrasing.
- Ensuring claims are properly grounded in evidence.

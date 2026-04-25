---
name: "Soft-Hallucination Example Mining From Near-Miss Object Pairs"
memory_type: episodic
subtype: adaptation
domain: computer-science
subdomain: computer-vision-and-pattern-recognition
contributor: xisen-w
source:
  type: session
  session_id: 019c0c69-acff-79a0-be36-a313732469e2
extracted_at: 2026-04-24
---

## Situation
A rebuttal analysis needed stronger qualitative examples beyond aggregate scores, and exact-match object checks were not surfacing the most persuasive cases.

## Action
Inspect question-level traces for cases where the predicted object was not an exact match to ground truth but was semantically close, then pair those with a similarity signal and scene-object list context.

## Outcome
A concrete near-miss case emerged: ground truth `chair` versus prediction `armchair`, with a relatively high similarity score. This turned out to be a better example of "soft hallucination" than binary right/wrong examples because it showed semantic drift rather than total failure.

## Lesson
For soft-hallucination studies, example selection should target semantically adjacent substitutions, not only obvious errors. Near-miss object pairs can expose the phenomenon more clearly than strict accuracy breakdowns.

## Retrieval Cues
Use when:
- You need stronger rebuttal examples from a human-alignment or hallucination study.
- Exact-match error mining is producing weak or unrepresentative examples.
- The claim concerns semantic slippage rather than outright fabrication.


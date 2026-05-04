---
name: convergent-wrong-distractor-signals-shared-benchmark-structure
memory_type: episodic
subtype: anomalous
domain: computer-science
subdomain: artificial-intelligence
contributor: Clarence-ZheWang
source:
  type: session
  session_id: 9871c981-7ba7-47a4-9d73-39c989a959c8
extracted_at: 2026-04-24
---

## Situation
During post-hoc analysis, several benchmark items showed four or more models choosing the same incorrect option rather than failing in different ways.

## Action
Those items were isolated as a separate class of “collective error” questions and reviewed for what the shared wrong distractor was capturing.

## Outcome
The analysis shifted from model-by-model blame to item-level interpretation. Convergent errors became a signal of benchmark structure: ambiguous distractors, common conceptual traps, or a shared limitation in how current models parse that management concept.

## Lesson
When many models converge on the same wrong option, treat it as a methodological finding, not just another incorrect response. Shared distractor attraction often reveals more about the benchmark item or the conceptual fault line than about any single model.

## Retrieval Cues
Use when benchmarking multiple models on the same multiple-choice set and a wrong option attracts a cluster of models instead of random dispersion.


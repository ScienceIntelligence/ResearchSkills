---
name: benchmark-prompt-must-strip-gold-answers
memory_type: episodic
subtype: adaptation
domain: computer-science
subdomain: artificial-intelligence
contributor: Clarence-ZheWang
source:
  type: session
  session_id: 9871c981-7ba7-47a4-9d73-39c989a959c8
extracted_at: 2026-04-24
---

## Situation
A benchmark dataset contained both the question text and the gold answers in the same JSON source, raising the risk that the evaluated model would see the answer key.

## Action
The evaluation was audited at prompt-construction time, and only the question stem plus options were sent to the model. The gold answer field stayed in the dataset for scoring only.

## Outcome
The benchmark could use a labeled dataset without contaminating model inputs, resolving the core validity threat without needing a second unlabeled copy of the corpus.

## Lesson
In LLM benchmarking, answer leakage is prevented at the model-facing prompt boundary, not necessarily by deleting labels from the stored dataset. The methodological invariant is: labels may exist in storage, but must never cross into the prompt.

## Retrieval Cues
Use when a benchmark corpus includes answers, rationales, or annotations in the same file as prompts, especially for multiple-choice evaluation.


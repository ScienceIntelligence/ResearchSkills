---
name: "Human Score Is a Separate Target, Not Human Accuracy"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: computer-vision-and-pattern-recognition
contributor: xisen-w
source:
  type: session
  session_id: 019a69ca-a7ed-75c1-ba03-98f3a8fbd36f
extracted_at: 2026-04-24
---

## Fact
When humans are the reference standard, their responses should be summarized as a `human-score` on a graded scale (here: `Yes=1`, `Maybe=0.5`, `No=0`) rather than treated as being accurate or inaccurate relative to the key.

## Evidence
The session repeatedly corrected an earlier interpretation where human responses were being discussed in terms of "hard accuracy." The final methodological distinction was: hard score is the fixed binary baseline for the hypothetical always-affirmative model output, while human score is an independent graded summary of annotator tolerance and must not be defined against ground truth correctness.

## LLM Default Belief
A model often collapses all evaluation signals into accuracy against ground truth, including human judgments, because supervised evaluation setups usually frame annotators as noisy labels rather than the target notion of alignment.

## Expiry Signal
Expire this if the study objective changes from human-alignment to label-recovery, or if annotators are explicitly being audited against a gold standard instead of used as the criterion.


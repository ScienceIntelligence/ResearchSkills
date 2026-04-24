---
name: "Condition Module Can Corrupt Ranking Evaluation Indirectly"
memory_type: episodic
subtype: anomalous
domain: quantitative-biology
subdomain: other-quantitative-biology
contributor: hzzzzzhappy
---
## Situation
A conditional modeling component was suspected of affecting MRR logic after hypergraph or condition-based representation learning was enabled.

## Action
The correct diagnostic was not to assume the MRR formula changed, but to trace whether enabling the condition module changed score tensors, candidate grouping, or which entity pairs entered the ranking evaluation.

## Outcome
The important research lesson was that a representation module can indirectly alter ranking metrics even when the metric function itself is unchanged.

## Lesson
When ranking metrics shift after enabling a representation module, separate “metric-code corruption” from “score-distribution or candidate-set shift.”

## Retrieval Cues
- “MRR logic affected after condition”
- “hypergraph enabled and MRR changed”
- “AUROC/AUPRC okay but ranking strange”

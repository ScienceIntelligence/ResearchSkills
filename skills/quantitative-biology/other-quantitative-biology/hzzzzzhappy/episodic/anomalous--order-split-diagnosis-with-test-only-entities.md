---
name: "Order Split Diagnosis With Test Only Entities"
memory_type: episodic
subtype: anomalous
domain: quantitative-biology
subdomain: other-quantitative-biology
contributor: hzzzzzhappy
---
## Situation
An order-based split used a threshold around 5, placing lower-order samples in training and higher-order samples in evaluation, with a held-out validation/test ratio. The split also exposed test-only drugs and diseases.

## Action
The important analysis was to treat test-only drugs and diseases as a feature-visibility and cold-start issue, not merely as a sample-count issue.

## Outcome
The split was not just an order generalization benchmark; it also introduced entity visibility shift.

## Lesson
When evaluating OOD-order generalization, always report or inspect test-only entity counts, because cold-start entities can confound conclusions about order generalization.

## Retrieval Cues
- “order threshold 5”
- “test-only drugs”
- “test-only diseases”
- “feature visibility”

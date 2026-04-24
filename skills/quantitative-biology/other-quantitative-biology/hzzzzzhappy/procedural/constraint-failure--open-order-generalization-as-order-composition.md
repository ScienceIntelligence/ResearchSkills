---
name: "Open Order Generalization As Order Composition"
memory_type: procedural
subtype: constraint-failure
domain: quantitative-biology
subdomain: other-quantitative-biology
contributor: hzzzzzhappy
---
## When + Exclusions
When modeling variable-cardinality combination prediction where training data contain mostly low-order combinations but test-time inputs may have unseen higher orders.

Exclude cases where all train/test orders are fixed or where the task is ordinary pairwise link prediction.

## Decision
Preferred: treat an unseen order-$k$ decision as a composition of lower-order experts rather than training a separate high-order expert directly.

Rejected: directly learning one expert per order without enough high-order supervision.

Reasoning: high-order combinations are sparse, so an order-specific expert for rare or unseen orders does not generalize reliably. Decomposing a target order into available lower-order expert decisions gives a structured inductive bias for OOD-order generalization.

## Local Verifiers
- Performance gap increases specifically on higher-order test splits.
- Low-order results remain strong while high-order MRR or recall@K drops.
- High-order train samples are much rarer than low-order samples.
- Direct order-specific heads overfit seen orders but fail on unseen orders.

## Failure Handling
If decomposition performs poorly, inspect whether the available lower-order set $\mathcal A$ can actually cover the target order with small overshoot. If not, revise the admissible decomposition rule or add auxiliary lower-order supervision.

## Anti-exemplars
- Pairwise-only drug--disease prediction.
- A dataset where every test order is well represented during training.
- Failures caused by implementation bugs rather than order sparsity.

---
name: "Lexicographic Order Decomposition For Unseen K"
memory_type: procedural
subtype: tie
domain: quantitative-biology
subdomain: other-quantitative-biology
contributor: hzzzzzhappy
---
## When + Exclusions
When multiple lower-order expert combinations can approximate the same unseen order $k$, and the model needs a deterministic rule for selecting which experts to compose.

Exclude cases where only one decomposition is possible.

## Decision
Preferred: use a lexicographic selection rule that first minimizes the number of composed experts, then minimizes overshoot beyond $k$, then prefers larger available expert orders.

Rejected: arbitrary decomposition or random lower-order expert selection.

Reasoning: fewer experts reduce composition noise; smaller overshoot keeps the composed decision close to the target order; preferring larger expert orders preserves more high-order interaction information when available.

## Local Verifiers
- For target order 8, the selected expert multiset should be explainable from available expert orders rather than random.
- The decomposition should return both the selected expert orders and their counts.
- The rule should be stable across runs for the same $\mathcal A$ and $k$.

## Failure Handling
If the decomposition looks unintuitive, explicitly check the ordering of the lexicographic criteria. A common mistake is minimizing overshoot before minimizing the number of experts, which may create unnecessarily fragmented compositions.

## Anti-exemplars
- Choosing the numerically closest single expert even when it is below $k$ and cannot represent the full target order.
- Using all lower-order experts equally.
- Treating lexicographic order as a cosmetic notation rather than a real decision rule.

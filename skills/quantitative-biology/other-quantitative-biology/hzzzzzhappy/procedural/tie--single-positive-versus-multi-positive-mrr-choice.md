---
name: "Single Positive Versus Multi Positive Mrr Choice"
memory_type: procedural
subtype: tie
domain: quantitative-biology
subdomain: other-quantitative-biology
contributor: hzzzzzhappy
---
## When + Exclusions
When deciding between MRR variants: one that considers only the first positive item per query and one that handles multiple positives within a query.

Exclude tasks where every query truly has exactly one positive label.

## Decision
Preferred: use the multi-positive-aware ranking definition when a query can have multiple valid drug combinations or adverse outcomes.

Rejected: switching to first-positive-only MRR only because it increases the score.

Reasoning: first-positive-only MRR can be defensible for single-answer retrieval, but combination prediction often has multiple valid positives per query. Using a single-positive metric can distort the scientific interpretation.

## Local Verifiers
- For each query, compute the number of positive candidates.
- If many queries have more than one positive, document the multi-positive metric.
- Compare MRR with recall@K to detect whether the top-ranked positive appears early but other positives are poorly ranked.

## Failure Handling
If reviewers question low MRR, explain the metric’s stricter query-wise ranking nature rather than altering it post hoc. Provide recall@K or hit@K as complementary metrics.

## Anti-exemplars
- Calling a query “single-positive” when the dataset has multiple positive labels.
- Replacing MRR after seeing unfavorable results.
- Mixing MRR definitions across baselines.

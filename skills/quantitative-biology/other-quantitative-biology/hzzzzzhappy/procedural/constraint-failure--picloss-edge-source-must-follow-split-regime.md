---
name: "Picloss Edge Source Must Follow Split Regime"
memory_type: procedural
subtype: constraint-failure
domain: quantitative-biology
subdomain: other-quantitative-biology
contributor: hzzzzzhappy
---
## When + Exclusions
When using a pairwise interaction loss such as PICLoss under different split regimes, especially split-by-disease and full-fit settings.

Exclude experiments where the pairwise loss is not used.

## Decision
Preferred: choose the edge source according to the split regime. For split-by-disease and full-fit, use the training relation edge index based on the relevant label union rather than a global edge set.

Rejected: always using the global drug--disease edge set.

Reasoning: the wrong edge source can create inconsistent supervision and may leak or omit pairs depending on the split logic.

## Local Verifiers
- Check whether the split flag is `split_by_disease` or `full_fit`.
- Confirm PICLoss receives the train relation edge index in those regimes.
- Verify prediction export still distinguishes open-label pairs separately.

## Failure Handling
If results look inflated or inconsistent across split modes, audit the edge index passed to the pairwise loss before changing model architecture.

## Anti-exemplars
- Using the same global edge source across all split regimes.
- Treating full-fit as identical to random split.
- Mixing open-label annotation with supervised training labels.

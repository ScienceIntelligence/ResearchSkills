---
name: "Leave One Out Contextualization For Combination Entity Conditioning"
memory_type: procedural
subtype: operator-fail
domain: quantitative-biology
subdomain: other-quantitative-biology
contributor: hzzzzzhappy
---
## When + Exclusions
When representing each entity inside a variable-size combination conditioned on the remaining entities and a target disease or outcome.

Exclude models that only pool all entities once and never compute entity-specific contextual states.

## Decision
Preferred: for each entity in the combination, construct a leave-one-out contextual representation using the remaining entities together with the target, then combine it with the held-out entity-target interaction.

Rejected: a single undifferentiated pooled combination vector for all entities.

Reasoning: a drug’s contribution depends on which other drugs are present and on the target disease; leave-one-out conditioning makes this dependency explicit.

## Local Verifiers
- Each entity has its own contextualized representation.
- The held-out entity is not included in its own context set.
- The target entity participates before or during contextualization, not only at the final classifier.

## Failure Handling
If the model behaves like simple pooling, inspect whether the leave-one-out mask is actually applied and whether target conditioning happens before aggregation.

## Anti-exemplars
- Mean-pooling all drugs and concatenating the disease at the end.
- Conditioning only the whole combination but not individual entities.
- Treating all drug positions symmetrically without entity-specific context.

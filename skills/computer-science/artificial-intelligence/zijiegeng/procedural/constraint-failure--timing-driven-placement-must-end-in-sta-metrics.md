---
name: "Timing Driven Placement Must End In Sta Metrics"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When evaluating a learning-based or differentiable timing-driven placement method that claims timing improvement.

Exclude cases where the work is only about wirelength, routability, or synthetic proxy optimization with no timing claim.

## Decision
Preferred: verify improvements using signoff-style timing metrics after placement/legalization, especially WNS and TNS, not only surrogate loss or differentiable timing proxy.

Rejected: treating lower surrogate loss as sufficient evidence of better timing.  
Rejected: reporting only HPWL/congestion when the paper's claimed contribution is timing-driven placement.

Reasoning: a timing surrogate can supply useful gradients during optimization, but the scientific claim is about timing closure. The final evidence must therefore be measured in timing-space, not only proxy-space.

## Local Verifiers
- WNS improves on the same benchmark split.
- TNS improves consistently, not only on one design.
- The timing trend survives placement legalization.
- The method is compared against a strong timing-aware placer or timing-driven baseline, not only a wirelength baseline.

## Failure Handling
If surrogate loss improves but WNS/TNS do not, inspect whether the surrogate captures path-level topological dependencies rather than only local geometric features.

If timing improves only before legalization, separate pre-legalization and post-legalization results.

## Anti-exemplars
- “Our learned timing score decreases, therefore timing improves.”
- “HPWL decreases, therefore timing is better.”
- “The differentiable timing objective is optimized, so STA is unnecessary.”

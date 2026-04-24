---
name: "Ai Eda Paper Claims Need Proxy To Signoff Causal Chain"
memory_type: procedural
subtype: tie
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When an AI/EDA paper optimizes a proxy objective but claims downstream design-quality improvement.

Exclude papers that explicitly claim only proxy prediction accuracy.

## Decision
Preferred: present the full causal chain: learned proxy improves optimization behavior, optimization changes placement/routing, and signoff-relevant metrics improve.

Rejected: stopping at proxy prediction accuracy.  
Rejected: stopping at intermediate physical-design metrics if the claim is timing/power/congestion closure.

Reasoning: AI/EDA papers are often rejected when the learned component is good but the design-flow outcome is unproven.

## Local Verifiers
- Proxy prediction quality.
- Optimization impact using the proxy.
- Final design metrics.
- Baselines with and without the learned component.
- Runtime overhead.

## Failure Handling
If final metrics do not improve, retain the proxy as an analysis tool but remove downstream improvement claims.

If final metrics improve without proxy accuracy, investigate whether the proxy is acting as a regularizer or heuristic rather than a faithful predictor.

## Anti-exemplars
- “Our surrogate has low MSE, so placement quality improves.”
- “The model predicts congestion, therefore routing will be better.”

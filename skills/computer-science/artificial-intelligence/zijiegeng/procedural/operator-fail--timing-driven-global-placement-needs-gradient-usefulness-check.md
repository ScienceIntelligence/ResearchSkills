---
name: "Timing Driven Global Placement Needs Gradient Usefulness Check"
memory_type: procedural
subtype: operator-fail
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When a learned timing surrogate is used to provide gradients during global placement.

Exclude surrogates used only for post-hoc prediction or ranking.

## Decision
Preferred: evaluate whether gradients from the surrogate lead to better placements, not only whether the surrogate predicts timing accurately.

Rejected: assuming predictive accuracy implies useful gradients.  
Rejected: measuring only correlation with timing metrics.

Reasoning: a surrogate can predict well but have gradients that point in unhelpful directions for placement optimization.

## Local Verifiers
- Placement improves when surrogate gradients are enabled.
- Gradient ablation is included.
- Step-wise optimization does not damage density or wirelength.
- Timing gains remain after legalization.

## Failure Handling
If gradients destabilize placement, reduce weighting, add schedule annealing, or constrain gradient application to timing-critical components.

If gradients improve timing but harm wirelength/congestion, report Pareto tradeoffs.

## Anti-exemplars
- A timing predictor is inserted into placement with no gradient ablation.
- Only prediction MSE is reported for a gradient-based placement contribution.

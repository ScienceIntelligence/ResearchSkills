---
name: "Timing Surrogates Need Path Topology Not Just Geometry"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When reviewing or designing a learned timing surrogate for global placement, especially one based on geometric cell/pin features or layout-local graph features.

Exclude pure congestion or density surrogates where timing is not the target.

## Decision
Preferred: check whether the surrogate represents topological timing paths and long-range dependencies among cells, nets, and critical paths.

Rejected: assuming geometric proximity is enough to predict timing.  
Rejected: evaluating timing prediction only at the cell/net-local level.

Reasoning: timing is path-structured. A local spatial representation can look plausible while missing non-local path dependencies that dominate WNS/TNS.

## Local Verifiers
- Critical-path membership or path-level aggregation is represented.
- The surrogate distinguishes geometrically similar placements with different topological timing behavior.
- Evaluation includes WNS/TNS correlation, not only per-net or per-cell prediction error.
- Ablations remove topological features and show degradation.

## Failure Handling
If prediction error is low but timing optimization fails, test whether the model predicts average timing well while failing on worst paths.

If the surrogate is differentiable but not useful, inspect gradient alignment with true timing-improving perturbations.

## Anti-exemplars
- A GNN over layout adjacency only, with no timing-path structure, claiming timing closure.
- Reporting MSE on slack prediction without checking critical-path ranking.

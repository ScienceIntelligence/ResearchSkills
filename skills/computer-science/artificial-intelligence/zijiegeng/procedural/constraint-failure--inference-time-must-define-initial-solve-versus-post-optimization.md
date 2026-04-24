---
name: "Inference Time Must Define Initial Solve Versus Post Optimization"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When reporting inference time for a method that produces an initial solution and then performs refinement, search, repair, optimization, or solver-assisted polishing.

Exclude pure feed-forward models with no post-processing.

## Decision
Preferred: split runtime into initial model inference and downstream optimization/refinement time.

Rejected: reporting only model forward time if the final answer depends on later optimization.  
Rejected: reporting end-to-end time without clarifying the components.

Reasoning: reviewers will interpret “inference time” differently unless the boundary is explicitly defined.

## Local Verifiers
- Model-only runtime is reported.
- Post-optimization runtime is reported.
- End-to-end runtime is reported.
- Comparison baselines use the same runtime boundary.

## Failure Handling
If old experiments logged only total time, state the definition clearly and avoid overclaiming speed.

If post-processing dominates runtime, reframe the method as solver-assisted rather than pure neural inference.

## Anti-exemplars
- “Inference takes 0.2s” when the final solution requires minutes of local search.
- Comparing model-only time against baseline end-to-end time.

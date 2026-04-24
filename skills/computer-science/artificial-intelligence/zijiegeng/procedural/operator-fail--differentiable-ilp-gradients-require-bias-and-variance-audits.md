---
name: "Differentiable Ilp Gradients Require Bias And Variance Audits"
memory_type: procedural
subtype: operator-fail
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When using differentiable relaxations, learned surrogates, or implicit-gradient estimators for ILP/MILP-like optimization.

Exclude purely heuristic methods that do not claim gradient correctness.

## Decision
Preferred: audit whether the gradient estimator is biased, high-variance, or misaligned with discrete objective improvement.

Rejected: treating differentiability as equivalent to useful optimization signal.  
Rejected: validating only final objective without checking gradient behavior.

Reasoning: in discrete optimization, the chosen relaxation may provide gradients that are smooth but scientifically misleading.

## Local Verifiers
- Compare gradient direction against finite-difference perturbations where possible.
- Measure objective improvement after small gradient steps.
- Test sensitivity near integer boundaries.
- Report variance across random seeds or stochastic relaxations.

## Failure Handling
If gradients are unstable, try straight-through, score-function, perturbation-based, or surrogate-ranking alternatives and report the tradeoff.

If gradients are smooth but ineffective, frame the method as heuristic guidance rather than differentiable optimization.

## Anti-exemplars
- “The ILP layer is differentiable, so end-to-end learning is solved.”
- Reporting only final solve quality while ignoring gradient diagnostics.

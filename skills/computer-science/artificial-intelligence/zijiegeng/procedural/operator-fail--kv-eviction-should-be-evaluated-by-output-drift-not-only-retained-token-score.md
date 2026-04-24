---
name: "Kv Eviction Should Be Evaluated By Output Drift Not Only Retained Token Score"
memory_type: procedural
subtype: operator-fail
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When a KV cache eviction method selects retained tokens using attention, salience, clustering, or projection scores.

Exclude full-cache baselines and methods that do not discard tokens.

## Decision
Preferred: evaluate whether the retained cache reconstructs or preserves the pre-eviction output behavior, not only whether selected tokens have high local salience.

Rejected: optimizing token scores without checking output drift.  
Rejected: reporting only downstream task accuracy when the mechanism claim is about preserving hidden/output states.

Reasoning: two token subsets can have similar salience scores but different effects on the output vector. The mechanistic claim needs an output-level verifier.

## Local Verifiers
- Post-eviction output vector error.
- Downstream benchmark accuracy under fixed cache budgets.
- Comparison to attention-only eviction.
- Sensitivity under very small cache budgets.

## Failure Handling
If downstream accuracy improves but output drift is high, inspect whether the benchmark is insensitive or whether the metric is layer/task-specific.

If output drift improves but task accuracy does not, check whether preserved directions are not task-relevant.

## Anti-exemplars
- “The selected tokens have high attention, so the output is preserved.”
- Evaluating only one cache budget and claiming general robustness.

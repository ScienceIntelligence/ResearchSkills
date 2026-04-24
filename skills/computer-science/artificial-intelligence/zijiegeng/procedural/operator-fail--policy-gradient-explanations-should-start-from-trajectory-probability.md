---
name: "Policy Gradient Explanations Should Start From Trajectory Probability"
memory_type: procedural
subtype: operator-fail
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When explaining policy gradient to technically strong researchers who remember the formula but want the derivation.

Exclude introductory explanations for nontechnical audiences.

## Decision
Preferred: derive from the trajectory objective and the log-derivative trick, then show why environment dynamics disappear from the gradient and why the score term becomes grad log pi times return or Q.

Rejected: starting with the memorized formula without derivation.  
Rejected: handwaving “log pi appears because of likelihood.”

Reasoning: the non-obvious part is not the final formula; it is the transformation from trajectory probability to an expectation over policy score functions.

## Local Verifiers
- Objective is written over trajectories.
- The log-derivative identity is shown.
- Environment transition terms are shown to have zero gradient with respect to policy parameters.
- The transition from full return to state-action value is justified.

## Failure Handling
If the audience gets stuck at the single-step expectation form, expand the summation over time and condition on state-action pairs.

If variance reduction comes up, introduce baselines only after the unbiased gradient is clear.

## Anti-exemplars
- “Policy gradient is E[grad log pi times Q]” with no derivation.
- Introducing PPO before explaining the basic score-function estimator.

---
name: "Grpo Should Be Framed As Relative Advantage Without A Critic"
memory_type: procedural
subtype: tie
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When explaining GRPO-like methods to an RL-aware audience.

Exclude settings where a learned value function is central to the method.

## Decision
Preferred: frame GRPO as estimating relative advantages within a group of sampled responses for the same prompt, often avoiding a separate critic.

Rejected: explaining it as merely “PPO for LLMs.”  
Rejected: ignoring group normalization and the absence or reduced role of a value model.

Reasoning: the practical distinction is not only the clipping objective; it is how advantage is obtained and normalized in a group of candidate completions.

## Local Verifiers
- Multiple completions per prompt are sampled.
- Rewards are normalized within the group.
- No separate critic is required, or its role is reduced.
- KL/reference regularization is still tracked.

## Failure Handling
If group rewards have low variance, increase sample diversity or improve reward sensitivity.

If normalized advantages become noisy, increase group size or stabilize reward scaling.

## Anti-exemplars
- “GRPO is PPO but cheaper,” without explaining the group-relative estimator.
- Comparing GRPO and PPO while changing reward model and data simultaneously.

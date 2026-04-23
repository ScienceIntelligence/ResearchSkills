---
name: "Grpo Numerical Stability Kl Divergence"
memory_type: procedural
subtype: operator-fail
domain: computer-science
subdomain: artificial-intelligence
contributor: ergan-shang
---
## When
Implementing Group Relative Policy Optimization (GRPO) for LLM fine-tuning; specifically when the KL-divergence term causes loss spikes or $NaN$ values during the policy update step.

## Decision
Prioritize the log-space calculation of the KL term: $KL = \exp(\log \pi_{old} - \log \pi_{new}) + (\log \pi_{new} - \log \pi_{old}) - 1$ instead of direct probability ratios. 
**Rejected:** Simple gradient clipping at the global level. While it prevents crashes, it masks the underlying numerical instability of the relative probability shift between the reference and active policy.

## Local Verifiers
- Log-probability differences $(\log p_{ref} - \log p_{theta})$ exceeding $\pm 10.0$ before exponential.
- Advantage normalization resulting in zero-variance groups (returns are identical across the group).

## Failure Handling
If $NaN$ persists, verify that the advantage normalization includes a small epsilon ($\epsilon = 1e-8$) in the denominator and check for sequence length mismatches in the group-wise mean calculation.

## Anti-exemplars
- Standard PPO implementations where clipping handles the ratio; GRPO's group-relative nature makes it more sensitive to outliers within the sampled group.

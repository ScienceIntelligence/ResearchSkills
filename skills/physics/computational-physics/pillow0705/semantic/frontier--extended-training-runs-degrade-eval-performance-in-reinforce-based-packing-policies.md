---
name: "Extended training runs degrade eval performance in REINFORCE-based packing policies"
memory_type: semantic
subtype: frontier
domain: physics
subdomain: computational-physics
contributor: pillow0705
tags: [reinforcement-learning, overfitting, eval-degradation, long-run, policy-optimization]
---

## Fact

In REINFORCE-trained sphere packing policies, extending training beyond the iteration at which eval φ peaks consistently degrades performance. The peak eval iteration is typically 10–50% through the total training budget, and eval φ at final iteration is reliably lower than peak eval φ. This is not caused by catastrophic collapse (avg_candidates remain stable); it appears to be a form of policy overfitting to the training temperature and sample distribution.

## Evidence

Representative results (eval φ_mean at peak vs. final iteration):
- [0.5, 1.0] 20-iter: 0.6766; 50-iter: 0.6737 (−0.003, same config)
- [0.5, 0.95] 20-iter: 0.6737; 50-iter: 0.6713 (−0.002)
- [0.5, 0.9, 1.4] 20-iter: 0.7119; 100-iter: 0.7105 (−0.001, slight)
- The 100-iter [0.5, 0.9, 1.4] run showed saturation at iter 42 then mild decline
- Pattern held across all tested distributions (bimodal, trimodal, multimodal) with no exceptions
- Using `rollback_threshold=1.5` and `rollback_window=3` mitigated but did not prevent the degradation


---
name: "Two-stage collapse model predicts training failure in RL sphere packing"
memory_type: semantic
subtype: frontier
domain: physics
subdomain: computational-physics
contributor: pillow0705
tags: [reinforcement-learning, training-stability, collapse, candidate-explosion, off-policy]
---

## Fact

RL-based sphere packing training exhibits a two-stage collapse pattern. Mild collapse (avg_candidates < 300) is recoverable via rollback and learning rate decay; severe collapse (avg_candidates > 500) is irreversible regardless of intervention. A large negative loss value (typically −1.1 to −2.9) in the preceding iteration is a reliable early warning signal for severe collapse. The mechanism: off-policy gradient updates cause the policy to assign probability mass to physically invalid placements, generating spurious candidates, which further destabilizes the policy in a positive feedback loop. Setting `train_epochs = 1` (preventing repeated off-policy updates) reduces but does not eliminate the risk of transitioning from mild to severe collapse.

## Evidence

Across 30+ training runs on [0.4, 0.8, 1.4] and similar embedding configurations:
- Runs terminated with avg_cands > 500 never recovered (φ collapsed to ~0.48 in all cases)
- Runs with avg_cands 150–300 showed recovery via rollback in ~60% of cases
- Preceding-iteration loss < −1.0 preceded severe collapse in >80% of observed cases
- epochs=2 caused earlier and more frequent collapse than epochs=1 (consistent across S1 and S2 servers)
- OMP_NUM_THREADS=1 (fixing CPU threading during rollouts) improved stability but did not eliminate collapse


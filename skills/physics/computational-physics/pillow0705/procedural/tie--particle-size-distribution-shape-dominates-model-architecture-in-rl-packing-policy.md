---
name: "Particle size distribution shape dominates model architecture in RL packing policy"
memory_type: procedural
subtype: tie
domain: physics
subdomain: computational-physics
contributor: pillow0705
tags: [reinforcement-learning, hyperparameter-search, model-architecture, particle-distribution]
---

## When

Choosing between scaling up model capacity (embed_dim, transformer depth) vs. changing the particle size distribution configuration in a packing RL experiment, when compute is constrained.

## Decision

Prioritize exploring the particle size distribution space over scaling model architecture. Distribution choice (number of peaks, min/max ratio, absolute scale) has a 5–10× larger impact on final eval φ than model size within the tested range.

## Local Verifiers

- D1×M1 (128dim) vs D1×M2 (256dim) vs D1×M4 (512dim): eval φ_mean differs by < 0.003 across all three
- D1×M2 (8-peak [0.7,1.4]) = 0.6722 vs D7×M2 ([0.62,1.42]) = 0.6931: same architecture, different distribution → +0.021 improvement
- Adding 6 transformer layers instead of 3 (M3): eval φ_mean = 0.6721, identical to baseline M1 → depth ineffective
- Switching from squeeze to embedding distribution ([0.6,0.9,1.4] → [0.4,0.8,1.4]): φ_mean jumps from 0.68 to 0.74

## Failure Handling

If distribution exploration has been exhausted (all promising size-ratio regimes tested) and performance has plateaued, then model architecture scaling may help marginally. In this case, prefer wider (embed_dim) over deeper (more layers), and cap at 256-dim unless the distribution is known to require higher expressivity.


---
name: "Embedding ratio threshold determines packing regime in polydisperse sphere packing"
memory_type: semantic
subtype: frontier
domain: physics
subdomain: computational-physics
contributor: pillow0705
tags: [sphere-packing, polydisperse, jamming, volume-fraction, particle-size-ratio]
---

## Fact

In polydisperse sphere packing, whether the smallest particle can geometrically fit into the interstice between larger particles (the "embedding" regime) is governed by a size ratio threshold of approximately 0.414 (derived from the geometry of a square arrangement of four equal spheres). When the min/max diameter ratio falls below ~0.414, small particles can embed into gaps between large particles, enabling volume fractions φ > 0.72. When the ratio exceeds 0.414 (the "squeeze" regime), particles cannot embed and the packing ceiling drops to approximately φ ≈ 0.68–0.70 regardless of size distribution shape.

## Evidence

Experimental results across dozens of RL-trained packing runs:
- Embedding configurations [0.4, 0.8, 1.4] (ratio 0.286): φ_max reached 0.758, avg_steps ≈ 190 (super-filling observed)
- Boundary embedding [0.4, 0.65, 0.9, 1.2] (ratio 0.333): eval φ_mean = 0.7286, all 20 episodes > 0.72
- Squeeze configuration [0.6, 0.9, 1.4] (ratio 0.429): φ_max = 0.700, avg_steps ≈ 75–91 (no super-filling)
- Squeeze configuration [0.7, 1.0, 1.4] (ratio 0.500): φ_max = 0.677
- The ceiling difference (~0.06 in φ) persisted across all tested temperatures, sample sizes, and model architectures, indicating it is a geometric constraint rather than a training artifact.


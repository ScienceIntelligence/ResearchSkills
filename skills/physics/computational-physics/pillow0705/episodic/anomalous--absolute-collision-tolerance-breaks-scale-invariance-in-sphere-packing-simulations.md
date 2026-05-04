---
name: "Absolute collision tolerance breaks scale invariance in sphere packing simulations"
memory_type: episodic
subtype: anomalous
domain: physics
subdomain: computational-physics
contributor: pillow0705
tags: [sphere-packing, simulation, artifact, collision-detection, scale-invariance]
---

## Situation

During a systematic study of absolute particle size effects on packing density (using fixed size ratio 0.500 but varying absolute scale: [0.3, 0.6], [0.4, 0.8], [0.5, 1.0], [0.55, 1.1], [0.6, 1.2]), smaller-scale configurations consistently achieved higher measured volume fractions. The [0.3, 0.6] system yielded eval φ_mean = 0.7114, compared to φ_mean = 0.6766 for [0.5, 1.0] at the same size ratio.

## Action

Initially interpreted the results as evidence that smaller absolute particle sizes yield denser packings — a physically unexpected finding, since sphere packing density should be scale-invariant. Launched a 200-iteration long run on [0.3, 0.6] based on this hypothesis.

## Outcome

The apparent advantage was entirely a simulation artifact: `collision_tol = 0.05` and `edge_tol = 0.05` were set as absolute distances. For small particles ([0.3, 0.6], mean diameter ~0.45), these tolerances permitted relative overlaps up to 11.1% of particle radius. For [0.5, 1.0] (mean diameter ~0.75), the same absolute tolerance allowed only 6.7% relative overlap. The artifact inflated φ in small-scale systems. The fix was converting to relative tolerance: `gap < -tol * r_sum`. All data from the scale-invariance experiments (loops 143–168) was invalidated. Only post-fix experiments are cross-scale comparable.

## Retrieval Cues

- Packing fraction improves with smaller absolute particle size (same ratio)
- Scale-invariance test shows unexpected size dependence
- Hard-coded tolerance values in collision detection code
- Comparing packing results across different size scales


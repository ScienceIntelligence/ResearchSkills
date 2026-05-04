---
name: "Three-sphere tangency generates physically valid candidates analytically in sequential packing"
memory_type: semantic
subtype: frontier
domain: physics
subdomain: computational-physics
contributor: pillow0705
tags: [sphere-packing, candidate-generation, tangency, contact-mechanics, sequential-decision]
---

## Fact

For sequential sphere packing framed as a reinforcement learning problem, candidate placement positions can be generated analytically using the three-sphere tangency condition: given three already-placed spheres A, B, C, a new sphere of known radius that is simultaneously tangent to all three has a closed-form center position (up to a two-fold ambiguity resolved by choosing the solution outside the existing cluster). This construction guarantees every candidate is contact-consistent by construction, eliminating the need for post-hoc collision rejection. Candidate set updates after each placement cost O(k²) where k is the coordination number of the newly placed sphere, rather than O(N) for re-checking all existing spheres.

## Evidence

The approach is implemented in the RL_for_particles project and validated empirically: avg_candidates stabilizes at 100–400 per step for well-trained policies on N=100 systems, consistent with the geometric branching factor of a close-packed structure. The candidate explosion phenomenon (avg_candidates > 500) that signals training collapse does not arise from the geometry but from the policy assigning probability to geometrically valid but physically undesirable locations, confirming that the candidate generator itself is sound.


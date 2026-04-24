---
name: "FTE/satellite reference frame: FTE advection dominates spacecraft motion"
memory_type: episodic
subtype: failure
domain: physics
subdomain: space-physics
contributor: KKEERB
source:
  type: session
  session_id: 019daae9-13f7-77e2-9cf3-941828253d83
extracted_at: 2026-04-24
tags: [space-physics, reference-frame, FTE, kinematics, magnetopause]
---

## Situation
The initial animation showed a satellite moving past a stationary FTE — mathematically equivalent for relative motion, but physically misleading. The user's intuition was that the FTE should be the thing moving, since FTEs advect rapidly along the magnetopause flanks.

## Action
Performed a read-only calculation from the project's FTE auto-tracking data:
- V300 tracking (265 segments): FTE centroid velocity median **154.8 km/s**, mean **187.6 km/s**, p10-p90 range **68.3–315.9 km/s**
- V800 tracking: median **187.3 km/s**, mean **217.4 km/s**, p10-p90 **60.0–415.7 km/s**
- Step 1220 event (ID=13, V300): ~2.41 RE displacement over 100 steps → ~164 km/s at v00=6810.695 km/s

Cross-referenced literature: Russell & Elphic (1978) note magnetopause motion can exceed spacecraft velocity; Sibeck/Russell reviews describe FTEs as rapidly translating along the magnetopause. Real spacecraft orbital velocities are ~km/s scale — two orders of magnitude smaller.

## Outcome
The reference frame was changed to a fixed probe sampling a moving FTE structure. The animation now shows the FTE propagating along the magnetopause past a stationary test spacecraft.

## Lesson
"Relative motion is relative" is mathematically true but **physically wrong** for FTE pedagogy. The FTE moves at ~100-400 km/s along the magnetopause while the spacecraft moves at ~km/s. Choosing the "satellite moves past stationary FTE" frame implies the wrong causal story — that the spacecraft is the active agent scanning a static structure — when in reality the FTE is a rapidly advecting transient that the spacecraft happens to sample. This matters for explaining why a satellite sees a brief bipolar Bn signature: it's the FTE's passage past the probe, not the probe's traversal through a stationary rope.

This generalizes: when one object's velocity exceeds the other's by >10×, the faster-moving object should be animated as the active agent in pedagogical visualizations, even if the math allows either frame.

## Retrieval Cues
- "FTE velocity vs spacecraft"
- "Reference frame for magnetopause events"
- "Which is moving, satellite or FTE?"
- "Bn bipolar time series explanation"


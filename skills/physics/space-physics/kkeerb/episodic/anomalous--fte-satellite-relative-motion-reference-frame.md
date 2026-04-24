---
name: "FTE-Satellite Relative Motion Reference Frame"
memory_type: episodic
subtype: anomalous
domain: physics
subdomain: space-physics
contributor: KKEERB
source:
  type: session
  session_id: 019dac03-e82e-74c0-9455-c8ad7498424c
extracted_at: 2026-04-24
tags: [space-physics, FTE, reference-frame, satellite-observation, magnetopause]
---

## Situation
When visualizing or interpreting FTE events at the magnetopause, a common default assumption is "satellite flies through a stationary FTE structure" — the spacecraft is the moving observer, the FTE is the fixed target. This intuition is embedded in many presentations and analysis narratives.

## Action
Computed FTE centroid velocities from auto-tracking tables (`FTE_Auto_Tracking_Raw_v29.6`) and compared against known spacecraft orbital velocities:
- FTE dawn-dusk centroid velocity: median 154.8–187.3 km/s, p10–p90 range 60–416 km/s
- Typical spacecraft orbital velocity: ~1–5 km/s at magnetopause distances

Cross-referenced with Russell/Elphic and Sibeck/Russell reviews confirming FTEs propagate rapidly along the magnetopause, potentially faster than spacecraft motion.

## Outcome
The relative motion is dominated by FTE movement, not satellite movement. The FTE moves ~30–200× faster than the satellite in the dawn-dusk direction. A "fixed probe sampling a moving FTE" is the physically correct reference frame for most events, not the reverse.

## Lesson
For FTE analysis and visualization:
- **Default assumption should be: FTE moves, probe is approximately stationary** (in the event frame)
- Bipolar Bn(t) signatures are produced by the FTE structure sweeping past a near-fixed observation point
- Only when actual spacecraft ephemeris shows unusually fast orbital motion relative to a slow/stalled FTE should the inverse frame be considered
- When real ephemeris is unavailable, use the FTE-moving frame as the physically justified default

## Retrieval Cues
Agent is about to describe "satellite flying through FTE", create animations showing satellite trajectory through stationary structure, or compute FTE duration without considering relative velocity dominance. Trigger when any analysis assumes spacecraft-motion-dominated sampling of magnetopause structures.


---
name: "Bn=0 is a projected identification proxy, not a true 3D magnetic axis"
memory_type: semantic
subtype: correction
domain: physics
subdomain: space-physics
contributor: KKEERB
source:
  type: session
  session_id: 019daae9-13f7-77e2-9cf3-941828253d83
extracted_at: 2026-04-24
tags: [space-physics, FTE, magnetic-axis, Bn, projection-artifact]
---

## Fact
The `Bn = 0` contour on the MP+0.4RE Y-Z projection plane is a **projected centerline / identification-axis proxy**, NOT the true 3D magnetic axis of the flux rope. The true magnetic axis is the field line about which other lines twist; it exists in 3D and does not generally coincide with a 2D normal-field zero-crossing on an arbitrary cut plane.

## Evidence
The literature review subagent (spawned specifically to audit the plan's physical claims) found that:
- Bn=0 on a projection plane is a diagnostic convenience, not a physical invariant
- The true magnetic axis requires 3D field-line tracing and twist analysis to locate
- The project's own identification algorithm operates on 2D Bn contours by necessity (computational cost of full 3D analysis on MHD output)

## LLM Default Belief
LLMs (and many introductory space physics texts) conflate the Bn=0 identification axis with the "magnetic axis" of the flux rope, treating them as interchangeable. The Bn=0 line is often labeled as "the axis" in 2D plots without caveat. This is acceptable for quick sketches but misleading when the claim is about 3D structure — the true axis may be displaced, curved differently, or even multiple disconnected segments in complex FTE configurations.

## Expiry Signal
This correction applies when discussing **3D** FTE structure or when the Bn=0 proxy is used as evidence for the true magnetic axis location. If a study performs full 3D field-line topology analysis (e.g., via Euler potentials or magnetic helicity decomposition), the distinction becomes less relevant — the true axis can be identified directly.


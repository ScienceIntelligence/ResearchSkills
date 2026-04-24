---
name: "Bipolar Bn as Sampling Artifact of Moving Structure"
memory_type: procedural
subtype: constraint-failure
domain: physics
subdomain: space-physics
contributor: KKEERB
source:
  type: session
  session_id: 019dac03-e82e-74c0-9455-c8ad7498424c
extracted_at: 2026-04-24
tags: [space-physics, FTE, Bn-signature, observation-interpretation, methodology]
---

## When
Interpreting why a spacecraft (or virtual probe) observes a bipolar Bn signature during an FTE crossing, or constructing pedagogical explanations of FTE observational signatures.

## Exclusions
Does not apply to: bipolar signatures from other phenomena (plasmoids, flux ropes in the magnetotail), or cases where multi-spacecraft observations directly resolve spatial vs temporal ambiguity.

## Decision
**Preferred**: Explain bipolar Bn as the temporal record of a fixed observation point sampling the spatially varying normal field of a **moving structure**. As the FTE (with its Bn=0 axis and flanking opposite-sign Bn regions) propagates past the probe, the probe records: positive Bn peak → zero crossing → negative Bn peak (or vice versa depending on orientation and hemisphere).

**Rejected**: "The satellite flies through the flux rope and measures the two sides." This reverses the dominant physical motion and obscures the true nature of the Bn structure as reconnection-induced perturbations on the magnetopause surface, not "sides of a tube."

## Reasoning
- FTE propagation speeds (100–400 km/s along magnetopause) dwarf spacecraft orbital velocities (1–5 km/s)
- The Bn bipolar structure exists on the magnetopause surface (Y-Z plane in GSE/GSM), not as cross-sectional "walls" of a tube
- The temporal signature Bn(t) is a spatial-to-temporal conversion: the structure moves, the probe samples

## Local Verifiers
1. Does the explanation specify which direction the FTE is propagating (dawn-to-dusk or dusk-to-dawn)?
2. Does it distinguish the Bn=0 crossing from the Bn peak locations in space?
3. If computing expected Bn(t) from a model, does the model advect the structure past a fixed point rather than moving a trajectory through a static field?

## Failure Handling
If multi-point spacecraft observations (e.g., MMS tetrahedron) provide timing analysis that resolves the spatial propagation direction independently, use that observed propagation direction rather than the default assumption. If the FTE is stalled or the event is unusually slow, the reference frame may need to be re-evaluated using actual ephemeris data.


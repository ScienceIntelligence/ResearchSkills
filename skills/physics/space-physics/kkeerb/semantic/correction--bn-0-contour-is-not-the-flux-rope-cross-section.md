---
name: "Bn=0 Contour Is Not the Flux Rope Cross-Section"
memory_type: semantic
subtype: correction
domain: physics
subdomain: space-physics
contributor: KKEERB
source:
  type: session
  session_id: 019dac03-e82e-74c0-9455-c8ad7498424c
extracted_at: 2026-04-24
tags: [space-physics, FTE, flux-rope, magnetic-field, identification-method]
---

## Fact
The `Bn=0` contour used in FTE identification marks the **reconnection separatrix / flux pile-up boundary** along the magnetopause, not the actual physical cross-section of a cylindrical flux rope. The bipolar Bn regions on either side of Bn=0 are **reconnection-induced field perturbations** (normal component deflections), not the "walls" of a flux rope tube.

## Evidence
- Local simulation evidence (step 1220, 14-step event): The identification algorithm itself is `Bn=0` contour + flanking opposite-sign peaks, supported by pressure-core enhancement. The Bn=0 line is the identification axis, not a physical boundary.
- Raeder et al. 2001, Dorelli et al. 2007: 3D MHD simulations show FTE structures form via multiple X-line reconnection, producing flux pile-up regions with complex topology — not simple cylindrical tubes.
- Paul et al. 2022 volumetric analysis: FTEs have elongated, sheet-like structures along the magnetopause, not circular cross-sections.
- Pfau-Kempf et al. 2025 global MHD: FTE structures are highly asymmetric and extended along the dawn-dusk direction.

## LLM Default Belief
LLMs trained on textbook descriptions tend to conceptualize FTEs as "cylindrical magnetic flux tubes connected to both hemispheres" (Russell/Elphic picture), leading to visualizations showing them as bent pipes or elbow-shaped tubes with circular cross-sections. This is a pedagogical simplification that misrepresents the actual 3D structure revealed by modern 3D MHD/PIC simulations.

## Expiry Signal
If new high-resolution MMS multi-point observations or SMILE mission data provide direct 3D tomographic reconstruction of individual FTEs, the Bn=0 interpretation may be refined. Until then, the identification-axis-not-physical-boundary distinction holds.


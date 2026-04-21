---
name: noah-mp-dual-porosity-bedrock-extension-spec
memory_type: semantic
subtype: non-public
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## Fact
Extending Noah-MP to represent rock moisture requires modifying three glossary variables, all currently undocumented in this combination: (1) OptRunoffSubsurface — add a new Option 9 representing a dynamic weathered-bedrock zone interfacing with an unconfined aquifer, replacing zero-flux / free-drainage bottom boundaries (existing options are 1–8). (2) OptSoilProperty — add a 5th option assigning dual-porosity hydraulic properties for fractured/weathered bedrock (currently options 1–4). (3) NumSoilLayer (NSOIL) — expand beyond the standard 4 layers so the vertical domain extends dynamically from 2 m default down to unweathered bedrock contact (up to 50 m). Soil zone: layers 1–4 (0–2 m), standard sand/clay/silt parameterization from STATSGO and HWSD. Weathered bedrock zone: layers 5–8 (2–10 m), thickness from Pelletier et al. (2016) regolith thickness map; fracture porosity (ϕ_f) by lithology class (granite vs. shale); matrix porosity (ϕ_m) scaled from overlying soil with weathering-reduction factor.
## Evidence
KW's implementation design notes, iterating across multiple sessions with committee-aligned methodology.
## Expiry Signal
If Noah-MP v5.1+ publishes an official rock moisture module with a different option numbering or layer scheme, the specific option numbers here expire but the dual-porosity + regolith-thickness approach remains.

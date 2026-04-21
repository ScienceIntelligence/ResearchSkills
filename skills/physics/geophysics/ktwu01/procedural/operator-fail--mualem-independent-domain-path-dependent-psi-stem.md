---
name: mualem-independent-domain-path-dependent-psi-stem
memory_type: procedural
subtype: operator-fail
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## When
Implementing dynamic stem water hysteresis in Noah-MP-PHS at the Fortran module level (SoilWaterTranspirationMod.F90), needing to track path-dependent stem water potential Ψ_stem at each 30-minute timestep.
## Decision
Required algorithm steps at each timestep: (a) compute Δθ_stem (change in stem water content since last step); (b) detect sign reversal → identifies the hysteresis loop's turning point; (c) apply Mualem independent-domain model to interpolate between α_wet and α_dry; (d) compute PATH-DEPENDENT Ψ_stem; (e) pass Ψ_stem into ResistanceCanopyStomataBallBerryMod.F90 (under OptStomataResistance = 1) to link hydraulic state to stomatal conductance β. Memory mechanism: a single Boolean `is_wetting` tracker tells the model which hydraulic path to follow.
## Local Verifiers
- Ψ vs. θ diurnal plots show divergent loops (drying vs. wetting paths) — pre-dawn rehydration vs. midday depletion.
- Sap flow overshoot reproduced at pre-dawn recovery.
- KGE increases and RMSE decreases vs. static cavitation curve baseline.
## Failure Handling
If bulk-averaging destroys direction-of-change memory: confirm that the Boolean flag is stored as model state (not local variable) and persists across timesteps.
## Anti-exemplars
- Tracking only magnitude of Δθ_stem (not sign) — collapses hysteresis.
- First-epoch instability before is_wetting is initialized (expected during warmup).

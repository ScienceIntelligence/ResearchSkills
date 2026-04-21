---
name: grace-resolution-vs-rock-moisture-scale-mismatch
memory_type: procedural
subtype: constraint-failure
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## When
Validating a hillslope-scale (10–100 m) process like rock moisture dynamics using GRACE/GRACE-FO terrestrial water storage anomalies, which have ~300 km effective spatial resolution.
## Decision
Preferred: Aggregate Noah-MP pixel-level outputs to GRACE mascon footprint, decompose modeled TWS into soil + rock + groundwater + snow/surface water components, then validate whether rock moisture inclusion improves GRACE TWS amplitude and phase agreement at the REGIONAL scale (e.g., southeastern US).
Rejected: Pixel-level rock moisture validation with GRACE (scale mismatch is ~3 orders of magnitude); claiming GRACE directly constrains rock moisture without signal decomposition.
Reasoning: GRACE integrates the full column, so without explicit decomposition, rock moisture signal is conflated with soil and groundwater.
## Local Verifiers
- Regional amplitude agreement (seasonal cycle) and phase lag quantified for TWS anomaly.
- Post-decomposition, residual TWS anomaly attributable to rock moisture dynamics after removing soil moisture (GLDAS) and groundwater (global groundwater models) components.
## Failure Handling
If decomposition fails or signals are inseparable: fall back to event-scale drydown validation at flux towers (AmeriFlux) and deficit-based mass balance (Dralle et al. 2020 / Hahm et al. 2022 methodology) as the primary constraint.
## Anti-exemplars
- Claiming GRACE validates rock moisture at CZO hillslope sites (Eel River, Southern Sierra) directly — wrong scale.

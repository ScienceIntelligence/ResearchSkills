---
name: sequential-calibration-to-manage-parameter-compounding
memory_type: procedural
subtype: tie
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## When
A multi-process land surface model is being enhanced with three new prognostic components (wood moisture, rock moisture, hysteresis scanning curves) that each add parameters, and reviewers flag "model complexity / parameter uncertainty" as a weakness.
## Decision
Preferred: Sequential calibration — Phase 1 calibrates wood moisture parameters against sap flow + stem water potential, freeze; Phase 2 calibrates rock moisture against GRACE TWS + borehole water levels with Phase 1 parameters fixed; Phase 3 calibrates hysteresis scanning curves (van Genuchten framework) against diurnal cycles with both prior phases frozen. At each stage, rank parameters by first-order Sobol indices and fix insensitive parameters at defaults. Follows Cuntz et al. (2016).
Rejected: Simultaneous joint calibration — explodes parameter space, makes attribution impossible, and produces one giant paper rather than three independently-reviewable publications.
Reasoning: Freezing prior-phase parameters isolates each component's contribution and aligns with producing one peer-reviewed publication per phase.
## Local Verifiers
- Each phase yields a publishable first-author paper before the next begins.
- Sobol sensitivity indices document which parameters matter at each phase.
## Failure Handling
If Phase N parameters interact strongly with Phase N-1 frozen values (i.e., frozen values were locally optimal but not jointly optimal): re-open prior-phase parameters only within a ±20% RMSE-degradation bound, apply Ensemble Kalman Filter with SMAP/GRACE constraints to refine.
## Anti-exemplars
- Re-tuning all parameters at every phase — destroys the staged logic.

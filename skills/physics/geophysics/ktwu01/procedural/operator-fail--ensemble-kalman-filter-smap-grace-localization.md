---
name: ensemble-kalman-filter-smap-grace-localization
memory_type: procedural
subtype: operator-fail
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## When
Assimilating SMAP L-band (surface soil moisture) and GRACE/GRACE-FO (TWS anomalies) into enhanced Noah-MP with wood and rock moisture state variables via Ensemble Kalman Filter.
## Decision
Preferred: Localize the EnKF update using Gaspari-Cohn localization radius to prevent surface-soil-moisture updates from propagating spurious corrections into wood or rock moisture state variables via ensemble cross-covariance. Decide explicitly whether to assimilate L-band brightness temperature directly or the SMAP Level-3 retrieval (brightness temperature avoids retrieval algorithm bias but requires observation operator).
Rejected: Global EnKF update without localization — cross-covariances between surface soil moisture and deep bedrock states will be noisy and generate unphysical corrections to the wood/rock states.
## Local Verifiers
- Ensemble spread remains > observation error after update (no filter collapse).
- Wood moisture and rock moisture updates only occur when physically justified by the ensemble covariance structure within the localization radius.
## Failure Handling
Paired open-loop (no DA) vs. assimilation experiments quantify uncertainty reduction in modeled transpiration, groundwater recharge, and drought onset timing.
## Anti-exemplars
- Assimilating SMAP without localization and allowing it to update rock moisture states 10 m below surface.

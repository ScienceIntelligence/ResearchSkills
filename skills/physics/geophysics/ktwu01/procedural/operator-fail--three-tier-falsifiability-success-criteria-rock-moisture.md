---
name: three-tier-falsifiability-success-criteria-rock-moisture
memory_type: procedural
subtype: operator-fail
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## When
Defining success for a new parameterization (rock moisture in Noah-MP) where any single-metric pass could be a false positive.
## Decision
Require ALL three quantitative criteria to pass simultaneously: (1) Latent Heat Flux — reduced RMSE and improved seasonal timing at AmeriFlux/flux-tower sites (FLUXNET2015, SAPFLUXNET). (2) GRACE TWS — improved amplitude and phase agreement with GRACE/GRACE-FO ΔTWS anomalies at regional scale. (3) Dry-Season Transpiration Persistence — better match to observed plant-water stress duration and latent heat maintenance during late summer at field site. Satisfying one while failing another (e.g., correct seasonal LE but wrong GRACE phase) does NOT constitute success — this is the false-positive trap. Also run the bedrock module at two timescales (event scale: drydown propagation; seasonal scale: storage depletion/recharge) to diagnose whether infiltration pulses transmit too quickly or too slowly.
## Local Verifiers
- All three criteria quantified numerically before claiming model improvement.
- Event-scale and seasonal-scale tests reported separately.
## Anti-exemplars
- Reporting only seasonal GRACE amplitude improvement while event-scale drydown is broken.

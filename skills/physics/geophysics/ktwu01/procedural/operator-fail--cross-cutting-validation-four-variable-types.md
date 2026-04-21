---
name: cross-cutting-validation-four-variable-types
memory_type: procedural
subtype: operator-fail
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## When
Designing validation for a multi-process land-surface-model enhancement where each hypothesis must be falsifiable.
## Decision
Each hypothesis requires BOTH a state variable AND a flux variable to be falsifiable at BOTH site AND regional scale. Instrument-level division of labor: AmeriFlux + FLUXNET2015 validate FLUXES (what leaves the ecosystem — LE, H, NEE via eddy covariance); SAPFLUXNET validates INTERNAL PLANT HYDRAULIC STATE (what happens inside the plant — sap flux density via Granier thermal dissipation probes); CZO boreholes + neutron probes validate SUBSURFACE STORAGE STATE (what the soil column cannot see — volumetric moisture content); GRACE/GRACE-FO validates the INTEGRATED REGIONAL WATER BUDGET (what no tower network can measure — TWS anomaly in cm equivalent water thickness).
## Local Verifiers
- Each hypothesis has at least one state variable + one flux variable in its validation matrix.
- Site-level observations and regional-scale observations are both represented.
## Anti-exemplars
- Validating wood moisture only against GRACE (wrong scale, wrong variable type).
- Validating rock moisture only against AmeriFlux LE (state variable missing).

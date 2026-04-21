---
name: sap-flow-upscaling-uncertainty-into-likelihood
memory_type: procedural
subtype: constraint-failure
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## When
Using sub-daily sap-flow data at a field site (e.g., White Family OLC) as a Bayesian likelihood target to constrain plant hydraulic parameters, where sensors measure volumetric flux density (not whole-tree water use).
## Decision
Upscaling must be made explicit: apply a named correction (e.g., Clearwater boundary-layer correction, sector-specific calibration) to convert sap-flux density to canopy transpiration, state the assumed sapwood area uncertainty as a ± percentage, and clarify whether this uncertainty enters the observation error covariance R in the EnKF or is treated as fixed.
## Local Verifiers
- Observation error covariance explicitly documents the sapwood area uncertainty contribution.
- Upscaling choice is named (not "standard scaling").
## Failure Handling
If upscaling uncertainty dominates likelihood: increase ensemble size or reduce reliance on sap flow; weight sap flow less than flux-tower LE in multi-objective calibration.
## Anti-exemplars
- Treating sap-flux density directly as canopy transpiration without correction.

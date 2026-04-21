---
name: sce-ua-vs-mcmc-dream-for-hydraulic-parameter-calibration
memory_type: procedural
subtype: tie
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## When
Calibrating α_wet, α_dry, and VPD-modulation coefficients in a plant hydraulic scheme against sap flux density observations, and deciding between deterministic global optimization and full Bayesian uncertainty quantification.
## Decision
Preferred: Use SCE-UA (Shuffled Complex Evolution) when compute is tight and a single best parameter set suffices — proven for hydrological model calibration. Switch to MCMC-DREAM when posterior uncertainty quantification is needed for downstream assimilation (e.g., EnKF with SMAP). Objective function: minimize sum of squared errors between simulated and observed sap flux density at sub-daily resolution.
Rejected: Gradient-based local optimizers (Nelder-Mead, L-BFGS) — the hysteresis loss surface is multimodal due to path-dependence.
## Local Verifiers
- Convergence diagnostics: SCE-UA complex convergence, or Gelman-Rubin R̂ < 1.1 for DREAM chains.
- Posterior parameter distributions bounded within physically plausible ranges from lithology/species priors.

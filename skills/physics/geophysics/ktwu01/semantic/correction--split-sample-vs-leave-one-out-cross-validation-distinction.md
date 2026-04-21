---
name: split-sample-vs-leave-one-out-cross-validation-distinction
memory_type: semantic
subtype: correction
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## Fact
"Leave-one-out" and "withheld sites" are DIFFERENT cross-validation strategies, not synonyms. Pick one or specify both explicitly. For Noah-MP site-to-continent parameter transfer validation: use a split-sample approach (e.g., 30 sites for calibration, 12 withheld for independent evaluation, stratified by plant functional type and climate regime), AND separately perform leave-one-out cross-validation within each PFT to quantify transfer robustness.
## Evidence
NASA FINESST reviewer weakness #4 (Scaling Challenges) identified this exact conflation in proposal text "We validate this transfer by comparing model predictions at withheld AmeriFlux and CZO sites not used in calibration (leave-one-out cross-validation)" — the two in parentheses are not equivalent.
## LLM Default Belief
LLMs and many proposal writers treat these as interchangeable; they are not. LOOCV uses each point as the held-out test once; split-sample uses a fixed held-out subset.

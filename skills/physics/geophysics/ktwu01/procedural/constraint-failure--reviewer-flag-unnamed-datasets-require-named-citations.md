---
name: reviewer-flag-unnamed-datasets-require-named-citations
memory_type: procedural
subtype: constraint-failure
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## When
A proposal references validation data with generic labels like "PHS validation data", "rock moisture observations", "bedrock water use data", "photosynthetic acclimation data" — and reviewers flag "data sources not clear" as a major weakness.
## Decision
Replace every generic label with: (a) named dataset + (b) named site/study + (c) citation. Examples: "PHS validation data" → delete; use "AmeriFlux eddy covariance LE/H at 6 sites (US-Syv, US-Ha1, US-Ton, US-UMB, US-Me2, US-Wkg)"; "rock moisture observations" → "Eel River Critical Zone Observatory borehole rock moisture measurements [Rempe & Dietrich, 2018]"; "bedrock water use data" → "bedrock water uptake isotope tracer data from [Dawson et al.] or [McCormick et al., 2021]". Also eliminate vague quantities: "40+ towers" → "42 towers (full list in Supplementary Table S1)". Grammar pass: "target" → "targets" when subject is singular.
## Local Verifiers
- Every data entry has a named source, named site (where applicable), and citation.
- No "+" or "etc." in site counts.
## Anti-exemplars
- Keeping "AmeriFlux towers etc." — reviewers will re-flag as vague.

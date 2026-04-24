---
name: "Instrument Provenance Determines Data Selection in Multi-Instrument Reproduction"
memory_type: semantic
subtype: frontier
domain: physics
subdomain: space-physics
contributor: KKEERB
source:
  type: session
  session_id: 019d92e7-be8c-7280-875e-de3d74022a3b
extracted_at: 2026-04-24
tags: ["\"eiscat\"", "\"dmsp\"", "\"instrument-provenance\"", "\"figure-reproduction\"", "\"data-selection\"", "\"radar-vs-satellite\""]
---

## Fact

In multi-instrument comparison papers, individual figures are typically instrument-specific and not reproducible from other instruments' data—even when the paper's scientific argument compares across instruments. Han et al. (2015) Figure 3 is **exclusively** EISCAT ESR radar data (Ne height profile, radar-derived Σ_P/Σ_H); DMSP satellite particle spectra cannot produce the same panels because they measure different physical quantities.

## Evidence

- Figure 3 caption identifies it as "Type 1 EISCAT ESR event" from 2010-06-16
- Five-panel structure requires `ne(h)` profiles from incoherent scatter radar inversion
- EISCAT HDF5 `MAD6400` format provides direct altitude-resolved `ne/ti/co` parameters
- DMSP SSJ/SSIES files for the same date exist but measure particle energy spectra and ion drift—not plasma density profiles

## Application Rule

When reproducing a specific figure from a paper:
1. First identify the *instrument source* from the figure caption and methods section
2. Select data that matches that instrument, not the most conveniently available alternative
3. Cross-instrument comparisons in a paper do NOT imply interchangeability for individual figures

**Why it matters:** Defaulting to the "easier" or "more available" data source (DMSP in this case) produces entirely different physical quantities, making reproduction impossible regardless of code quality.


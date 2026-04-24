---
name: "Robinson 1987 Conductance Formula — Full vs Simplified Form Discrepancy"
memory_type: semantic
subtype: correction
domain: physics
subdomain: space-physics
contributor: KKEERB
source:
  type: session
  session_id: 019d92e7-be8c-7280-875e-de3d74022a3b
extracted_at: 2026-04-24
tags: ["\"conductance\"", "\"robinson-1987\"", "\"formula-discrepancy\"", "\"eiscat\"", "\"reproducibility\"", "\"energy-flux\""]
---

## Fact

The full Robinson et al. (1987) Hall/Pedersen conductance formula uses **√(integrated energy flux)** multiplied by a **nonlinear function of mean energy** (terms like `E₀^0.67`), not a linear proportionality. The simplified linear form `Σ = k · Φ · Ē` produces systematically lower conductance values (~6% in the reproduced event).

## Evidence

- Target paper (Han et al. 2015 JGR) Equation 1 explicitly shows the √Φ dependence and nonlinear Ē term
- Computed values with simplified formula: Σ_P ≈ 11.09 S, Σ_H ≈ 10.87 S; paper reports ~11.8 S / ~12.1 S
- Full R87 form narrows the gap, confirming the formula structure itself is a significant source of systematic bias
- G01 (Gorney 2001) handles ion contribution separately from the electron R87 formula

## LLM Default Belief

LLMs and many tutorial implementations present Robinson conductance as approximately linear: conductance ∝ energy flux × mean energy. The √Φ and nonlinear Ē terms are frequently omitted or conflated with G01. This is not a training cutoff issue—the papers are old and widely cited—but a simplification that propagates through code implementations.

**Why it matters:** When reproducing or comparing conductance estimates, the formula choice shifts absolute values by 5-10%, which directly affects cross-instrument comparisons (EISCAT vs. DMSP model estimates).

## Expiry Signal

Superseded if a newer conductance parameterization becomes the field standard. R87+G01 remain the standard reference pair as of 2024.


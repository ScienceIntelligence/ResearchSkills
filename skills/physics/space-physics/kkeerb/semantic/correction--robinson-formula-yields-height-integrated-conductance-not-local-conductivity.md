---
name: "Robinson formula yields height-integrated conductance, not local conductivity"
memory_type: semantic
subtype: correction
domain: physics
subdomain: space-physics
contributor: KKEERB
source:
  type: session
  session_id: 019d8fed-df33-7d42-83a9-99f00076db6e
extracted_at: 2026-04-24
tags: [robinson-1987, conductance, conductivity, ionospheric-physics, unit-confusion]
---

## Fact

The Robinson (1987) empirical formula produces **height-integrated conductance** (Σ_P, Σ_H) in **Siemens (S)**. This is the altitude integral of local conductivity (σ_P, σ_H) in **S/m** over the ionospheric column. These are fundamentally different physical quantities.

## Evidence

Scoping discussion for a particle-precipitation → conductance study identified that converting conductance back to conductivity would require a neutral atmospheric density model, collision frequency profiles, and altitude profile inversion — a significantly harder inverse problem. The study was explicitly scoped to conductance as the first stage.

## LLM Default Belief

LLMs (and many early-career researchers) routinely treat "电导" (conductance) and "电导率" (conductivity) as interchangeable, especially in Chinese ionospheric literature. The Robinson formula is often cited without clarifying that it yields integrated quantities. This causes scope creep when a project intends to study vertical profiles but only has column-integrated values.

## Expiry Signal

Permanent geophysics fact. Valid as long as the Robinson empirical relationship is used. Only a new formula that explicitly produces height-resolved conductivity would change applicability.


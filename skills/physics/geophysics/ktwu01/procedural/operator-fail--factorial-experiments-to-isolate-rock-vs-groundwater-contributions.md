---
name: factorial-experiments-to-isolate-rock-vs-groundwater-contributions
memory_type: procedural
subtype: operator-fail
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## When
Needing to attribute ET sustained during drought to rock moisture versus groundwater versus soil moisture when all three reservoirs are simultaneously present in the enhanced model.
## Decision
Run four factorial configurations: (A) soil only, (B) soil + groundwater, (C) soil + rock moisture, (D) soil + rock + groundwater. Rock moisture contribution = (C) − (A) during soil-depleted periods; groundwater contribution = (B) − (A); synergistic nonlinearity = (D) − (A) − [(B)−(A)] − [(C)−(A)]. Exploit temporal separation: rock moisture sustains weeks-to-months while groundwater sustains months-to-years.
## Local Verifiers
- ET differences between configurations during drought progression show expected ordering (D ≥ B,C ≥ A).
- Temporal decay constants of (C)−(A) and (B)−(A) differ by an order of magnitude.
## Failure Handling
If (C)+(B)−(A) ≠ (D) (nonlinear synergy present), report the synergy term explicitly rather than claiming additive attribution.
## Anti-exemplars
- Running only configurations (A) and (D) and attributing all the difference to rock moisture (ignores groundwater).

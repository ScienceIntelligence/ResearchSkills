---
name: dealias-before-helmholtz-divergence-removal
memory_type: procedural
subtype: constraint-failure
domain: physics
subdomain: computational-physics
contributor: huangzesen
source:
  type: session
  session_id: 019a5598-14dd-7e10-9b30-fe35f01f3cd2
extracted_at: 2026-04-25
tags: [helmholtz-decomposition, dealiasing, spectral-methods, MHD, divergence-free, numerical-methods]
---

## When
You are running a Helmholtz-based divergence removal on a discretized vector field using FFT methods and observe a residual divergence "hump" at high wavenumbers (|k| near or above the Nyquist limit for the grid). For example, a 128-grid simulation showing elevated divergence for |k| > 400.

**Exclusions:** Does not apply when divergence persists at *all* wavenumbers (indicates a solver bug, not aliasing). Does not apply to real-space iterative divergence cleaning methods.

## Decision

**Preferred:** Dealias (zero or taper high-|k| modes) *before* calling `remove_divergence`, not after.

**Rejected:** Applying the dealiasing step after `remove_divergence`.

**Reasoning:** The `remove_divergence` step works by projecting out the curl-free component in Fourier space via `F̂_solenoidal = F̂ - k̂(k̂·F̂)`. If aliased energy sits in the high-k modes *entering* that projection, the projection itself generates spurious solenoidal content at those modes—content that cannot be removed by a subsequent dealiasing pass applied to each component independently. Dealiasing first prevents this contamination from ever entering the projection.

## Local Verifiers
- After applying the fix, plot the divergence power spectrum vs |k|; the hump above the dealiasing cutoff should collapse to machine-precision levels.
- Confirm total energy change from dealiasing is negligible (< 1% for well-resolved fields).

## Failure Handling
- If hump persists after reordering: check whether the dealiasing cutoff is applied consistently to *all three* field components before the Helmholtz step.
- If divergence reappears at low k after reordering: the initial field likely has physical divergence that dealiasing cannot cure; verify initial condition construction independently.

## Anti-exemplars
- Applying a 2/3-rule zero-padding to the output of `remove_divergence` and expecting it to clean up aliasing-induced divergence — the projection has already mixed aliased modes into the solenoidal components.


---
name: helmholtz-projection-nyquist-residual
memory_type: semantic
subtype: correction
domain: physics
subdomain: computational-physics
contributor: huangzesen
source:
  type: session
  session_id: 019a5af2-4c80-7d62-a3bf-a710688191ac
extracted_at: 2026-04-25
tags: [helmholtz-decomposition, divergence-cleaning, FFT, Nyquist, MHD, spectral-methods]
---

## Fact

When applying a Helmholtz divergence-removal projection in Fourier space (zeroing the longitudinal component via `B̂ ← B̂ − k̂(k̂·B̂)/|k|²`), residual divergence persists **not** because `|k|` exceeds some threshold, but because the divergence is concentrated on the **Nyquist planes** (e.g., `kx = ±Nx/2`, `ky = ±Ny/2`, `kz = ±Nz/2`). On those planes the projection denominator `|k|²` is valid, but the FFT of a real-valued field packs aliased energy there that cannot be cleanly separated into curl-free and divergence-free components. The fix is to explicitly zero (or symmetrize) the Nyquist-plane coefficients before projecting, or to use an even-grid size and discard the Nyquist bin.

## Evidence

Session exchange: user asked why `remove_divergence` cannot remove divergence above the Nyquist frequency in `|k|`; assistant clarified the residual sits on the Nyquist *planes* (discrete planes in 3-D k-space at the grid edge), not at large `|k|` in general. A new function `remove_divergence_k_space` was implemented that operates entirely in Fourier space.

## LLM Default Belief

LLMs commonly state that the projection fails "above the Nyquist frequency" as if there is a radial cutoff in `|k|`. The actual failure is planar (the Nyquist planes), not radial, and is caused by the real-FFT aliasing convention rather than by insufficient wavenumber resolution.

## Expiry Signal

No longer relevant if the codebase switches to a dealiased pseudo-spectral solver (e.g., 2/3-rule truncation) or to a non-FFT-based projection.


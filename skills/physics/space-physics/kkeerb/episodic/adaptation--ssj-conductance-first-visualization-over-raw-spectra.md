---
name: "SSJ Conductance-First Visualization Over Raw Spectra"
memory_type: episodic
subtype: adaptation
domain: physics
subdomain: space-physics
contributor: KKEERB
source:
  type: session
  session_id: 019d9041-da0d-77b1-bd7d-a76b0317b5ce
extracted_at: 2026-04-24
tags: [DMSP, SSJ, conductance, visualization-design, ionospheric-physics]
---

## Situation
The original `ssj_precipitation` plot type combined electron/ion precipitation spectrograms with derived conductance (Σ_P, Σ_H) panels. This created redundancy with Wang 2025 Figure 3e/f (which already shows SSJ electron/ion energy spectrograms) and confused users about the distinct scientific contribution of each figure type.

## Action
Refactored the SSJ figure type to lead with conductance-derived parameters: energy flux (Q_E), average energy (E_avg), Pedersen conductance (Σ_P), and Hall conductance (Σ_H). Removed electron/ion spectrogram panels entirely. SSIES data demoted to optional validation panel rather than co-equal main panel. The underlying computation uses `build_along_track_product()` which applies Robinson-style conductance formulas to SSJ precipitating particle data.

## Outcome
Eliminated visual redundancy between figure types. Conductance parameters represent a higher-level derived scientific quantity (ionospheric response to particle precipitation) compared to raw observed spectra (particle distributions), making the distinction between figure types scientifically meaningful.

## Lesson
When cataloging multiple figure types from the same instrument dataset, avoid duplicating panels that show raw observations at different aggregation levels. Prioritize derived scientific parameters (conductance, energy flux) over raw spectra when the raw spectra are already represented in another figure type. This applies to any multi-figure space physics project where one dataset feeds several visualizations.

## Retrieval Cues
- "SSJ figure has same panels as Wang Figure 3"
- "electron and ion spectrogram appearing twice"
- "conductance visualization for DMSP SSJ"
- Derived vs observed panel selection in satellite data visualization


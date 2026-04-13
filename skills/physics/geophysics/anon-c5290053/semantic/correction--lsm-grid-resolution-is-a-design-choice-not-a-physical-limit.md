---
name: "LSM grid resolution is a design choice, not a physical limit"
memory_type: semantic
subtype: correction
domain: physics
subdomain: geophysics
contributor: anon-c5290053
source:
  type: session
  session_id: 019ae1ca-70cb-7f83-be0a-cef2be4bd821
extracted_at: 2026-04-13
tags: [land-surface-models, spatial-scale, model-resolution, scientific-methodology]
---

## Fact

Land surface model (LSM) grid spacing is not a fixed physical property of the model formulation. It is a **configurable choice** constrained by three practical factors: (1) availability and resolution of atmospheric forcing data, (2) computational budget, and (3) the resolution at which the parameterizations have been validated. A given LSM family (e.g., VIC, Noah, CABLE) can in principle be run at any grid spacing from ~1 km to ~500 km. Claiming a model "has" a fixed resolution is scientifically incorrect.

## Evidence

Established in this session when the user challenged an AI-generated figure that showed bucket/column models at finer spatial resolution than modern models — an artefact of conflating "reported case-study resolution" with "inherent model resolution." The correct framing is: report the finest **operational** grid spacing demonstrated in published hindcasts, and the coarsest domain covered in published runs.

## LLM Default Belief

LLMs tend to assign a canonical resolution to each LSM (e.g., "VIC runs at 1/8°") because that is what appears most frequently in training text. This collapses a distribution into a point estimate and misleads comparisons between model generations.

## Expiry Signal

Still accurate as of 2025; would only change if a new LSM formulation introduced a hard physical scale (e.g., a cellular-automaton scheme with fixed cell size).


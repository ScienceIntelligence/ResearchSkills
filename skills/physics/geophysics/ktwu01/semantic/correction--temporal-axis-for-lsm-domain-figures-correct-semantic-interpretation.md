---
name: "Temporal axis for LSM domain figures — correct semantic interpretation"
memory_type: semantic
subtype: correction
domain: physics
subdomain: geophysics
contributor: ktwu01
source:
  type: session
  session_id: 019ae1ca-70cb-7f83-be0a-cef2be4bd821
extracted_at: 2026-04-13
tags: [land-surface-models, temporal-scale, figure-design, scientific-methodology]
---

## Fact

When plotting LSM temporal domains on a space-time scale diagram using the standard hydroclimate review convention, the correct axis semantics are:

- **Left edge (short time):** finest time step the model has been *demonstrated* to operate at in a published study (not the theoretical minimum).
- **Right edge (long time):** longest continuous hindcast published for that model family.

The right edge must **not** be "maximum possible run length" — because models can be run indefinitely, that bound is uninformative and scientifically meaningless. The axis encodes what has been *validated and reported*, not what is theoretically possible.

## Evidence

The user explicitly corrected this in session: "the recorded length can be whatever because the model can be run for whatever length???" — recognizing that an open right bound collapses the scientific information in the axis. The resolution was to anchor both edges to published operational benchmarks.

## LLM Default Belief

LLMs default to describing the temporal domain as "from minimum timestep to maximum simulation length," which conflates capability with demonstrated practice and renders the right edge meaningless for scientific comparison.

## Expiry Signal

Remains valid as a methodological convention; would change if community norms shifted to reporting capability envelopes rather than published operational ranges.


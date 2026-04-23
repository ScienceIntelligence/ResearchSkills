---
name: "Gradient Checkpointing Target Selection"
memory_type: procedural
subtype: tie
domain: computer-science
subdomain: artificial-intelligence
contributor: ergan-shang
---
## When
Enabling gradient checkpointing to reduce memory.

## Decision
**Preferred**
Apply checkpointing to **policy model forward pass that participates in backprop**.

**Rejected**
- Applying to inference-only models
- Applying everywhere indiscriminately

**Reasoning**
Checkpointing trades compute for memory only where activations are stored for backward.

## Local Verifiers
- Reduced activation memory during backward
- Increased forward compute time

## Failure Handling
If no memory improvement → checkpoint applied to wrong module.

## Anti-exemplars
- Checkpointing detached computations
- Expecting benefit for non-gradient paths

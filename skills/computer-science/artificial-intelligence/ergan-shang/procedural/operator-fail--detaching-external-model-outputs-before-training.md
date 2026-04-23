---
name: "Detaching External Model Outputs Before Training"
memory_type: procedural
subtype: operator-fail
domain: computer-science
subdomain: artificial-intelligence
contributor: ergan-shang
---
## When
Using outputs from an external model (e.g., regression model via numpy) inside training loop.

## Decision
**Preferred**
Convert to tensor → `.detach()` immediately.

**Rejected**
- Leaving tensors attached
- Mixing numpy and torch without explicit boundary

**Reasoning**
Prevents autograd from tracking irrelevant graph; reduces memory and avoids errors.

## Local Verifiers
- `requires_grad=False`
- No graph references to external model

## Failure Handling
If memory still grows → ensure no hidden references remain.

## Anti-exemplars
- Using `.from_numpy()` without detach semantics awareness

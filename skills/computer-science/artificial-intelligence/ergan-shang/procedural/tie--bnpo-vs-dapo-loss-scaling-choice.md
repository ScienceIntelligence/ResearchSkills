---
name: "Bnpo Vs Dapo Loss Scaling Choice"
memory_type: procedural
subtype: tie
domain: computer-science
subdomain: artificial-intelligence
contributor: ergan-shang
---
## When
Choosing between BNPO (per-sequence normalization) and DAPO (global token normalization) in GRPO loss.

## Decision
**Preferred**
- Use **DAPO** when concerned about **length bias** across samples.
- Use **BNPO** when prioritizing **per-example stability** or interpretability.

**Rejected**
- Mixing normalization schemes implicitly
- Assuming equivalence — they produce different gradients

**Reasoning**
DAPO normalizes over total valid tokens → reduces bias toward shorter/longer outputs.
BNPO normalizes per sequence → treats each sample equally regardless of length.

## Local Verifiers
- Compare gradient magnitude vs sequence length
- Track loss contribution per sample

## Failure Handling
If training favors short outputs → switch to DAPO  
If instability across batches → try BNPO

## Anti-exemplars
- Ignoring normalization choice (default ≠ neutral)
- Comparing methods without controlling normalization

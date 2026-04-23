---
name: "Tokenizer Invariance During Model Updates"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: artificial-intelligence
contributor: ergan-shang
---
## Fact
Updating model weights does **not change tokenizer behavior**.

## Evidence
User explicitly questioned whether tokenizer changes during updates.

## LLM Default Belief
Tokenizer may drift with model updates.

## Expiry Signal
If joint tokenizer-model training becomes standard (rare in current pipelines)

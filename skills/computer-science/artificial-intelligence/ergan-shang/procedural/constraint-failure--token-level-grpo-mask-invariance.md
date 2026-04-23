---
name: "Token Level Grpo Mask Invariance"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: artificial-intelligence
contributor: ergan-shang
---
## When
Implementing token-level GRPO and noticing that the `token_mask` is computed from the old policy but reused for the new policy.

## Decision
Treat the mask as **prompt/answer boundary–defined**, not model-dependent.

**Preferred**
Use the mask derived from prompt + answer lengths (sequence structure), not recomputed per model.

**Rejected**
- Recomputing mask from new policy outputs — introduces inconsistency.
- Assuming tokenizer/model updates change mask — they do not.

**Reasoning**
Mask encodes **which tokens belong to the answer**, independent of policy logits. Changing it across policies breaks the likelihood ratio interpretation.

## Local Verifiers
- Mask identical across old/new forward passes
- Mask depends only on `(prompt_len, answer_len)`

## Failure Handling
If mask differs across models → bug in sequence alignment, not policy behavior.

## Anti-exemplars
- Mask derived from generated tokens (incorrect)
- Mask depending on logits or sampling decisions

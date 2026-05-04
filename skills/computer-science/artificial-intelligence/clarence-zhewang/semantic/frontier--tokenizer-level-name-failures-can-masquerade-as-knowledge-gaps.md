---
name: "Tokenizer-Level Name Failures Can Masquerade as Knowledge Gaps"
memory_type: semantic
subtype: frontier
domain: computer-science
subdomain: artificial-intelligence
contributor: Clarence-ZheWang
source:
  type: session
  session_id: cad11352-36c2-4afd-aa36-cc80d4bf882a
extracted_at: 2026-04-24
---

## Fact
An LLM can know the correct person and facts yet still fail to output the exact name, because the failure is in tokenization or decoding rather than in knowledge retrieval. In particular, non-bijective tokenization or decode behavior can create apparent reasoning/knowledge errors at the surface text level.

## Evidence
In this session, the cited case described a model that consistently produced correct biographical information for a public figure while failing specifically on the person's name. The discussion linked this pattern to a recent paper arguing that some supposed reasoning or knowledge failures are actually caused by tokenizer defects such as non-unique mappings between token sequences and decoded text.

## Expiry Signal
Expire or downgrade this memory if later replication shows the phenomenon is better explained by safety filters, dataset suppression, prompt-side heuristics, or serving-layer postprocessing rather than tokenizer/decode mechanics.


---
name: "Value Space Projection For Kv Cache Eviction"
memory_type: semantic
subtype: frontier
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## Fact
A projection-based KV cache eviction method can score token importance by projecting each token's value vector onto an anchor direction derived from the pre-eviction output, rather than relying only on attention weights.

In the user's discussed work, this value-space geometric criterion was used to reduce post-eviction output error and preserve long-context performance under a small cache budget.

## Evidence
The conversation history records a method centered on anchor direction projection for KV cache eviction. It was described as evaluating token importance in value-vector space, tested on LongBench, and positioned against attention-only heuristics.

Concrete remembered results: 96.07% of full-cache accuracy on 16 LongBench datasets using 3.44% KV cache budget, with an example post-eviction output error reduction from 1.14 to 0.82.

## Expiry Signal
Refresh this memory if later experiments change the reported LongBench numbers, cache budget, or if the paper's final camera-ready version revises the method name or metric definition.

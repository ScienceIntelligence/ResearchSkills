---
name: "Attention Weight Importance Is Not Enough For Kv Eviction"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## Fact
For KV cache eviction, attention weight alone can be an incomplete proxy for token importance. The value vector's direction and contribution to the output geometry can matter.

## Evidence
The user's KV-cache work emphasized that attention-only eviction overlooks spatial relationships in value-vector space. The proposed correction was to project value vectors onto an anchor direction corresponding to the pre-eviction output.

## LLM Default Belief
A frontier LLM will often default to “keep high-attention tokens” as the natural KV eviction rule, because many public KV-cache methods are attention-score based.

That default is incomplete in this user's research context: the relevant failure mode is post-eviction output drift, which depends on value-space geometry as well as attention magnitude.

## Expiry Signal
If future experiments show attention-only methods match projection-based methods under the same cache budget and benchmark suite, downgrade this from correction to ordinary design choice.

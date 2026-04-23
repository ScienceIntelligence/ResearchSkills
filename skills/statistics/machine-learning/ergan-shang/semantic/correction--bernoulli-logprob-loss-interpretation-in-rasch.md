---
name: "Bernoulli Logprob Loss Interpretation In Rasch"
memory_type: semantic
subtype: correction
domain: statistics
subdomain: machine-learning
contributor: ergan-shang
---
## Fact
Loss defined as  
`-(Bernoulli(probs).log_prob(data) * mask).mean()`  
is **masked negative log-likelihood**, not arbitrary scaling.

## Evidence
User confusion about `log_prob`; clarified as:
log P(data | θ, z) under Bernoulli model.

## LLM Default Belief
Treats `log_prob` as opaque or interchangeable with MSE-style loss.

## Expiry Signal
If framework changes probabilistic API semantics

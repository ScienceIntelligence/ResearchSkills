---
name: "Same Parameter Ablation For Model Compression Claims"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When a paper claims that a method improves performance because it reduces parameter count, simplifies a model, or uses a more efficient architecture.

Exclude cases where parameter count is not part of the causal claim.

## Decision
Preferred: add a same-parameter-count comparison to isolate whether the gain comes from the proposed idea or simply from capacity differences.

Rejected: comparing a smaller proposed model only against a larger or differently scaled baseline.  
Rejected: claiming efficiency from raw parameter reduction without matching model capacity.

Reasoning: reviewers can reject the causal interpretation if the experiment confounds method design with parameter count.

## Local Verifiers
- Same parameter budget comparison exists.
- Same training budget and data are used.
- Performance is reported alongside parameter count.
- The method still wins when capacity is controlled.

## Failure Handling
If same-parameter experiments are too expensive, include a smaller controlled ablation and state the limitation explicitly.

If the proposed model loses under equal parameters, revise the claim from “better architecture” to “better efficiency-performance tradeoff.”

## Anti-exemplars
- “Our model has fewer parameters and higher accuracy,” with no controlled-size baseline.
- “The parameter reduction proves the method is superior.”

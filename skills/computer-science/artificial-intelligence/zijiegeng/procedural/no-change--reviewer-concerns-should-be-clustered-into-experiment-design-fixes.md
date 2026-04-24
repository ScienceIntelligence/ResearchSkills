---
name: "Reviewer Concerns Should Be Clustered Into Experiment Design Fixes"
memory_type: procedural
subtype: no-change
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When receiving many reviewer criticisms that seem scattered across training, runtime, comparison, and ablation.

Exclude purely writing-style objections.

## Decision
Preferred: cluster comments into a small number of experiment-design fixes: training dynamics, runtime definition, external baselines, semi-supervised details, and fair parameter comparison.

Rejected: answering each criticism as an isolated sentence.  
Rejected: defending the current experiments without identifying the missing evidence class.

Reasoning: reviewers often express symptoms; the rebuttal should reveal the underlying experimental validity issue and offer targeted evidence.

## Local Verifiers
- Each reviewer concern maps to an evidence category.
- Proposed new experiment directly resolves that category.
- The response separates completed evidence from future work.
- Claims are narrowed where evidence is missing.

## Failure Handling
If there is no time for new experiments, provide existing logs, clarify definitions, and explicitly soften unsupported claims.

If reviewers request impossible comparisons, explain protocol mismatch and provide the closest fair alternative.

## Anti-exemplars
- “We thank the reviewer and will clarify” for a missing-ablation criticism.
- Adding prose without adding or identifying evidence.

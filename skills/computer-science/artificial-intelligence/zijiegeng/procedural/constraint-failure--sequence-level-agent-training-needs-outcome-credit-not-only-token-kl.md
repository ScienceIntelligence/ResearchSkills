---
name: "Sequence Level Agent Training Needs Outcome Credit Not Only Token Kl"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When training tool-using or multi-step reasoning agents from trajectories.

Exclude single-turn next-token imitation tasks where all target tokens are equally supervised.

## Decision
Preferred: separate token-level imitation quality from sequence-level task success.

Rejected: assuming lower token KL against a teacher implies better agent performance.  
Rejected: optimizing every token equally when only some decisions affect success.

Reasoning: agent trajectories have sparse outcome structure. Boilerplate, reasoning traces, and decisive tool actions should not necessarily receive the same credit.

## Local Verifiers
- Success rate is measured at trajectory level.
- Loss is analyzed separately for action/tool tokens and ordinary text tokens.
- Failed teacher trajectories are filtered or downweighted.
- Advantage or outcome weighting is tested.

## Failure Handling
If token imitation improves but success does not, inspect decisive action positions and use outcome-weighted or step-aware losses.

If sequence-level reward improves but language quality collapses, add KL regularization or mixed SFT.

## Anti-exemplars
- Reporting only cross-entropy loss for an agent benchmark.
- Treating all tokens in a failed trajectory as positive demonstrations.

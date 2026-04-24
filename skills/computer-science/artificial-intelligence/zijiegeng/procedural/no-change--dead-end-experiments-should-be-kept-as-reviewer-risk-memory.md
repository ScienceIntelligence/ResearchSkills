---
name: "Dead End Experiments Should Be Kept As Reviewer Risk Memory"
memory_type: procedural
subtype: no-change
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When an experiment path was abandoned, failed, or produced no clear improvement, but later reviewer questions revisit the same assumption.

Exclude routine failed runs caused by code bugs or infrastructure problems.

## Decision
Preferred: preserve the failed attempt as a research-memory item: what was tried, what assumption failed, and what evidence would be needed to revive it.

Rejected: deleting dead ends from the research narrative.  
Rejected: treating failed ablations as useless.

Reasoning: dead ends often encode exactly the tacit knowledge needed for rebuttals and future method selection.

## Local Verifiers
- Failed method is tied to a hypothesis.
- Failure mode is distinguishable from implementation failure.
- Logs or metric deltas exist.
- The abandoned path can answer “why not this simpler alternative?”

## Failure Handling
If the failure reason is unclear, record it as unresolved rather than inventing a causal story.

If reviewers request the same experiment, rerun only the minimal version needed to verify the old failure.

## Anti-exemplars
- “It did not work” with no metric, setting, or hypothesis.
- Forgetting a failed baseline and later being unable to justify its omission.

---
name: "Freeing Memory By Dropping Non Backprop Models"
memory_type: episodic
subtype: adaptation
domain: computer-science
subdomain: artificial-intelligence
contributor: ergan-shang
---
## Situation
Running a pipeline where a regression model produces `influence_scores` and is not needed afterward.

## Action
Convert outputs to tensor → `detach()` → delete model → optionally reload per batch.

## Outcome
Significant memory reduction; avoids OOM at cost of recomputation.

## Lesson
In multi-model pipelines, **only keep models required for backward pass**. Others should be explicitly removed.

## Retrieval Cues
- “I don’t need this model after this line”
- OOM during later forward/backward

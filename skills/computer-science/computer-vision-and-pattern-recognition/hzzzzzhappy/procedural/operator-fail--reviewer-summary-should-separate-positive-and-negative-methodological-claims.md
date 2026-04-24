---
name: "Reviewer Summary Should Separate Positive And Negative Methodological Claims"
memory_type: procedural
subtype: operator-fail
domain: computer-science
subdomain: computer-vision-and-pattern-recognition
contributor: hzzzzzhappy
---
## When + Exclusions
When summarizing reviewer comments as an SPC or meta-reviewer.

Exclude casual summaries for non-research feedback.

## Decision
Preferred: separate positive methodological contributions from negative concerns in coherent paragraphs, not as generic bullet labels.

Rejected: vague “strength: good method; weakness: needs experiments.”

Reasoning: useful review synthesis should identify what is scientifically strong and what threatens validity, especially motivation, experimental sufficiency, and methodological justification.

## Local Verifiers
- Positive paragraph mentions concrete contribution or novelty.
- Negative paragraph mentions specific experimental or motivational weakness.
- Summary does not overstate the reviewer’s confidence.

## Failure Handling
If reviewer comments are sparse, infer only from stated evidence and mark uncertainty.

## Anti-exemplars
- Treating writing clarity as the only weakness when experiments are the real issue.
- Ignoring motivation concerns.
- Producing a list that cannot guide revision.

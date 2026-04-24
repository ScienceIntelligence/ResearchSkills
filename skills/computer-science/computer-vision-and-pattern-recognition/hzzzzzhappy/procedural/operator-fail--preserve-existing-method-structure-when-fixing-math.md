---
name: "Preserve Existing Method Structure When Fixing Math"
memory_type: procedural
subtype: operator-fail
domain: computer-science
subdomain: computer-vision-and-pattern-recognition
contributor: hzzzzzhappy
---
## When + Exclusions
When correcting equations or method logic in an already drafted paper section.

Exclude first-draft writing where no structure exists yet.

## Decision
Preferred: minimally edit the flawed mathematical assumption while preserving the user’s paragraph and equation layout.

Rejected: rewriting the whole section or changing formatting when the user only needs the mathematical issue fixed.

Reasoning: the user’s writing process depends on stable structure; unnecessary restructuring creates extra revision burden and can obscure the actual methodological correction.

## Local Verifiers
- The user says “don’t change my formatting.”
- Existing equations are already in the desired style.
- The issue is mathematical validity, not readability.

## Failure Handling
If a deep rewrite is unavoidable, first isolate the exact invalid step and provide a patch-style replacement.

## Anti-exemplars
- Reformatting a whole subsection after being asked to fix one equation.
- Replacing compact equations with long prose.
- Changing notation names without need.

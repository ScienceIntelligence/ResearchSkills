---
name: "Reduce Multi-Object Prompts to the Single Swapped Object"
memory_type: episodic
subtype: adaptation
domain: computer-science
subdomain: computer-vision-and-pattern-recognition
contributor: xisen-w
source:
  type: session
  session_id: 019a69ca-a7ed-75c1-ba03-98f3a8fbd36f
extracted_at: 2026-04-24
---

## Situation
Multi-object prompts initially used coarse labels such as `all five correct` versus `4-of-5 correct`, which made the soft score too detached from the actual semantic error.

## Action
The evaluation was adapted by identifying that, for the usable multi-object items, prompt pairs differed by only one object. One anomalous extra prompt was removed, and the soft comparison was reduced to the changed object pair rather than the whole response string.

## Outcome
The multi-object section became methodologically consistent with the single-object section: the soft metric reflected the specific swapped object humans were reacting to, instead of a blunt categorical answer.

## Lesson
When multi-object hallucination prompts are constructed as one-object substitutions, score the substituted object directly. Do not let an aggregate verbal response category stand in for the semantic error source.

## Retrieval Cues
Use when:
- multi-object prompts appear in paired form
- only one object differs between variants
- humans are judging `4-of-5` versus `5-of-5`
- soft scores seem disconnected from the actual object swap


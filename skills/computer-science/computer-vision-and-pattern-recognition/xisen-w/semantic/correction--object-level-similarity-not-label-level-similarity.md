---
name: "Object-Level Similarity, Not Label-Level Similarity"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: computer-vision-and-pattern-recognition
contributor: xisen-w
source:
  type: session
  session_id: 019a69ca-a7ed-75c1-ba03-98f3a8fbd36f
extracted_at: 2026-04-24
---

## Fact
For single-object hallucination evaluation, the soft score should compare the model-mentioned object phrase against the image-grounded reference object phrase, not against the survey response label or the binary yes/no key.

## Evidence
In this session, a case equivalent to `reference=laptop, prediction=device` was treated as the intended semantic comparison, while a row with a negative binary key but object text like `prediction=cauliflower` exposed that scoring against the binary label produced nonsensical soft values. The methodology was corrected to use explicit object pairs extracted from the prompts.

## LLM Default Belief
A model may incorrectly assume that a soft score for a survey item should be derived from the annotator's yes/maybe/no response or from the binary correctness label, because those are the obvious structured fields in the dataset.

## Expiry Signal
Expire this rule if the dataset no longer encodes object mentions in the prompt text, or if the study explicitly changes the target from object-level semantic alignment to response-level agreement.


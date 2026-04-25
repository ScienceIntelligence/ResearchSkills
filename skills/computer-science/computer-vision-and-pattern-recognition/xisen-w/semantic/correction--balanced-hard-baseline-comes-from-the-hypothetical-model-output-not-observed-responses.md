---
name: "Balanced Hard Baseline Comes From the Hypothetical Model Output, Not Observed Responses"
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
In this evaluation design, the hard metric is defined by a hypothetical model that always asserts the generated statement is true (`yes` / `all five`), so with an intentionally balanced key the hard baseline is fixed at 0.5 even if human respondents answer differently.

## Evidence
A major confusion in the session came from reporting hard values around `0.70`, which were later rejected because they reflected human agreement with the key rather than the intended model baseline. The methodology was reset: the model is assumed to endorse all generated statements, and because half the statements are constructed false, hard accuracy must remain 50%.

## LLM Default Belief
A model will often compute hard accuracy from the observed responses in the table, because those are the only explicit predictions present.

## Expiry Signal
Expire this if the study begins evaluating actual model outputs instead of the synthetic always-affirmative baseline, or if the true/false balance of the key changes.


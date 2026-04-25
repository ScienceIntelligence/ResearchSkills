---
name: "Reframe Comparison Axis When Caught in False Dichotomy"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: multiagent-systems
contributor: xisen-w
source:
  type: session
  session_id: 5ceb0b61-25ab-4a3e-8f6d-59df82422944
extracted_at: 2026-04-24
tags: [rebuttal, false-dichotomy, conceptual-reframing, reviewer-response]
---

## When
Reviewer correctly identifies that your claimed dichotomy doesn't hold. Example: "You claim to compare Vertical vs Decentralized, but MetaGPT and CAMEL aren't strictly vertical workflows."

## Exclusions
- Reviewer misunderstands your classification (defend with evidence)
- Dichotomy is empirically valid but poorly explained (clarify, don't reframe)

## Decision

### Preferred: Concede-and-Reframe
Acknowledge the surface-level misclassification, then pivot to a more fundamental axis:
- "We acknowledge MetaGPT/CAMEL aren't strictly vertical in topology"
- "The deeper distinction is *designer-imposed static coordination* (pre-specified workflows) vs *emergent coordination* (runtime discovery via LLM communication)"

### Rejected: Defend Original Labels
"Actually MetaGPT IS vertical because [forced interpretation]..." Appears defensive and misses conceptual depth.

### Reasoning
Reviewer is right about specific examples but wrong about core contribution. Reframing demonstrates intellectual honesty while revealing the actual conceptual advance. Position papers especially benefit from clarifying the conceptual space.

## Local Verifiers
New axis should:
1. Still distinguish your work from all baselines
2. Align with your algorithm's actual mechanism (not post-hoc rationalization)
3. Feel like a generalization that makes the original axis a special case

## Failure Handling
If new axis also collapses under scrutiny → the contribution may not be novel. Consider whether you're solving a real problem or chasing a phantom distinction.

## Anti-exemplars
- Introducing multiple new axes simultaneously (looks evasive)
- Switching to entirely unrelated terminology (breaks continuity)
- "It depends on how you define X" without committing to a definition


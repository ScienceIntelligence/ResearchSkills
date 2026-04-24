---
name: "Related Work Baselines Are Required When Contrasting Learning Paradigms"
memory_type: procedural
subtype: operator-fail
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When a paper contrasts supervised, unsupervised, semi-supervised, or reinforcement-learning approaches.

Exclude internal ablations that are not meant to position the method against prior work.

## Decision
Preferred: include representative prior methods from each relevant learning paradigm or explain precisely why they are not comparable.

Rejected: comparing only internal variants.  
Rejected: using the absence of implementation as a silent reason to omit strong baselines.

Reasoning: a paradigm-level claim requires external anchors; otherwise the comparison reads as an ablation, not evidence against the literature.

## Local Verifiers
- At least one strong prior supervised baseline if supervised learning is discussed.
- At least one unsupervised or self-supervised baseline if unsupervised learning is discussed.
- Dataset and metric alignment with prior work.
- Explicit note for non-comparable baselines.

## Failure Handling
If a baseline cannot be reproduced, quote its reported numbers only when protocols match; otherwise mark it as non-direct comparison.

If protocols differ, add a controlled reimplementation on a shared benchmark.

## Anti-exemplars
- “Supervised learning is worse” based only on a weak internal supervised variant.
- “No prior method is included because implementation is unavailable.”

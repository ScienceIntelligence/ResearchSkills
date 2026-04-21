---
name: "Research integrity antipatterns: deceptive practices to reject in paper writing"
memory_type: procedural
subtype: tie
domain: computer-science
subdomain: machine-learning
contributor: ktwu01
source:
  type: literature
  ref: "hzwer/WritingAIPaper NotGoodIdeas.md; community field observations 2022-2026"
extracted_at: 2026-04-20
---

## Situation
An AI agent is drafting, reviewing, or evaluating an ML/AI research paper and must decide whether a claimed contribution or evaluation is scientifically honest.

## Procedure

### Computational Honesty
- Do NOT hide actual training cost behind misleading batch-size or epoch counts.
- Do NOT report wall-clock time without specifying hardware, parallelism, and whether warmup is included.
- Do NOT present a large model's distilled output as if the small model learned independently.

### Hyperparameter Transparency
- Do NOT treat critical hyperparameters as "magic numbers" buried in appendices.
- Do NOT tune hyperparameters on the test set and report them as if chosen a priori.
- Do NOT selectively report only the learning-rate schedule that worked.

### Method Integrity
- Do NOT rebrand an existing technique under a new name without citing the original.
- Do NOT add minor architectural tweaks (activation swap, extra skip connection) and claim them as the core contribution without ablation.
- Do NOT use an elaborate loss function whose individual contribution is never isolated.

### Evaluation Honesty
- Do NOT cherry-pick favorable metrics while omitting standard ones where the method underperforms.
- Do NOT selectively report datasets; if a benchmark is standard in the field, include it or explain the omission.
- Do NOT use inconsistent preprocessing or evaluation protocols between your method and baselines.
- Do NOT compare against outdated or weak baselines when stronger ones exist.

### Reproducibility
- Do NOT withhold code, data splits, or random seeds that are necessary to reproduce results.
- Do NOT present results averaged over a suspiciously small number of runs without confidence intervals.

## Retrieval Cues
- Writing or reviewing a contributions/experiments section.
- Evaluating whether a claimed improvement is scientifically valid.
- Checking if an ablation study is complete and fair.
- Assessing whether baselines are appropriate and up-to-date.

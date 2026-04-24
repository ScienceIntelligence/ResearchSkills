---
name: "Pass Three Measures Reliability Not Single Run Competence"
memory_type: semantic
subtype: frontier
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## Fact
In the discussed agent benchmark, `pass^3` means a task is counted as passed only if three independent runs all pass. It is a reliability-oriented binary metric, not an average score across three attempts.

## Evidence
The user's benchmark investigation found that each task is run three times; the task-level score is 1 only if all three runs pass, otherwise 0. This makes the metric stricter than ordinary pass@1 or average success.

## Expiry Signal
Refresh if the benchmark changes its scoring script, adds partial credit, or redefines `pass^3` as a probabilistic estimator rather than an all-three-pass criterion.

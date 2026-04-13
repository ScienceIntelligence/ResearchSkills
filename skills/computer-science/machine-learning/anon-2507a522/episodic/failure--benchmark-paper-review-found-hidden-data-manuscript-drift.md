---
name: "Benchmark Paper Review Found Hidden Data-Manuscript Drift"
memory_type: episodic
subtype: failure
domain: computer-science
subdomain: machine-learning
contributor: anon-2507a522
source:
  type: session
  session_id: 019d1640-8460-7d92-a5e5-61d62bd04325
extracted_at: 2026-04-13
tags: [benchmarking, paper-review, reproducibility, dataset-statistics]
---

## Situation
A reviewer was asked to assess an academic ML benchmark paper for factual consistency between manuscript claims and the underlying benchmark data.

## Action
They inspected the paper diff, then enumerated the benchmark task manifests, counted total items, and tallied task categories from the raw dataset artifacts before judging the manuscript text.

## Outcome
The audit surfaced a critical mismatch: the paper’s reported task counts did not match the actual benchmark inventory. What looked like a paper-edit review became a data-grounded reproducibility check.

## Implication
Until the totals are regenerated from the same benchmark snapshot, the manuscript’s count claims should be treated as untrusted rather than approximately correct.

## Lesson
For benchmark papers, dataset-size claims are empirical claims. Review them against the underlying benchmark artifacts, not just against neighboring prose or tables.

## Retrieval Cues
- A paper revision changes benchmark totals or category statistics.
- The abstract makes strong scope claims about a new benchmark.
- The benchmark is assembled from many per-task JSON or manifest files.
- Reviewer concern is “factual consistency,” not just wording quality.


---
name: "Internal Benchmark Results Should Not Be Overfit Into Public Scientific Claims"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When an internal regression benchmark later becomes part of a public paper, report, or release.

Exclude private-only test sets used strictly for debugging.

## Decision
Preferred: separate “useful for internal model development” from “representative of the broader task distribution.”

Rejected: converting internal diagnostic success into broad scientific superiority.  
Rejected: tuning heavily on the benchmark and then presenting it as independent validation.

Reasoning: internal benchmarks are valuable but vulnerable to selection and adaptation bias.

## Local Verifiers
- Benchmark construction history is disclosed.
- Model-development exposure is stated.
- External benchmarks or held-out tasks support broader claims.
- Leaderboard claims are modest.

## Failure Handling
If the model has been tuned on the benchmark, call it a development or regression benchmark.

If public users report mismatched results, collect them as distribution-expansion cases rather than treating them as noise.

## Anti-exemplars
- “Our model is best at real-world productivity” based only on an internal diagnostic set.
- Releasing a benchmark without clarifying prior model exposure.

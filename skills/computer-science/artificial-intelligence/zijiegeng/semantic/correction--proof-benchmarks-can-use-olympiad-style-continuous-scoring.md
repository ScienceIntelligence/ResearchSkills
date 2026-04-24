---
name: "Proof Benchmarks Can Use Olympiad Style Continuous Scoring"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## Fact
For IMO-style proof benchmarks, the relevant scoring may be 0–7 per problem rather than binary pass/fail or pass^k.

## Evidence
The user's benchmark comparison found that an IMO proof benchmark used per-problem 0–7 scoring and reported aggregate percentages, rather than applying a binary pass threshold like pass^3.

## LLM Default Belief
A frontier LLM may try to force all agent/proof benchmarks into pass/fail scoring because many coding and tool-use benchmarks use binary success.

That default is wrong for olympiad-style proof evaluation, where partial proof progress is scientifically meaningful.

## Expiry Signal
Refresh if the benchmark introduces a binary leaderboard, pass threshold, or separate exact-solve metric.

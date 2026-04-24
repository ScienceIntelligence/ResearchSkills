---
name: "Task Success Criteria Are More Important Than Task Count In Agent Benchmarks"
memory_type: procedural
subtype: tie
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When designing or auditing productivity-oriented agent benchmarks.

Exclude simple multiple-choice or static QA benchmarks.

## Decision
Preferred: spend effort on precise task presentation, success criteria, environmental assumptions, and judge instructions before increasing task count.

Rejected: treating more tasks as automatically better.  
Rejected: relying on vague natural-language goals and a judge to infer success.

Reasoning: for agent tasks, ambiguity in success criteria dominates variance. A smaller benchmark with clear pass conditions can be more scientifically useful than a large vague one.

## Local Verifiers
- Each task has explicit goal state.
- Judge has observable artifacts to inspect.
- Ambiguous user preferences are minimized.
- Human verification catches judge errors.
- Repeated runs measure stability.

## Failure Handling
If judge disagreement is high, refine task criteria rather than switching judges first.

If many tasks require subjective judgment, split them into objective subgoals.

## Anti-exemplars
- “Do something useful with this repo” as a benchmark task.
- Judge prompt says only “decide whether the answer is good.”

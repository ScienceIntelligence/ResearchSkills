---
name: "Llm Agent Evaluation Needs Stability Not Just Best Run"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When evaluating stochastic LLM agents on tool-use or productivity tasks.

Exclude deterministic exact-match QA.

## Decision
Preferred: report repeated-run stability or strict multi-run pass metrics when task execution is stochastic.

Rejected: reporting only the best of several runs.  
Rejected: using a single run as definitive when agent behavior is highly variable.

Reasoning: for agents, reliability is part of capability. A model that succeeds once but fails often may be unsuitable for the claimed setting.

## Local Verifiers
- Multiple independent runs per task.
- Pass-all or pass-rate statistics.
- Failure modes are categorized.
- Randomness, model temperature, and reasoning budget are fixed or reported.

## Failure Handling
If repeated runs are expensive, evaluate a representative subset with repeats and mark the rest as single-run.

If stability is low, report both peak success and reliable success.

## Anti-exemplars
- “The agent solved the task once.”
- Leaderboard score based on cherry-picked successful traces.

---
name: "Thinking Budget Is A Hidden Confounder In Agent Benchmarks"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When comparing models on agent benchmarks where models may expose a reasoning or thinking-level parameter.

Exclude benchmarks where all models have fixed, non-configurable inference behavior.

## Decision
Preferred: record whether thinking level is explicitly set, omitted, inherited from framework defaults, or model-provider default.

Rejected: assuming “default” means the same thing across models or harnesses.  
Rejected: comparing leaderboard numbers without checking reasoning-budget configuration.

Reasoning: thinking budget changes both performance and cost. If it is hidden or inherited, the comparison mixes model quality with inference-policy differences.

## Local Verifiers
- Benchmark script explicitly passes a thinking parameter.
- CLI help text matches actual runtime behavior.
- Official reported runs disclose reasoning level.
- Cost/token budget is reported alongside success.

## Failure Handling
If the benchmark omits the parameter, rerun with explicit low/medium/high/off settings where possible.

If model APIs interpret the same setting differently, report each provider's native behavior separately.

## Anti-exemplars
- “Model A beats Model B” without reasoning-budget disclosure.
- Treating an omitted setting as “off” or “high” without checking the harness.

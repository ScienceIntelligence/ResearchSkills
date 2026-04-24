---
name: "Omitted Thinking Parameter Is Not Equivalent To High Or Off"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## Fact
In the user's benchmark investigation, some harnesses did not explicitly set `thinkingLevel`; actual behavior was inherited from the underlying framework or model default. In at least one case, help text suggested a default, while actual non-passed behavior was not equivalent to explicitly setting that value.

## Evidence
The user investigated multiple agent benchmarks and found that some scripts allowed model arguments without explicitly setting thinking level. The conclusion was that omitted thinking configuration should be treated as unspecified unless the runtime confirms otherwise.

## LLM Default Belief
A frontier LLM may confidently infer that a documented default in CLI help is the actual benchmark setting.

That can be wrong: benchmark code, framework defaults, and model-provider defaults may diverge.

## Expiry Signal
Refresh when benchmark maintainers pin thinking settings in code, publish run configs, or resolve related issues/PRs.

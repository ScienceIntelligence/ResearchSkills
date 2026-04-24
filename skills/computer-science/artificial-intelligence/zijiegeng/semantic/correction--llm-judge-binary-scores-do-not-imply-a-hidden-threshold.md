---
name: "Llm Judge Binary Scores Do Not Imply A Hidden Threshold"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## Fact
A benchmark can use an LLM judge and still produce binary 0/1 task scores without an explicit scalar threshold. The judge may be prompted to decide pass/fail against task-specific success criteria.

## Evidence
In the user's investigation of agent benchmarks, one evaluated tasks using an LLM judge with manually verified task definitions and success criteria. The public information did not show a continuous judge score or fixed numeric threshold.

## LLM Default Belief
A frontier LLM may assume that if an LLM judge is used, there must be a continuous score followed by a threshold.

That is not necessarily true. In this benchmark context, the judge can directly output a categorical pass/fail decision.

## Expiry Signal
Update this if the benchmark releases judge prompts showing scalar rubrics, confidence scores, or thresholded continuous outputs.

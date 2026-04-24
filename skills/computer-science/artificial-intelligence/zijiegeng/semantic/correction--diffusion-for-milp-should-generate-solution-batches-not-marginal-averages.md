---
name: "Diffusion For Milp Should Generate Solution Batches Not Marginal Averages"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## Fact
For generative MILP methods, the useful object is often a batch of candidate discrete solutions, not a single averaged marginal prediction.

## Evidence
In the user's discussion of a MILP generative-model paper, the key clarification was that diffusion is used to generate multiple candidate solutions. These candidates can then be supplied to a solver as warm starts, incumbents, repair targets, or search guidance.

## LLM Default Belief
A frontier LLM may collapse generative optimization into “predict marginals, then round.”

That misses the point of a diffusion-style approach: preserving multimodality by sampling diverse candidate solutions.

## Expiry Signal
Refresh if the target paper's method turns out to use diffusion only for marginal prediction or if solver integration differs from warm-start/repair/search guidance.

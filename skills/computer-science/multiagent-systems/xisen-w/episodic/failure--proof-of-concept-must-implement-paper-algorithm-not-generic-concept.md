---
name: "Proof-of-Concept Must Implement Paper Algorithm, Not Generic Concept"
memory_type: episodic
subtype: failure
domain: computer-science
subdomain: multiagent-systems
contributor: xisen-w
source:
  type: session
  session_id: 5ceb0b61-25ab-4a3e-8f6d-59df82422944
extracted_at: 2026-04-24
tags: [position-paper, experimental-validity, algorithm-specification, proof-of-concept]
---

## Situation
Implementing proof-of-concept for position paper claiming "Networked Agents Scale Better Than Vertical Workflows". Paper included Algorithm 1 specifying heterogeneous agents with local verification.

## Action
Agent implemented generic "hub-and-spoke vs network topology" experiment where both conditions called identical LLM functions, without reading the algorithm specification.

## Outcome
User caught the invalidity: "Are you kidding me... we closely documented the algorithm for the network of agents." Experiment couldn't demonstrate claimed advantage (agent specialization, local verification, routing around damage) because it didn't implement those features.

## Lesson
For position papers with algorithmic claims, read Algorithm/Figure boxes before implementing PoC. The PoC must instantiate the *specific mechanisms* described, not just the high-level metaphor. Generic "network vs centralized" fails to validate "heterogeneous agents with capability advertisement and local verification."

## Retrieval Cues
- Building proof-of-concept for position paper
- "Implement this system" without algorithm reference
- Agent about to write experiment from abstract alone
- Validation concerns raised about preliminary results


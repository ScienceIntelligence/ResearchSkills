---
name: "Arbitrary Size Gnn Claims Need Scaling And Input Contract Tests"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When a graph neural network is claimed to handle arbitrary-size MILP, circuit, or combinatorial-optimization instances.

Exclude fixed-size toy settings where scalability is not claimed.

## Decision
Preferred: test both graph-size scaling and input-contract validity: variable counts, constraint counts, edge construction, feature normalization, and batching behavior.

Rejected: assuming message passing implies arbitrary-size generalization.  
Rejected: showing only small instances with similar graph statistics.

Reasoning: GNNs are syntactically size-flexible but not automatically distribution-flexible or memory-scalable.

## Local Verifiers
- Evaluation includes larger graphs than training.
- Runtime and memory scale are reported.
- Constraint and variable features are normalized consistently.
- The graph construction supports unseen instance shapes.

## Failure Handling
If larger graphs fail, distinguish representational failure from memory/runtime failure.

If performance collapses but runtime works, test whether features encode absolute size or training-distribution artifacts.

## Anti-exemplars
- “The model is a GNN, so it naturally supports arbitrary MILP sizes.”
- Testing only instances from the same size bucket as training.

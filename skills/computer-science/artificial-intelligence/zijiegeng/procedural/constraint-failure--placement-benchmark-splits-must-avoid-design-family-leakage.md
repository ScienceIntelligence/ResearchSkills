---
name: "Placement Benchmark Splits Must Avoid Design Family Leakage"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When training and evaluating learned placement or timing models on benchmark suites containing related circuit designs.

Exclude classical non-learning placers that do not train on benchmark data.

## Decision
Preferred: define train/validation/test splits at the design level and avoid leakage among highly related designs.

Rejected: random cell/net-level splitting inside the same design.  
Rejected: using validation designs that are near-duplicates of test designs without disclosure.

Reasoning: learned placement methods can overfit design-family statistics. A cell-level split can exaggerate generalization.

## Local Verifiers
- Train/validation/test designs are listed explicitly.
- No test-design cells or nets appear in training.
- Cross-design generalization is reported.
- The split is stable across ablations.

## Failure Handling
If old experiments used mixed splits, report them as in-design generalization only and add a design-level split.

If data scarcity prevents clean splits, use leave-one-design-out evaluation.

## Anti-exemplars
- Training on part of a benchmark circuit and testing on another part of the same circuit while claiming cross-design generalization.
- Reporting only averaged benchmark performance without split disclosure.

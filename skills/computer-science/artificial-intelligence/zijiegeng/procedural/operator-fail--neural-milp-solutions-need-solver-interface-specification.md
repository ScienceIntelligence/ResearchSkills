---
name: "Neural Milp Solutions Need Solver Interface Specification"
memory_type: procedural
subtype: operator-fail
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When a neural method produces candidate solutions for SCIP, Gurobi, or another exact/heuristic MILP solver.

Exclude standalone neural predictors that never interact with a solver.

## Decision
Preferred: specify exactly how generated solutions enter the solver: warm start, incumbent injection, variable fixing, diving heuristic, neighborhood restriction, branching priority, or cut/constraint guidance.

Rejected: saying “then we give it to the solver” without an interface.  
Rejected: evaluating neural solution quality separately while claiming solver acceleration.

Reasoning: the solver interface determines whether learned candidates improve primal bounds, search tree size, runtime, or final optimality.

## Local Verifiers
- Solver API mechanism is named.
- Feasibility repair is described.
- Runtime includes candidate generation and solver use.
- Metrics include primal gap, final objective, node count, or solve time.

## Failure Handling
If generated candidates are often infeasible, add repair or use them as variable priors instead of incumbents.

If candidates are feasible but do not speed solving, test whether they improve initial primal bound or merely duplicate solver heuristics.

## Anti-exemplars
- Reporting neural prediction accuracy without solver runtime.
- Feeding rounded solutions to a solver but not checking whether they are accepted as incumbents.

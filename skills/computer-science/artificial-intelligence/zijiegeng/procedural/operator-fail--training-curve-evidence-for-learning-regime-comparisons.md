---
name: "Training Curve Evidence For Learning Regime Comparisons"
memory_type: procedural
subtype: operator-fail
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When comparing supervised, unsupervised, and semi-supervised training strategies.

Exclude single-method papers that make no claim about training-regime superiority.

## Decision
Preferred: show training curves, convergence speed, and labeled-data usage for each training regime.

Rejected: comparing only final test metrics.  
Rejected: claiming semi-supervised efficiency without reporting labeled data volume.

Reasoning: the scientific distinction among supervised, unsupervised, and semi-supervised methods is often about optimization dynamics and annotation efficiency, not only final performance.

## Local Verifiers
- Loss or validation curves for each regime.
- Number of labeled examples used.
- Convergence speed or compute budget.
- Final performance under comparable training budgets.

## Failure Handling
If curves are noisy, report smoothed curves plus variance across seeds.

If full curves are unavailable, report checkpoints at fixed compute or epoch intervals.

## Anti-exemplars
- “Semi-supervised works better” without labeled-data count.
- “Unsupervised converges faster” without convergence curves.

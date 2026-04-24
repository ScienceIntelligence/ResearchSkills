---
name: "Semi Supervised Claims Require Label Budget Accounting"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## When + Exclusions
When a method claims benefits from semi-supervised learning.

Exclude methods that merely use unlabeled data as pretraining without making a semi-supervised claim.

## Decision
Preferred: report labeled-data amount, unlabeled-data amount, training schedule, and performance as a function of label budget.

Rejected: saying “semi-supervised” without specifying how much supervision was used.  
Rejected: reporting only the best label-budget point.

Reasoning: the main value of semi-supervised learning is label efficiency. Without label-budget accounting, the claim is not scientifically testable.

## Local Verifiers
- Labeled/unlabeled split is stated.
- Performance under multiple label fractions is shown.
- Training curve or convergence behavior is included.
- Fully supervised and unsupervised endpoints are compared.

## Failure Handling
If only one label fraction was run, weaken the claim and add it as a limitation.

If performance improves only at high label fractions, reframe as data augmentation or regularization rather than label efficiency.

## Anti-exemplars
- “We use semi-supervised learning and get better results,” with no label-count table.
- Comparing semi-supervised training against an undertrained supervised baseline.

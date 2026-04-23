---
name: "Auc Computation With Masked Matrix Data"
memory_type: procedural
subtype: constraint-failure
domain: statistics
subdomain: methodology
contributor: ergan-shang
---
## When
Computing AUC from matrices with NaNs and train/test masks.

## Decision
**Preferred**
Flatten only valid entries using mask before AUC.

**Rejected**
- Passing full matrices directly
- Ignoring NaNs

**Reasoning**
AUC requires paired (score, label) vectors; masking ensures valid comparisons.

## Local Verifiers
- `len(y_true_use) == len(y_score_use)`
- No NaNs in inputs

## Failure Handling
If AUC undefined → check class imbalance after masking.

## Anti-exemplars
- Computing AUC on raw matrix
- Including NaNs implicitly

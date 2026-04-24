---
name: "Cross Validation By Column Masking In Rasch"
memory_type: procedural
subtype: constraint-failure
domain: statistics
subdomain: machine-learning
contributor: ergan-shang
---
## When
Performing cross-validation where entire columns (items) are held out rather than random entries.

## Decision
**Preferred**
Interpret learned `z` as **latent difficulty conditional on observed subset**, not absolute.

**Rejected**
- Treating `z` across folds as directly comparable
- Assuming unseen columns have meaningful embeddings

**Reasoning**
Column-wise removal breaks identifiability alignment across folds. Each fold learns a different latent coordinate system.

## Local Verifiers
- Check if `z` shifts across folds (it will)
- Evaluate only predictive metrics, not parameter comparability

## Failure Handling
If comparability is required:
- Anchor with shared items
- Or align via post-hoc transformation

## Anti-exemplars
- Averaging `z` across folds
- Interpreting unseen columns’ latent values as meaningful

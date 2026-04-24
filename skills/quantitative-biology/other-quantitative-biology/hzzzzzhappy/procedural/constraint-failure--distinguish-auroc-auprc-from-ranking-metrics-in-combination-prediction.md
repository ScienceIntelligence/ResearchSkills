---
name: "Distinguish Auroc Auprc From Ranking Metrics In Combination Prediction"
memory_type: procedural
subtype: constraint-failure
domain: quantitative-biology
subdomain: other-quantitative-biology
contributor: hzzzzzhappy
---
## When + Exclusions
When AUROC and AUPRC are high but MRR and recall@K are unexpectedly low in drug-combination or candidate-ranking experiments.

Exclude ordinary binary classification settings where there is no query-wise ranking interpretation.

## Decision
Preferred: diagnose whether the metric is query-wise ranking over many candidates, not whether the classifier separates positives and negatives globally.

Rejected: assuming high AUROC/AUPRC should automatically imply high MRR.

Reasoning: AUROC/AUPRC can be strong under balanced or sampled positive-negative classification, while MRR depends on whether the first relevant candidate appears near the top within each query group.

## Local Verifiers
- Check the query definition used for MRR.
- Count positives per query.
- Inspect whether evaluation uses sampled negatives or all candidates.
- Compare rank distributions for positives even when probability calibration looks good.

## Failure Handling
If MRR is low but AUROC/AUPRC are high, do not immediately change the model. First audit candidate grouping, negative sampling, and whether multiple positives per query are handled consistently.

## Anti-exemplars
- Reporting one global MRR over all samples without query grouping.
- Changing the metric to “first positive only” solely to make results look higher.
- Treating MRR as equivalent to AUPRC.

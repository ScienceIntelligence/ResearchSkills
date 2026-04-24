---
name: "Graph Guided Spatial Programs Need Uq"
memory_type: procedural
subtype: tie
domain: quantitative-biology
subdomain: genomics
contributor: Jamesyu420
---
## When + Exclusions
Use when designing spatial gene-program discovery methods that combine neighborhood structure, gene networks, or spatially variable gene detection.

Exclude purely descriptive pathway enrichment after a fixed analysis.

## Decision
**Preferred:** Combine spatial coherence, graph/network priors, and uncertainty quantification.

**Rejected:** Plain PCA/NMF when the claim is spatially coherent or network-guided program discovery.

**Reasoning:** Prior ideation linked mNSF/Neighborhood NMF, Bayesian nonnegative factorization, and network-assisted regularization as a way to stabilize spatial program discovery and improve biological interpretability.

## Local Verifiers
- Spatial neighborhood penalty or prior present?
- Gene network prior affects loadings or selection?
- Posterior variance or credible intervals available?
- Spatial coherence is evaluated, not only reconstruction.
- SVG or pathway recovery is externally checked.

## Failure Handling
If graph priors dominate:
- tune prior strength;
- compare no-graph and graph-guided variants;
- assess false positives in network hubs;
- report uncertainty for program membership.

## Anti-exemplars
- Applying NMF and then calling top genes “spatial” without spatial dependence.
- Using a gene network only for post hoc annotation while claiming network-guided inference.

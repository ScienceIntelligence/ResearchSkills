---
name: "Do Not Overclaim Biological Priors When Features Are Random Or Simplified"
memory_type: procedural
subtype: constraint-failure
domain: quantitative-biology
subdomain: other-quantitative-biology
contributor: hzzzzzhappy
---
## When + Exclusions
When revising method text after replacing pretrained or biologically designed features with random initialization or simplified features.

Exclude experiments that still use validated biological encoders as the main feature source.

## Decision
Preferred: describe the model in architecture-level terms and avoid claiming biological representation learning if the features are randomly initialized or deliberately stripped of special design.

Rejected: keeping claims about rich biological initialization after removing those features.

Reasoning: feature-source claims affect the scientific interpretation of performance; overstating biological priors can mislead readers about where gains come from.

## Local Verifiers
- Check whether small-molecule, protein, or disease features are pretrained or random.
- Ensure the method section matches the actual feature initialization.
- Move biological encoder claims to an ablation or previous-version description if no longer used.

## Failure Handling
If the paper already contains biological feature language, revise the claims before finalizing results tables.

## Anti-exemplars
- Saying “biological representation learning” when all entity features are random.
- Claiming disease semantic embeddings if disease names are not encoded.
- Mixing old feature descriptions with new ablation settings.

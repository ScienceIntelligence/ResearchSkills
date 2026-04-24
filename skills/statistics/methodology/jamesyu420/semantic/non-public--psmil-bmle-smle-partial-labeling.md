---
name: "Psmil Bmle Smle Partial Labeling"
memory_type: semantic
subtype: non-public
domain: statistics
subdomain: methodology
contributor: Jamesyu420
---
## Fact
The user’s Gaussian-mixture-based MIL framework for weakly supervised metastasis detection uses:
- slide-level bag labels;
- a subset of selectively labeled patches;
- bag-based maximum likelihood estimation (BMLE);
- subsampling-based maximum likelihood estimation (SMLE).

SMLE was described as improving both slide-level and instance-level prediction and being robust under model misspecification.

## Evidence
Prior conversations described partially subsampled MIL / PSMIL for WSI metastasis detection, BMLE/SMLE estimation, theory, simulations, and CAMELYON16-style application.

## LLM Default Belief
Not applicable; subtype is non-public.

## Expiry Signal
Update if selective patch labels are removed, if the likelihood is no longer Gaussian-mixture-based, or if the method changes from MLE to neural end-to-end training.

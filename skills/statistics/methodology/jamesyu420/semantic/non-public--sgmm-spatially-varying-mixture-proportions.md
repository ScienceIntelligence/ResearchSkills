---
name: "Sgmm Spatially Varying Mixture Proportions"
memory_type: semantic
subtype: non-public
domain: statistics
subdomain: methodology
contributor: Jamesyu420
---
## Fact
The user’s SGMM for WSI clustering models each image instance as a feature vector conditional on a random spatial location, allowing Gaussian mixture probabilities to vary nonparametrically with spatial location.

The methodological purpose is to capture spatially structured tissue clusters while retaining interpretable Gaussian components.

Inference was discussed through EM-type procedures, with asymptotic theory and validation through simulations and CAMELYON16 application.

## Evidence
Prior research memory described SGMM for unsupervised WSI clustering in breast cancer, spatially varying mixing probabilities, novel EM algorithms, rigorous asymptotic theory, simulations, and CAMELYON16.

## LLM Default Belief
Not applicable; subtype is non-public.

## Expiry Signal
Update if the mixture components become non-Gaussian, if spatial variation is parameterized rather than nonparametric, or if the method becomes supervised rather than unsupervised clustering.

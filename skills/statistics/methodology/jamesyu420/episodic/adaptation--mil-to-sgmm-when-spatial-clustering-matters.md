---
name: "Mil To Sgmm When Spatial Clustering Matters"
memory_type: episodic
subtype: adaptation
domain: statistics
subdomain: methodology
contributor: Jamesyu420
---
## Situation
Gaussian-mixture-based MIL was effective for weakly supervised WSI classification but did not fully exploit spatial tissue structure.

## Action
The research direction adapted from MIL classification to a semiparametric Gaussian mixture model for WSI clustering, where mixing probabilities vary nonparametrically with spatial location.

## Outcome
SGMM preserved the interpretability of Gaussian components while better capturing spatial clustering and tumor localization within a WSI.

## Lesson
When MIL succeeds at slide-level prediction but fails to represent spatial tissue organization, move from bag-level mixture classification toward spatially varying mixture proportions.

## Retrieval Cues
“MIL limitation spatial clustering”; “SGMM”; “mixing probabilities vary nonparametrically with spatial location”; “CAMELYON16”; “tumor localization”.

---
name: lightweight-classifier-over-finetuning-for-foundation-embeddings
memory_type: procedural
subtype: tie
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## When
Building a domain application pipeline over a pretrained Earth foundation model (AlphaEarth, PRITHVI) for land cover change detection, with limited labeled training data and no GPU infrastructure.
## Decision
Preferred: Lightweight classifiers (k-Nearest Neighbors, linear classifiers / linear probes) over the frozen embeddings — require minimal training samples, no retraining from scratch, run entirely within Google Earth Engine and a browser front end, reproducible as Earth Engine scripts.
Rejected: Fine-tuning the foundation model itself for a hackathon or domain-application toolkit — requires GPU, destroys reusability, breaks reproducibility across user environments.
Reasoning: The value proposition of foundation models is the frozen embedding; fine-tuning is only justified when lightweight probes hit a ceiling.
## Local Verifiers
- Classifier trains in <1 minute; entire pipeline runs in-browser.
- kNN / linear probe accuracy matches or exceeds baseline for the target task.

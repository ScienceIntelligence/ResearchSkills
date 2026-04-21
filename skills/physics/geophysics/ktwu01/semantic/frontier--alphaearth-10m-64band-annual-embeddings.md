---
name: alphaearth-10m-64band-annual-embeddings
memory_type: semantic
subtype: frontier
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## Fact
AlphaEarth, developed by Google DeepMind, is an Earth foundation model providing 10-meter resolution, 64-band annual embeddings spanning 2017–2024, trained on over 3 billion multi-modal observations (satellite, radar, LiDAR, climate). Embeddings are 8-bit quantized, served through Google Earth Engine. Supports aggregation to coarser resolutions (20m, 1000m) while preserving meaning. Handles missing data automatically. Supports both supervised and unsupervised change detection. Current limitation: annual temporal resolution only (no sub-annual embeddings in the public release as of 2026-03).
## Evidence
AlphaEarth Google Earth Engine assets; KW's hackathon and HydroML 2026 toolkit work.
## Expiry Signal
If Google DeepMind releases sub-annual (monthly/quarterly) AlphaEarth embeddings or a higher-resolution variant, update temporal-resolution claim.

---
name: ocean-color-vs-land-surface-products-for-coastal-turbidity
memory_type: procedural
subtype: constraint-failure
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## When
Selecting a NASA remote-sensing product for coastal water quality (turbidity, chlorophyll-a) validation in nearshore/estuarine settings (e.g., Aransas Bay, Texas coast).
## Decision
Reject products whose name contains "Land Surface" or "Vegetation", whose primary bands are NIR/SWIR (>750 nm) without blue/green, whose spatial resolution exceeds 500 m for coastal stations, that lack atmospheric correction for water surfaces, or provide only Case-1 (open ocean) algorithms. Prioritize products explicitly labeled "Ocean Color" or "Aquatic Science", with blue (~480 nm) and green (~560 nm) bands, <100 m resolution with water-optimized processing, and published coastal turbidity studies citing the product. Landsat 8/9 Collection 2 Level-2 Surface Reflectance is a strong candidate (30 m resolution, coastal 443 nm + blue 482 nm + green 561 nm + red 655 nm; GEE asset LANDSAT/LC08/C02/T1_L2).
## Local Verifiers
- Product passes blue/green band check.
- Published literature demonstrates r > 0.5 for turbidity/chlorophyll in coastal waters.
- >500 cloud-free matchups achievable over the NERRS data period (2013–2025).
## Failure Handling
If MODIS products appear in default search results: they are optimized for land or open ocean, not coastal pixels with land contamination — reject regardless of temporal coverage.

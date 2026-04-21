---
name: gmd-vs-james-vs-ai-venue-for-ai-agents-for-esm
memory_type: procedural
subtype: tie
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## When
Deciding where to submit an AI-agent or MCP framework built for Earth system / land surface model development (e.g., Noah-Agent, ESM-bench).
## Decision
Preferred routing by emphasis: Geoscientific Model Development (GMD) if the contribution is a model development tool/methodology with concrete Noah-MP/CESM application (safest, establishes geoscience credibility). JAMES if there's a genuine scientific discovery (e.g., AI-discovered parameterization improves flux predictions). Environmental Modelling & Software if the contribution is software architecture / design patterns. AI venues (NeurIPS, ICML, ICLR) only if positioning as a novel AI framework (not a benchmark), because AI reviewers do not reward domain application papers.
Rejected: Pure benchmark papers at AI venues for domain application work — they want framework/system-design novelty over using base models.
Reasoning: Framing as "framework for complex computational model interaction" outperforms "benchmark for LLMs on scientific code" at AI venues.
## Local Verifiers
- GMD review cycle includes geoscience domain expertise.
- JAMES demands a scientific discovery claim beyond engineering.

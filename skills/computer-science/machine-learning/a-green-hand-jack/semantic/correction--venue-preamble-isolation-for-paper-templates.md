---
name: "Venue Preamble Isolation For Paper Templates"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: machine-learning
contributor: a-green-hand-jack
---

# Venue Preamble Isolation For Paper Templates

## Fact

For reusable LaTeX paper templates across ML and computer-science venues, venue-specific style loading should be isolated in a generated `venue_preamble.tex` or equivalent central file, while `main.tex` should input that file and remain stable across anonymous, preprint, and camera-ready modes.

## Evidence

Conference style files vary by venue and year: NeurIPS, ICML, ICLR, CVPR, ICCV, ACL-family, ECCV, and ACM use different package names, bibliography styles, author macros, and review/final options. Centralizing the venue style switch prevents repeated edits to the main paper body and makes mode changes auditable.

This pattern also localizes fixes for venue-specific conflicts such as duplicate `cleveref` loading, legacy `algorithmic` conflicts with `algpseudocode`, and class-specific citation behavior.

## LLM Default Belief

LLMs often suggest placing `\usepackage{<venue>}` directly in `main.tex` and editing that line whenever the target venue or submission mode changes. That works for one paper but is brittle for reusable templates because anonymous, arXiv, and camera-ready mode changes become scattered and easy to miss.

## Expiry Signal

Revisit this if major venues standardize style loading through a common package manager or if the target project intentionally supports only one venue and one submission mode.

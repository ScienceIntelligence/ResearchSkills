---
name: your-skill-name
memory_type: semantic
subtype: correction                            # frontier | non-public | correction
domain: physics                                # physics | mathematics | computer-science | quantitative-biology | statistics | eess | economics | quantitative-finance
subdomain: geophysics                          # arXiv-aligned subdomain (see skills/<domain>/ for options)
contributor: your-github-username
---

<!--
  SEMANTIC SKILL TEMPLATE
  ───────────────────────
  Semantic skills capture domain facts that LLMs don't reliably know.
  They correct model blind spots with evidence-backed knowledge.

  Subtypes:
    frontier    — Post-training-cutoff knowledge that doesn't exist in model weights
    non-public  — Lab-internal or unpublished knowledge, never in any training corpus
    correction  — LLM actively gets this wrong — confident but incorrect default belief

  File placement:
    skills/<domain>/<subdomain>/<contributor>/<memory_type>/<subtype>--<skill-name>.md
    Example: skills/physics/geophysics/jdoe/semantic/correction--lsm-grid-resolution-is-a-design-choice.md

  Instructions:
    1. Fill in all frontmatter fields above.
    2. Complete each section below. Be precise and cite evidence.
    3. The "LLM Default Belief" section is only required for the `correction` subtype.
    4. Delete these comment blocks before submitting.
-->

## Fact
<!-- REQUIRED -->
<!-- The core claim. State it precisely and unambiguously.
     Include quantitative details where possible. -->

## Evidence
<!-- REQUIRED -->
<!-- How you know this is true.
     Cite papers, experiments, direct observation, or domain expertise.
     Be specific enough that a reviewer can verify. -->

## LLM Default Belief
<!-- REQUIRED for `correction` subtype only. DELETE this section for `frontier` and `non-public`. -->
<!-- What does the AI wrongly think? Describe the specific misconception
     and why it's prevalent in training data. -->

## Expiry Signal
<!-- REQUIRED -->
<!-- When should this skill be revisited or retired?
     What would change to make this fact outdated? -->

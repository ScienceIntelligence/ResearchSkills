---
name: your-skill-name
memory_type: episodic
subtype: failure                               # failure | adaptation | anomalous
domain: physics                                # physics | mathematics | computer-science | quantitative-biology | statistics | eess | economics | quantitative-finance
subdomain: geophysics                          # arXiv-aligned subdomain (see skills/<domain>/ for options)
contributor: your-github-username
---

<!--
  EPISODIC SKILL TEMPLATE
  ───────────────────────
  Episodic skills capture concrete research episodes as situation-action-outcome triples.
  Dead ends and failures are often the most valuable — they prevent others from repeating mistakes.

  Subtypes:
    failure    — Attempted X, failed due to hidden reason Y
    adaptation — Standard method failed, workaround Z succeeded
    anomalous  — Expected A, observed B — turned out important

  File placement:
    skills/<domain>/<subdomain>/<contributor>/<memory_type>/<subtype>--<skill-name>.md
    Example: skills/physics/geophysics/jdoe/episodic/failure--gradient-explosion-under-fp16.md

  Instructions:
    1. Fill in all frontmatter fields above.
    2. Complete each section below. Favor specificity over generality — include exact
       tool names, library versions, parameter values, hardware specs, error messages.
    3. Delete these comment blocks before submitting.
-->

## Situation
<!-- REQUIRED -->
<!-- Be specific: what tools/libraries/hardware were involved? What dataset and parameters?
     What stage of the project? What did you expect to happen? -->

## Action
<!-- REQUIRED -->
<!-- What you actually did — include specific tool names, commands, parameter values,
     library versions, and the reasoning behind each choice. -->

## Outcome
<!-- REQUIRED -->
<!-- Concrete result — metrics, error messages, unexpected behavior.
     Quantify where possible (e.g., "loss dropped from 2.3 to 0.8" not "loss improved"). -->

## Lesson
<!-- REQUIRED -->
<!-- The key insight. State as a specific IF-THEN rule with conditions, not a vague principle.
     E.g., "IF using Adam with fp16 AND loss spikes after epoch 3-5 THEN raise eps to 1e-5." -->

## Retrieval Cues
<!-- REQUIRED -->
<!-- When should an AI agent recall this episode?
     List specific trigger conditions, one per line — tool names, error patterns,
     parameter ranges, dataset characteristics. -->

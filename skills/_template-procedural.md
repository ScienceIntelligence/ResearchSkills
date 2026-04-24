---
name: your-skill-name
memory_type: procedural
subtype: tie                                   # tie | no-change | constraint-failure | operator-fail
domain: physics                                # physics | mathematics | computer-science | quantitative-biology | statistics | eess | economics | quantitative-finance
subdomain: geophysics                          # arXiv-aligned subdomain (see skills/<domain>/ for options)
contributor: your-github-username
---

<!--
  PROCEDURAL SKILL TEMPLATE
  ─────────────────────────
  Procedural skills capture IF-THEN decision rules for navigating research impasses.
  They encode the tacit judgment calls that experienced researchers make when stuck.

  Subtypes:
    tie              — Multiple viable paths, unclear which to choose
    no-change        — Completely stuck, no candidate action
    constraint-failure — A methodological assumption turns out to be violated
    operator-fail    — Correct approach selected but execution fails

  File placement:
    skills/<domain>/<subdomain>/<contributor>/<memory_type>/<subtype>--<skill-name>.md
    Example: skills/physics/geophysics/jdoe/procedural/tie--exploiting-cross-domain-concepts.md

  Instructions:
    1. Fill in all frontmatter fields above.
    2. Complete each section below. Be specific — include tool names, parameter values, library versions.
    3. Delete these comment blocks before submitting.
-->

## When
<!-- REQUIRED -->
<!-- Precise trigger conditions: when does this impasse arise?
     Include exclusions — situations that look similar but where this skill does NOT apply. -->

## Decision
<!-- REQUIRED -->
<!-- What to do:
     Preferred: [the recommended action and why]
     Rejected: [alternatives you considered and why they were rejected]
     Reasoning: [the mechanism — why does the preferred action work?] -->

## Local Verifiers
<!-- REQUIRED -->
<!-- How to check if the approach is working.
     Concrete diagnostics: metric thresholds, commands to run, patterns to look for. -->

## Failure Handling
<!-- REQUIRED -->
<!-- What to do if the preferred action doesn't work.
     Next steps, fallback strategies, escalation criteria. -->

## Anti-exemplars
<!-- RECOMMENDED -->
<!-- When NOT to use this skill. Situations that superficially match the trigger
     but where applying this decision would be wrong. -->

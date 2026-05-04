---
name: fixed-effects-can-destroy-identification-when-within-firm-signal-is-thin
memory_type: episodic
subtype: anomalous
domain: computer-science
subdomain: artificial-intelligence
contributor: Clarence-ZheWang
source:
  type: session
  session_id: 46c52787-1634-4c89-8dad-32649e27ae5a
extracted_at: 2026-04-24
tags: [panel-data, fixed-effects, identification, nonlinear-effects, model-selection]
---

## Situation
A panel study tested an inverted-U relationship using firm-year data. The researcher initially considered firm fixed effects as the strongest specification.

## Action
The analysis compared pooled/industry-year style models against firm fixed effects and inspected within-firm variation in the key regressor.

## Outcome
The theoretically expected nonlinear effect appeared in less restrictive models but disappeared under firm fixed effects because the main regressor had weak within-firm movement. The session then treated industry fixed effects plus year fixed effects as the main empirical design.

## Lesson
Do not assume firm fixed effects are automatically the "best" choice. If the key explanatory variable is largely cross-sectional and barely moves within firms, firm fixed effects can absorb most identifying variation and mechanically erase the effect of interest.

## Retrieval Cues
Use when:
- A panel paper's core variable is built from hiring, skills, or other slow-moving strategic allocations.
- The main effect is significant in pooled/industry models but vanishes under firm FE.
- The research question is about comparative allocation across firms rather than short-run within-firm adjustment.


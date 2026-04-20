---
name: "Incomplete archived simulations can masquerade as scientific disagreement in cross-version validation"
memory_type: episodic
subtype: anomalous
domain: computer-science
subdomain: computational-engineering-finance-and-science
contributor: ktwu01
source:
  type: session
  session_id: 019d8a12-3d44-7bb2-968a-07096109e24e
extracted_at: 2026-04-20
---

## Situation
A supposedly exact-settings archive was being used as the scientific reference for cross-version validation.

## Action
The investigator checked time coverage, file presence, and alignment against the legacy experiment instead of trusting the archive label.

## Outcome
The archive turned out to be truncated and therefore unsuitable as evidence. A different full-period artifact provided the valid basis for comparison.

## Lesson
Before drawing scientific conclusions from archived model outputs, verify temporal completeness and alignment explicitly. Naming conventions and prior documentation are not reliable provenance.

## Retrieval Cues
- A “same settings” archive gives unexpectedly few timesteps.
- Statistics look plausible but come from mismatched time spans.
- The validation story depends on an old run directory whose provenance is unclear.


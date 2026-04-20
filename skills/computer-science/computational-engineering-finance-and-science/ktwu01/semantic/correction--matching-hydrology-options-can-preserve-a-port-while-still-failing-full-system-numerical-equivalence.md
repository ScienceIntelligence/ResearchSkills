---
name: "Matching hydrology options can preserve a port while still failing full-system numerical equivalence"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: computational-engineering-finance-and-science
contributor: ktwu01
source:
  type: session
  session_id: 019d8a12-3d44-7bb2-968a-07096109e24e
extracted_at: 2026-04-20
---

## Fact
In this session, forcing the newer branch to use the same runoff settings as the legacy branch did not make the full end-to-end outputs numerically identical, even though the isolated plant-hydraulics implementation had already been shown to be faithful.

## Evidence
The investigation established three points in sequence: the core hydraulics and soil-water equations matched; the initial branch comparison was confounded by runoff-option mismatch; and after switching to a full-period exact-settings artifact, several key fluxes and states still differed.

## LLM Default Belief
“If the ported equations are identical and the options are matched, the branch outputs should become identical.”

## Expiry Signal
Expire this skill if a later controlled experiment with verified provenance and full-period alignment demonstrates bitwise or near-bitwise equivalence under the matched settings.


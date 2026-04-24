---
name: "Cardiac tissue limit cycle is pacing-site-specific"
memory_type: semantic
subtype: correction
domain: physics
subdomain: medical-physics
contributor: WangMengxiao319
source:
  type: session
  session_id: 72034165-6cbb-4242-9aa6-c4ef64441417
extracted_at: 2026-04-24
tags: [cardiac-ep, varp, forcepss, limit-cycle, opencarp, pacing]
---

## Fact
In cardiac electrophysiology simulation frameworks (e.g., ForCEPSS/openCARP), the tissue limit cycle — the steady-state electrophysiological state (APD, conduction velocity) — is **pacing-site-specific**, not a mesh-wide universal property. On the same mesh, each distinct pacing electrode location requires its own independent limit cycle computation before VARP induction can proceed.

## Evidence
During a ForCEPSS VARP workflow session, the user explicitly asked: "If I switch pacing sites, do I need to recompute the tissue limit cycle for each?" The confirmed answer was yes, because the steady-state activation sequence (and hence local APD/CV convergence) depends on where the S1 stimulus originates, not just the tissue geometry. ForCEPSS stores limit cycle outputs per protocol tag (e.g., `lcP0`, `lcP1`...) precisely because these differ per electrode.

## LLM Default Belief
LLMs may assume tissue steady state is a global mesh property (like fiber orientation or fibrosis) that can be computed once and reused across all pacing configurations. This is incorrect for electrophysiological steady state.

## Expiry Signal
Workflow would change if ForCEPSS implements global (site-independent) steady-state preconditioning, or if solvers support rapid re-equilibration from a shared reference state.


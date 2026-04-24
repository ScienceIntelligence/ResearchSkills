---
name: "VARP checkpoint reuse to skip S1 re-simulation"
memory_type: procedural
subtype: tie
domain: physics
subdomain: medical-physics
contributor: WangMengxiao319
source:
  type: session
  session_id: 72034165-6cbb-4242-9aa6-c4ef64441417
extracted_at: 2026-04-24
tags: [cardiac-ep, varp, opencarp, checkpoint, s1s2-protocol, simulation-efficiency]
---

## When
Designing a VARP S1-S2 protocol sweep across multiple coupling intervals (CIs) in openCARP, where S1 pacing (N beats at PCL) must precede each S2 test stimulus.

**Exclusions:** Does not apply when the S1 beat count is itself a variable under study, or when tissue state heterogeneity during S1 ramp-up is scientifically relevant.

## Decision

**Preferred:** Store a `.roe` statefile checkpoint at the end of S1 pacing (e.g., `tstamp_1200.0.roe` after 2 × 600ms). For all S2 sweeps, load this checkpoint via `start_statef` and apply only the S2 stimulus. This eliminates redundant S1 re-simulation for every CI.

**Extreme case:** If the checkpoint already captures the fully converged limit-cycle state (i.e., the tissue reached steady state during prepacing), 0 additional S1 beats + 1 S2 is sufficient.

**Rejected:** Re-running full S1 pacing before each S2 coupling interval — this is computationally wasteful and produces no additional scientific value once steady state is confirmed.

**Reasoning:** The `.roe` checkpoint encodes the complete cellular state vector (Vm + all gating variables). Loading it is equivalent to having just completed S1; subsequent simulation sees identical initial conditions.

## Local Verifiers
- Confirm the checkpoint timestamp matches expected S1 end time
- Verify CV and APD in a short test run from the checkpoint match the converged limit-cycle values

## Failure Handling
- If S2 induction results appear inconsistent across CIs: check whether the checkpoint was saved before full CV convergence (limit cycle not yet reached at that timestamp)
- If `start_statef` parameter is unrecognized: verify openCARP version supports statefile loading; consult carputils `planio.py` for correct JSON key

## Anti-exemplars
- Running 8 full S1 beats before every single S2 test in a 50-CI sweep (wastes ~8× compute per CI)
- Sharing one checkpoint across different pacing sites (incorrect — each site has its own limit cycle)


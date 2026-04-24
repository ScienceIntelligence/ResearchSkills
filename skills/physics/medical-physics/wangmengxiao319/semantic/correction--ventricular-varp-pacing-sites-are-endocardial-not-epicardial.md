---
name: "Ventricular VARP pacing sites are endocardial, not epicardial"
memory_type: semantic
subtype: correction
domain: physics
subdomain: medical-physics
contributor: WangMengxiao319
source:
  type: session
  session_id: 72034165-6cbb-4242-9aa6-c4ef64441417
extracted_at: 2026-04-24
tags: [cardiac-ep, varp, ventricular-activation, anatomy, pacing-site]
---

## Fact
In ventricular VARP simulations, S1 pacing electrodes should be placed on the **endocardium** (inner surface), not the epicardium. Normal ventricular activation propagates from endocardium outward via the Purkinje network. For ischemic cardiomyopathy studies specifically, endocardial sites are the physiologically correct choice.

## Evidence
During a VARP documentation review session, the assistant initially wrote "epicardium" as the activation start point and was corrected by the researcher. The corrected explanation: normal excitation enters the ventricle via Purkinje fibers terminating at the endocardial surface, then propagates transmurally toward the epicardium.

## LLM Default Belief
LLMs may conflate "outer/accessible surface" with "epicardium" and suggest epicardial pacing as a default, or may not distinguish between endo/epi for virtual electrode placement. The correction matters because endo-epi propagation direction affects reentry induction vulnerability windows.

## Expiry Signal
Remains valid for standard ventricular EP simulation; would change only for explicitly epicardial pacing studies (e.g., CRT device modeling) where epicardial placement is intentional.


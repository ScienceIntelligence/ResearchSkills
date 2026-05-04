---
name: "AI incident theory requires an adversarial-intent dimension"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: artificial-intelligence
contributor: Clarence-ZheWang
source:
  type: session
  session_id: 9df63db6-f6f1-48dc-81b1-b89203c595ff
extracted_at: 2026-04-24
---

## Fact
A safety-only reading of AI incidents is incomplete. In this session, the paper’s core theoretical revision was that classic safety theories explain accidental failure, but AI incident corpora also contain harms shaped by deliberate misuse or exploitation. That requires an additional adversarial-intent or adversarial-opportunity dimension bridging safety and security reasoning.

## Evidence
The conversation repeatedly reworked the paper’s contribution away from simple “theory stacking.” The final conceptual move was to treat intentionality as the missing axis that safety theories alone do not model, motivating a safety-security bridge rather than a pure accident framework.

## LLM Default Belief
“AI incidents can be handled by importing established accident/reliability theories and adding more cases.”

## Expiry Signal
Retire or weaken this skill if:
- the target corpus is explicitly restricted to non-malicious failures, or
- mainstream AI risk literature starts treating safety and adversarial misuse as already-integrated baseline theory rather than a missing bridge.


---
name: "Multi-View Human Alignment Can Increase Variance Without Moving the Mean Much"
memory_type: semantic
subtype: non-public
domain: computer-science
subdomain: computer-vision-and-pattern-recognition
contributor: xisen-w
source:
  type: session
  session_id: 019c0c69-acff-79a0-be36-a313732469e2
extracted_at: 2026-04-24
---

## Fact
In this session's human-study analysis, the front-view and multi-view conditions were close in mean alignment, with a mean difference of about `0.017`, while participant-level differences had noticeably larger spread (`std_diff` about `0.085`). The front-view distribution was tighter, while the multi-view condition showed a wider IQR.

## Evidence
The session computed:
- `n_participants = 21`
- `mean_diff = 0.0172619`
- `std_diff = 0.0847331`
- front summary around `mean = 0.62`, `std = 0.057`, `IQR = (0.600, 0.637)`
- multi summary with wider spread, `IQR = (0.500, 0.700)`

## Expiry Signal
Expire this memory if:
- The participant pool changes.
- The scoring rubric is recomputed.
- Per-condition summaries are regenerated from a different questionnaire version.


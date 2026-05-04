---
name: "Rebalance benchmark datasets by subdimension, not by total item count"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: artificial-intelligence
contributor: Clarence-ZheWang
source:
  type: session
  session_id: 0463ad38-f278-4c72-bf49-c54b2e8f56c1
extracted_at: 2026-04-24
---

## Fact
For management-capability evaluation, a dataset can look large yet still be methodologically weak if one subdimension dominates the item pool. In this session, a heavily overrepresented project-management subdimension had to be downsampled while sparse subdimensions were actively supplemented, yielding a much smaller but more balanced benchmark.

## Evidence
The workflow explicitly moved from a larger, skewed pool to an approximately 1000-item balanced set, then to an 80-item evaluation subset with equal allocation across 16 subdimensions. The key operation was redistribution across constructs, not maximizing raw volume.

## LLM Default Belief
A larger benchmark is automatically better, and more items from the richest source improve evaluation quality.

## Expiry Signal
This memory should be revised if later validation shows that unequal weighting is preferable for the target scientific claim, such as when the benchmark is intentionally prevalence-weighted rather than construct-balanced.


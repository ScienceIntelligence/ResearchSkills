---
name: "Contamination-Aware Benchmark Interpretation for Management QA"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: artificial-intelligence
contributor: Clarence-ZheWang
source:
  type: session
  session_id: 019d67d2-6b02-7d13-a482-5609663d2461
extracted_at: 2026-04-24
---

## Fact
In this management-capability benchmark, high model scores cannot be interpreted as pure managerial reasoning ability because a meaningful share of the PMP-style items appear to be publicly retrievable online with answers or near-verbatim variants.

## Evidence
The session included direct web checks on sampled PMP items from the local dataset, and multiple items were found on public sites with answers. This led to the explicit methodological concern that current scores may partly reflect exposure to public answer keys rather than genuine management judgment.

## LLM Default Belief
LLMs often treat benchmark accuracy on domain MCQs as evidence of domain competence. In this case, that default is unsafe: the benchmark mixes managerial reasoning with prior-publication contamination.

## Expiry Signal
This memory should be revised if a systematic retrieval audit shows the item pool is mostly novel, heavily rewritten, or demonstrably absent from public web sources.


---
name: "Provenance validation when incident-source links are unreachable"
memory_type: episodic
subtype: adaptation
domain: computer-science
subdomain: artificial-intelligence
contributor: Clarence-ZheWang
source:
  type: session
  session_id: 9df63db6-f6f1-48dc-81b1-b89203c595ff
extracted_at: 2026-04-24
---

## Situation
A researcher needed to judge whether an incident dataset was “real enough” for analysis, but direct access to many underlying news URLs was blocked or inconsistent.

## Action
Instead of relying on live source-link reachability, the workflow validated provenance through the database’s official API:
- sampled incident records,
- re-queried the same incidents directly from the source API,
- cross-checked classification records against the same API,
- then checked internal consistency across IDs, titles, dates, and annotation joins.

## Outcome
The dataset became usable for research claims about the database itself, even though external source websites could not be fully revalidated from the current network environment.

## Lesson
For curated incident databases, source authenticity and dataset usability can often be established by official-database reproducibility plus internal consistency, not only by re-opening every cited news URL.

## Retrieval Cues
- “Are these incidents real?”
- “The source links are blocked.”
- “Need to defend database provenance.”
- “Curated public incident repository with API access.”


---
name: "Evidence Backed Work Timeline Blocks"
memory_type: procedural
subtype: tie
domain: computer-science
subdomain: machine-learning
contributor: a-green-hand-jack
---

# Evidence Backed Work Timeline Blocks

## When

Use this when building a retrospective research timeline, mentor update, project progress report, or next-phase plan from git history, project docs, experiment logs, meeting notes, or user-provided context.

Exclude cases where the user explicitly wants a raw commit log or a complete chronological transcript.

## Decision

Preferred: convert raw evidence into a small number of meaningful work blocks. Each block should include project, title, date range, work type, evidence basis, and concrete outcome.

Rejected: map every commit to a separate timeline item or infer a detailed day-by-day plan from sparse evidence.

Reasoning: research progress is usually organized by questions, experiments, debugging episodes, writing phases, and decisions, not by individual commits. Commit history is a useful signal but often misses reading, analysis, failed runs, discussion, and writing.

## Local Verifiers

- Each timeline block cites an evidence basis such as commits, docs, experiment logs, notes, or user context.
- Observed facts are separated from inferred date ranges.
- Multi-project reports keep project boundaries explicit.
- Mentor-facing reports emphasize outcomes and decisions, not raw activity volume.
- Planned work is separated from completed work and includes dependencies or uncertainty when relevant.

## Failure Handling

If git history is sparse, supplement it with docs, notes, experiment logs, or user-provided context instead of pretending commits fully describe the work.

If evidence conflicts, mark the uncertainty in the report and avoid over-precise dates.

If the user asks for forward planning, use milestone-sized blocks with dependencies rather than fabricated daily precision.

## Anti-exemplars

Do not use this to produce compliance-grade timesheets unless exact timestamps and activity records are available.

Do not collapse multiple projects into one timeline without preserving which evidence belongs to which project.

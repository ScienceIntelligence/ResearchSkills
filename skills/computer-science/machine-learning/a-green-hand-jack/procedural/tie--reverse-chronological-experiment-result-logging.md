---
name: "Reverse Chronological Experiment Result Logging"
memory_type: procedural
subtype: tie
domain: computer-science
subdomain: machine-learning
contributor: a-green-hand-jack
---

# Reverse Chronological Experiment Result Logging

## When

Use this when recording new ML experiment results into a paper-side experiment log, research diary, or shared project notes that are meant to support later writing and comparison.

Exclude cases where results are already stored in a structured experiment tracker and the task is only to query that tracker.

## Decision

Preferred: append each experiment batch as a compact structured entry at the top of the log, with date, short title, setup, result, observation, and next experiment.

Rejected: keep results only in terminal logs, chat history, checkpoint names, or chronologically appended notes that require scrolling through stale entries first.

Reasoning: research writing usually needs the latest evidence first. Reverse chronological logging makes recent decisions recoverable while preserving older context, and the fixed fields force the researcher to separate configuration, measured outcome, interpretation, and follow-up.

## Local Verifiers

- The newest entry appears near the top of the experiment log.
- The entry includes setup, measured results, observation, and next step as separate fields.
- The setup includes the method variant, dataset or split, and important config differences from the baseline when known.
- The result field contains concrete metrics rather than only prose.
- The next step is a testable follow-up, not a vague intention.

## Failure Handling

If metrics are spread across logs or output folders, inspect the most recent experiment artifacts and pre-fill the entry, then require human confirmation before writing it into the paper log.

If the paper repository cannot be located automatically, ask for the paper path rather than creating a detached log in the code repository.

If the result interpretation is uncertain, write the observation as a hypothesis and make the next step a discriminating experiment.

## Anti-exemplars

Do not use this for final paper result tables; those need curation, statistical checking, and consistent formatting.

Do not overwrite or reorder older entries unless the user explicitly asks for log cleanup.

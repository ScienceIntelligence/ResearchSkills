---
name: "Evidence Grounding In Experiment Reports"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: machine-learning
contributor: a-green-hand-jack
---

# Evidence Grounding In Experiment Reports

## When

Use this when writing ML experiment reports, mentor updates, paper-result sections, or lab notes from experiment artifacts such as configs, logs, tables, figures, metrics, and informal notes.

Exclude cases where the output is purely a status note with no scientific claim, no comparison, and no decision to support.

## Decision

Preferred: ground every claim in primary evidence before interpreting the result. Record the experiment question, setup, dataset split, method variant, baseline, metrics, random seeds when available, code version, and exact result values before drawing conclusions.

Rejected: write a polished narrative directly from memory, using phrases such as "the method improves" or "the trend suggests" before identifying the baseline and the measured values.

Reasoning: ML experiment reports often fail because they mix observation and interpretation. A reader cannot audit whether a conclusion follows from the evidence if the setup, comparison target, and metric aggregation are missing.

## Local Verifiers

- Check for a concrete experiment question and baseline or control.
- Check whether each headline claim has a metric, figure, table, log, config, run ID, or user-provided note as evidence.
- Check that absolute values and meaningful deltas are both reported when possible.
- Check that observed results appear before interpretation.
- Check that missing seeds, splits, runtime, hardware, or code version are marked as missing rather than invented.

## Failure Handling

If primary evidence is incomplete, write the report with explicit missing-evidence notes and ask only for the smallest clarification needed to make the main conclusion auditable.

If figures or tables are present but ambiguous, describe axes, units, scale, aggregation, and error bars before interpreting the visual pattern.

If the result is negative or inconclusive, preserve the uncertainty and convert the conclusion into a decision rule for the next experiment instead of overstating success.

## Anti-exemplars

Do not use this as a generic writing template for documentation with no experimental claim.

Do not force standard background explanations into the report when the research decision only depends on the setup, comparison, and measured outcome.

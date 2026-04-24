---
name: "Reproducible Job Scripts For ML Experiments"
memory_type: procedural
subtype: no-change
domain: computer-science
subdomain: machine-learning
contributor: a-green-hand-jack
---

# Reproducible Job Scripts For ML Experiments

## When

Use this before launching ML training, evaluation, ablations, or sweeps on local machines, SLURM clusters, or Kubernetes-style GPU platforms.

Exclude one-off exploratory shell commands where no result will be compared, reported, or reused.

## Decision

Preferred: materialize a committed job script before submission. The script should capture the project root, git commit, environment activation, scheduler resources, log directory, output directory, and exact run command.

Rejected: submit long interactive shell commands directly to the scheduler and rely on shell history or queue metadata to reconstruct the experiment later.

Reasoning: scheduler records are volatile and often omit the scientific context. A saved job script creates an audit trail for the run and lets later reports distinguish code state, resource allocation, command line, and output location.

## Local Verifiers

- The job script records a short git commit hash or explicitly says that the run was outside git.
- Logs and outputs are written under predictable experiment-specific directories.
- The resource request is explicit: GPU count, CPU count, memory, walltime, partition or queue, and container image when applicable.
- Environment activation is visible in the script.
- The submit command can be copied and rerun without relying on hidden interactive state.

## Failure Handling

If the target environment is unknown, first classify the scheduler as local, SLURM-compatible, Kubernetes/RunAI-compatible, or other; then generate the closest minimal wrapper and mark fields that need confirmation.

If the project has uncommitted changes, record that fact in the run notes or ask whether to commit before submission.

If environment activation is unclear, prefer making the script explicit with a placeholder over silently inheriting the current shell state.

## Anti-exemplars

Do not use this to replace a full experiment tracker; the script is the launch record, not the complete result database.

Do not submit a job script before the user has reviewed resource settings when the run consumes scarce shared GPU resources.

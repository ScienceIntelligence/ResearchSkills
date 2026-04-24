---
name: "Gp Kernel Psd And Jitter Check"
memory_type: procedural
subtype: operator-fail
domain: statistics
subdomain: computation
contributor: Jamesyu420
---
## When + Exclusions
Use when GP inference becomes numerically unstable or when a manuscript states a GP prior without enough mathematical detail.

Exclude purely empirical smoothing methods not claiming a GP prior.

## Decision
**Preferred:** Explicitly define kernel entries and numerical stabilization:
\[
K_{ij}=k(t_i,t_j),
\]
where \(k(\cdot,\cdot)\) is positive semidefinite, and use \(K+\epsilon I\) jitter.

**Rejected:** Writing “GP prior” without defining the kernel or PSD requirement.

**Reasoning:** Prior manuscript checks flagged kernel definition, positive semidefiniteness, and jitter as necessary for both mathematical correctness and stable inference.

## Local Verifiers
- Kernel function is PSD.
- \(K\) is symmetric.
- Cholesky succeeds with jitter.
- Hyperparameter estimates are not at degenerate boundaries.
- Time points are unique and ordered.

## Failure Handling
If Cholesky fails:
- increase jitter;
- check duplicate time points;
- rescale time;
- constrain length-scale;
- tie hyperparameters across genes or programs if gene-wise estimation is unstable.

## Anti-exemplars
- “Let \(K\) be a covariance” with no construction.
- Optimizing gene-specific kernels independently in a small-\(T\) setting without regularization.

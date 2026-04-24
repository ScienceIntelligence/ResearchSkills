---
name: "Permutation Invariant Program Recovery Protocol"
memory_type: procedural
subtype: operator-fail
domain: quantitative-biology
subdomain: genomics
contributor: Jamesyu420
---
## When + Exclusions
Use when evaluating estimated gene programs \(\widehat W\) against true programs \(W\), especially for NMF/topic/factor models where program labels are arbitrary.

Exclude evaluations where programs have fixed known labels and no permutation ambiguity.

## Decision
**Preferred:** Match programs first, then compute multiple recovery metrics.

Procedure:
1. Truncate \(\widehat W\) to nonnegative entries if needed.
2. Normalize rows to sum to one.
3. Build cost matrix \(C_{k\ell}=d(w_k,\widehat w_\ell)\), using TV or Hellinger distance.
4. Use Hungarian matching:
   \[
   \min_{\pi\in S_K}\sum_{k=1}^K d(w_k,\widehat w_{\pi(k)}).
   \]
5. Report mean matched similarity, top-gene recovery, and worst-program performance.

**Rejected:** Raw Frobenius norm as the primary metric.

**Reasoning:** Frobenius error is not permutation-invariant and can miss top-gene recovery failures.

## Local Verifiers
Use:
\[
d_{\mathrm{TV}}(p,q)=\frac12\sum_g |p_g-q_g|,
\]
\[
d_H^2(p,q)=\frac12\sum_g(\sqrt p_g-\sqrt q_g)^2.
\]

For top genes:
\[
\mathrm{Overlap}@m=\frac1K\sum_k \frac{|T_k^{(m)}\cap \widehat T_{\pi(k)}^{(m)}|}{m}.
\]

For split/merge:
\[
\mathrm{Coverage}=\frac1K\sum_k\max_\ell s(w_k,\widehat w_\ell),
\]
\[
\mathrm{Purity}=\frac1{\widehat K}\sum_\ell\max_k s(w_k,\widehat w_\ell).
\]

## Failure Handling
If mean recovery looks good but some programs are missed, report:
- minimum matched similarity,
- 10% quantile similarity,
- worst-program top-gene overlap,
- coverage and purity.

## Anti-exemplars
- Comparing unaligned columns.
- Reporting only mean Frobenius error.
- Reporting only best-matched programs and hiding split/merge failures.

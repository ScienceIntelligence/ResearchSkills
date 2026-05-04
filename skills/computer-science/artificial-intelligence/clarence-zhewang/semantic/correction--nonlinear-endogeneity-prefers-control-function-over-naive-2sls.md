---
name: nonlinear-endogeneity-prefers-control-function-over-naive-2sls
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: artificial-intelligence
contributor: Clarence-ZheWang
source:
  type: session
  session_id: 46c52787-1634-4c89-8dad-32649e27ae5a
extracted_at: 2026-04-24
tags: [econometrics, endogeneity, nonlinear-models, iv, control-function]
---

## Fact
When the endogenous regressor enters the outcome model nonlinearly (for example, both `X` and `X^2` appear), a control-function approach is methodologically safer than a naive 2SLS workflow that instruments `X` and then squares the fitted value.

## Evidence
In this session, the nonlinear effect of digital talent investment was central. The discussion explicitly converged on the point that reviewers will reward correct handling of the squared endogenous term, and that a control-function approach can model endogeneity in the linear term while keeping the nonlinear specification intact.

## LLM Default Belief
A common LLM default is: "Run first stage for `X`, use `X_hat` and `X_hat^2` in the second stage, and call it IV for a nonlinear model." That shortcut is often presented too confidently and is easy for reviewers to criticize.

## Expiry Signal
Expires if the empirical model no longer contains a nonlinear endogenous regressor, or if a different identification design makes standard IV sufficient without a nonlinear second stage.


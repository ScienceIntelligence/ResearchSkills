---
name: bayesian-parameter-estimation-is-data-assimilation-naming
memory_type: semantic
subtype: correction
domain: physics
subdomain: geophysics
contributor: ktwu01
---
## Fact
"Bayesian parameter estimation" constrained by satellite observations IS a form of data assimilation, but reviewers do not credit it as data assimilation unless the proposal text EXPLICITLY uses the term "data assimilation" and names a method (Ensemble Kalman Filter, particle filter, 4D-Var). Map satellites to experiments explicitly: SMAP soil moisture → Experiments 1 and 3; GRACE TWS anomalies → Experiment 2. Set a quantitative trigger for when to invoke DA: e.g., "where parameter transfer degrades performance by more than 20% in RMSE relative to calibration sites".
## LLM Default Belief
LLMs will often treat "Bayesian calibration with satellite constraints" and "data assimilation" as synonyms implicitly — reviewers do not.

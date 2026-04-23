---
name: "Llm Benchmarking Regression Heuristics"
memory_type: procedural
subtype: tie
domain: computer-science
subdomain: artificial-intelligence
contributor: ergan-shang
---
## When
Ranking model performance across hard reasoning tasks (GPQA Diamond, GSM8K) when raw accuracy scores are within the margin of error (1-2%).

## Decision
Apply an MLP-based regression or low-rank matrix completion to the "per-question" success matrix rather than comparing aggregate means.
**Preferred:** Analyzing the "difficulty-weighted" score where questions missed by "frontier" models are weighted higher.
**Reasoning:** Raw accuracy on small N (like GPQA Diamond) is noisy; predicting the model's latent "ability" parameter via IRT (Item Response Theory) provides a more stable rank.

## Local Verifiers
- Standard error of the mean (SEM) > difference between model scores.
- High variance in model performance across different prompt templates for the same question.

## Failure Handling
If matrix completion fails to converge, fallback to few-shot in-context learning (ICL) as a regressor: provide the model's responses to known easy questions to predict its probability of success on a hard question.

## Anti-exemplars
- Reporting top-1 accuracy without checking for "exact match" formatting failures.

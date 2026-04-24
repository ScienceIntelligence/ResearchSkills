---
name: "Rebuttal Efficiency Comes From Defining The Metric Boundary"
memory_type: episodic
subtype: adaptation
domain: computer-science
subdomain: artificial-intelligence
contributor: zijiegeng
---
## Situation
A reviewer concern centered on unclear inference-time reporting: whether time referred only to initial model output or also included later optimization.

## Action
The issue was reframed as a metric-boundary problem rather than a wording problem. The correct response was to define separate timing components and align them across methods.

## Outcome
This produced a concrete rebuttal path: clarify the definition, report component times when available, and avoid unfair speed comparisons.

## Lesson
When a reviewer disputes a metric, first define the measurement boundary before defending the number.

## Retrieval Cues
Inference time; post-optimization; reviewer asks “what exactly is included?”; runtime comparison.

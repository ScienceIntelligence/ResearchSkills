---
name: "Direct Composed Imitation Loss For Order Experts"
memory_type: procedural
subtype: operator-fail
domain: quantitative-biology
subdomain: other-quantitative-biology
contributor: hzzzzzhappy
---
## When + Exclusions
When a direct expert exists for a seen order and a composed expert path also predicts the same target, and the goal is to make composed experts imitate higher-order decision behavior.

Exclude cases where no direct expert exists for the target order.

## Decision
Preferred: use the direct expert as a stopped-gradient teacher and align the composed representation to it with a cosine-style imitation loss, while also keeping supervised BCE on the composed prediction.

Rejected: only supervising the direct path, because the composed path remains weak for unseen orders.

Reasoning: the direct path can learn from observed labels for seen orders, while the composed path learns to approximate direct high-order decision behavior and becomes usable when direct high-order experts are unavailable.

## Local Verifiers
- The full objective includes direct BCE, composed BCE, and imitation loss.
- The direct representation is detached or stop-gradiented in the imitation term.
- Imitation is applied only when the target order is in the seen order set.
- The composed path is still supervised by labels, not only by representation matching.

## Failure Handling
If imitation hurts, reduce $\lambda_{\mathrm{imt}}$ before removing the term. If the composed path collapses, verify that the direct teacher is not being pulled by the imitation loss.

## Anti-exemplars
- Matching logits only and ignoring representation alignment.
- Applying direct-expert loss to an unseen order.
- Allowing gradients from the composed path to distort the direct expert teacher.

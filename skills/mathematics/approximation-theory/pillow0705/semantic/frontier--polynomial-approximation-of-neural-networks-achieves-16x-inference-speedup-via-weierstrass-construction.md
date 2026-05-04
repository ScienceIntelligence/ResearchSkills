---
name: "Polynomial approximation of neural networks achieves 16x inference speedup via Weierstrass construction"
memory_type: semantic
subtype: frontier
domain: mathematics
subdomain: approximation-theory
contributor: pillow0705
tags: [neural-network, polynomial-approximation, inference-speedup, Weierstrass, Horner]
---

## Fact

A trained MLP can be approximated to within uniform error tolerance by a polynomial via layer-by-layer symbolic composition (replacing tanh activations with polynomial fits), and the resulting polynomial evaluated via Horner's method achieves roughly 16× faster single-point inference than the original network for a shallow MLP (2 hidden layers, 8 neurons each). The speedup arises because polynomial evaluation requires only n multiplications and n additions for degree-n polynomial (theoretical minimum), while MLP evaluation requires O(W) FLOPs plus repeated transcendental function calls (tanh). The approximation quality is bounded by the Weierstrass theorem: for any continuous function on a closed interval and any ε > 0, a polynomial approximant with sup-norm error < ε exists.

## Evidence

Experiment: target function sin(x) on [0, 2], MLP with 97 parameters (Linear 1→8, tanh, Linear 8→8, tanh, Linear 8→1), approximated by degree-18 polynomial. Results: L∞ approximation error comparable to MLP training error; single-point inference 16× faster than original MLP in Python benchmark. The degree-18 requirement comes from the composition depth: approximating tanh to degree d per layer and composing through 3 layers yields effective degree ~d³, requiring moderate d to maintain accuracy.


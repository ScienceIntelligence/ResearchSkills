---
name: "Reproducibility Seed Limitations In Pytorch"
memory_type: semantic
subtype: correction
domain: computer-science
subdomain: artificial-intelligence
contributor: ergan-shang
---
## Fact
Setting seeds (Python, NumPy, Torch, CUDA) + deterministic flags does **not guarantee full reproducibility** across runs.

## Evidence
User explicitly questioned whether full reproducibility is ensured; answer depends on:
- CUDA nondeterministic ops
- hardware differences
- library versions

## LLM Default Belief
“Setting seeds ensures full reproducibility.”

## Expiry Signal
If PyTorch introduces full deterministic kernels universally (unlikely soon)

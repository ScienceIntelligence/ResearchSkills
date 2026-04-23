---
name: "Cuda Memory Gap Fragmentation Diagnosis"
memory_type: procedural
subtype: operator-fail
domain: computer-science
subdomain: artificial-intelligence
contributor: ergan-shang
---
## When
Error: trying to allocate ~10.5GB but ~10.3GB free.

## Decision
Diagnose as **fragmentation / reserved memory**, not simple shortage.

**Preferred**
- Reduce peak allocation (batch size, sequence length)
- Use gradient checkpointing

**Rejected**
- Relying on `empty_cache()` alone
- Assuming free memory is fully usable

**Reasoning**
CUDA allocator requires contiguous blocks; fragmentation prevents large allocations.

## Local Verifiers
- `torch.cuda.memory_reserved()` >> `memory_allocated()`
- Failure occurs near allocation boundary

## Failure Handling
- Restart process
- Pre-allocate large tensors early

## Anti-exemplars
- Interpreting “free memory” as allocatable memory

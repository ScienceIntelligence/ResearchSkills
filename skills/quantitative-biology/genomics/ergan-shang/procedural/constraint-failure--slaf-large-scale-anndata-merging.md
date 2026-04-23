---
name: "Slaf Large Scale Anndata Merging"
memory_type: procedural
subtype: constraint-failure
domain: quantitative-biology
subdomain: genomics
contributor: ergan-shang
---
## When
Attempting to merge multiple massive `.h5ad` files (e.g., 60GB+ each) where the total dataset exceeds available RAM, causing `anndata.concat` or `scanpy.concat` to trigger OOM (Out of Memory) kills.

## Decision
Use the Scalable Large-scale AnnData Framework (SLAF) to perform "lazy merging" or disk-backed concatenation. 
**Rejected:** Creating a list of AnnData objects in memory before concatenation. 
**Reasoning:** Even with `backed='r'`, standard `anndata` operations often trigger full-load events during metadata alignment.

## Local Verifiers
- Swap usage increases linearly with the number of files joined.
- Metadata (obs/var) columns are non-identical across batches, forcing expensive re-indexing.

## Failure Handling
If SLAF fails due to HDF5 versioning, manually initialize a Zarr store and stream the sparse matrices in chunks using `indptr` slicing to avoid the HDF5 "object header" overhead.

## Anti-exemplars
- Merging datasets smaller than 10GB where standard `scanpy` in-memory operations are faster.
- Using `pandas.concat` on the underlying dataframes (loses sparse matrix structure).

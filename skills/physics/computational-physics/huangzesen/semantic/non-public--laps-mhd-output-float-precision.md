---
name: laps-mhd-output-float-precision
memory_type: semantic
subtype: non-public
domain: physics
subdomain: computational-physics
contributor: huangzesen
source:
  type: session
  session_id: 4f5446ee-6beb-430e-bfe2-f05d1a3c23c0
extracted_at: 2026-04-25
tags: [MHD, LAPS, simulation-output, floating-point, storage, fortran]
---

## Fact

The LAPS MHD simulation code uses **double precision (float64)** throughout its parallel output routines. The snapshot file format has two layers: the header (written by rank 0, sequential) stores `time` as float32 (4 bytes), while the body (written by all ranks via MPI-parallel I/O) stores field arrays as float64. Switching the body writes to float32 requires changes in approximately 20–30 lines across three files: `mhdoutput.f90`, `restart.f90`, and one configuration-facing file for the `mhd.input` precision flag. The change is rated medium difficulty and would halve snapshot file storage.

## Evidence

Code review of `mhdoutput.f90` and `restart.f90` by a domain expert familiar with the codebase confirmed the split header/body precision and the line-count estimate.

## Expiry Signal

Stale if the output routines are refactored or if a configurable precision flag (`output_precision` in `mhd.input`) is implemented and merged.


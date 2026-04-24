---
name: "Two-Layer Data Source Model for Satellite Plotting Tools"
memory_type: semantic
subtype: frontier
domain: physics
subdomain: space-physics
contributor: KKEERB
source:
  type: session
  session_id: 019d9041-da0d-77b1-bd7d-a76b0317b5ce
extracted_at: 2026-04-24
tags: [data-provenance, satellite-data, DMSP, NOAA-NCEI, workflow-design]
---

## Fact
For DMSP satellite instrument data, the data source for a user-facing plotting tool must distinguish two layers:
1. **Official archive source** (e.g., NOAA NCEI SSJ product page, SPDF SSUSI archive) — where users obtain raw EDR-format files with instrument-specific naming conventions (e.g., `PS.CKGWC_SC.U_DI.A_GP.SIES3-F16-R99990-B9999090-APGA_AR.GLOBAL_DD.20150701_TP.000001-235959_DF.EDR`).
2. **Directly plottable format** (preprocessed NetCDF) — the local project's processed/mirrored copy in standardized format that plotting code actually consumes.

This two-layer model is essential because raw satellite EDR products have instrument-specific binary/text/EDR formats with complex naming that non-specialist users cannot map to plotting requirements, while the preprocessed NC format abstracts these away.

## Evidence
The session revealed that SSJ raw data from NOAA NCEI is NOT NetCDF — it uses an EDR filename pattern (`PS.CKGWC_SC.U_DI.A_GP.SIES3-...`). The plotting code expects preprocessed `.nc` files derived from these raw products. Users need both pieces of information: where to download raw data and what format the tool expects.

## LLM Default Belief
LLMs typically present a single "data source" as either a download URL or a file format, not distinguishing that the downloadable format may differ from the consumable format. This causes confusion when users download raw EDR files and the tool rejects them as "wrong format."

## Expiry Signal
Valid as long as NOAA NCEI continues to serve DMSP SSJ data in EDR format. If NCEI adds native NetCDF SSJ products, the two-layer distinction collapses to one layer.


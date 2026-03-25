---
name: figure-caption-generator
description: >
  Generate publication-quality figure captions for geoscience and earth systems modeling papers.
  Produces structured, concise captions that clearly describe multi-panel figures, data sources,
  variables, time periods, and statistical results without including methodology or conclusions.
domain: physics
subdomain: earth-system-modeling
author: "Koutian Wu"
expertise_level: intermediate
tags: [geoscience, scientific-writing, documentation, figures, captions, earth-systems]
dependencies: []
version: 1.0.0
status: draft
reviewed_by: []
---

## Purpose

Use this skill when you need to write publication-quality figure captions for geoscience or earth systems modeling papers. It guides the AI through generating clear, structured captions that:
- Describe each subplot sequentially with panel labels (a, b, c, etc.)
- Include data sources, model names, and variable definitions
- Specify time periods and temporal resolution
- Report statistical metrics (correlations, means, standard deviations, sample sizes)
- Exclude implementation details, methodology, and discussion/conclusions

This skill is especially useful for papers with multi-panel comparison figures (observations vs. model simulations, model intercomparisons, or multi-temporal analyses).

## Tools

- **Matplotlib/Seaborn/Plotly**: Python plotting libraries used to create the figures being captioned
- **Scientific writing standards**: Publication-style figure caption conventions from major journals
- **Data documentation**: Metadata about datasets, models, and time periods referenced in figures
- **Statistical software**: Tools that compute metrics reported in captions (correlations, RMSE, bias, etc.)

## Domain Knowledge

### Key Concepts

**Figure Structure in Geoscience Papers:**
- Multi-panel figures comparing observations with model outputs are standard in earth systems research
- Each subplot typically shows a different aspect: time series, seasonal cycles, diurnal cycles, distributions, or scatter plots
- Captions must be self-contained so readers understand the figure without consulting the text

**Geoscience-Specific Elements:**
- **Models**: Identified by name and version (e.g., "Noah-MP", "GFDL CM4")
- **Variables**: Use standard abbreviations after full names on first mention (e.g., "latent heat flux (LHF)")
- **Time periods**: Always specify the study period and data resolution (hourly, daily, seasonal)
- **Data sources**: Distinguish observations from model simulations, name field sites or observatories
- **Statistical metrics**: Common ones include correlation (r), RMSE, bias, means, standard deviations (Std), and sample sizes (N)

**Caption Structure:**
1. Opening sentence: Brief overview of figure and what it shows
2. Panel descriptions: Sequence through (a), (b), (c), etc. with "Same as (x), but for..." when applicable
3. Statistical summary: Final sentence or parenthetical summarizing metrics in (e-g) panels if present

### Fundamental Equations / Principles

**Standard Statistical Notation in Captions:**
- Correlation: r or R² (coefficient of determination)
- Error metrics: RMSE (root mean square error), MAE (mean absolute error), bias
- Aggregation notation: "daily averaged", "seasonal means", "hour-averaged"
- Distribution representation: "violin and box plots", "probability density functions"

**Temporal Resolution Terminology:**
- **Hourly**: 0-3600 second intervals (high resolution, diurnal variability visible)
- **Daily averaged**: 24-hour aggregation (removes diurnal cycle, shows synoptic variability)
- **Seasonal**: Monthly or multi-month aggregation (removes daily fluctuations)
- **Climatological**: Multi-year averages (shows mean annual cycle)

### Important Results & Theorems

**Publication Style Conventions:**
- Captions should be comprehensible in isolation from the manuscript text
- Avoid repeating information already clear from axis labels
- Use consistent terminology across all figure captions in a paper
- Report only statistically significant or key results in captions

**Earth Systems Modeling Conventions:**
- Always name the model when first mentioned (including version/parameterization if relevant)
- Observation sites should be identified by acronym (e.g., "US Syv site" for FLUXNET station)
- Multi-model comparisons require clear identification of which model is which
- Validation plots should indicate which variable is observed vs. modeled in legend/caption

## Reasoning Protocol

**Step 1: Identify Figure Components**
- Count the number of subplots and their arrangement
- Determine what each subplot displays (time series, distribution, scatter, etc.)
- Note the data types present (observations, simulations, comparisons)

**Step 2: Extract Key Information**
- Data sources (observation sites, model names, dataset names)
- Variables plotted (with full names and abbreviations)
- Time periods covered and temporal resolution
- Statistical metrics visible in plots or text

**Step 3: Structure the Caption**
- Write an opening sentence describing the overall figure and its purpose
- Describe panels sequentially (a), (b), (c), etc.
- For panels with similar structure, use "Same as (x), but for..." to avoid repetition
- Add a final sentence summarizing statistical information if panels (e-g) show distributions

**Step 4: Refine for Clarity**
- Ensure no methodology or code details are included
- Remove discussion/conclusion language
- Verify all model names, site acronyms, and abbreviations are correct
- Check that time periods are explicitly stated
- Confirm statistical metrics use standard notation

## Common Pitfalls

- **Including methodology**: Avoid phrases like "computed using Python" or "calculated from equation (3)" — focus on what the data shows, not how it was created
- **Over-explaining**: Don't repeat information visible in axis labels or legends
- **Vague time periods**: Always specify exact years/dates, not just "study period" without dates
- **Model acronyms without explanation**: First mention should include full name, e.g., "Noah-MP" not just "NMP"
- **Inconsistent terminology**: Use "observations" consistently (not "measurements" in one place and "observations" in another)
- **Missing sample sizes**: For statistical plots, N values are crucial context
- **Ignoring correlation strength**: When reporting r values, mention whether they are significant (p < 0.05)
- **Confusing panel order**: Always describe panels in visual order (left to right, top to bottom)
- **Generic descriptions**: "Shows data" is unhelpful — specify what variable and for what time period
- **Including discussion**: Phrases like "suggests that..." or "indicates..." imply interpretation and belong in the text, not the caption

## Examples

### Example 1: Latent Heat Flux Multi-Panel Comparison

**Problem:**
Create a caption for a 7-panel figure comparing latent heat flux observations with two versions of the Noah-MP model (standard and physics-enhanced). Panels show: (a) full time series, (b) seasonal patterns, (c) diurnal cycle, (d) scatter plot with correlations, (e-g) distributions at three temporal resolutions.

**Reasoning:**
1. Identify components: 7 subplots, 3 data types (observations + 2 model versions), 3 temporal resolutions
2. Extract information: US Syv FLUXNET site, 2002-2007 study period, hourly observations, correlation values provided
3. Structure: Opening sentence, then describe (a) time series, (b) seasonal, (c) diurnal, (d) scatter comparison, then (e-g) distributions with statistics
4. Refine: Use "Same as (b), but for..." to avoid repetition; include correlation values; note statistical metrics

**Answer:**
"Figure 1. Combined visualizations of latent heat flux measurements and model simulations at the US Syv site. (a) Time series of hourly observations and model outputs for the entire study period, with the first part (2002-2007) used for detailed analysis and the second part shown for reference. (b) Seasonal patterns of daily averaged values from 2002-2007, with both individual daily means and the 6-year average line. (c) Same as (b), but for the diurnal cycle of hourly averaged values. (d) Scatter plots comparing observations against both model versions, with corresponding correlation statistics. (e) Violin and box plots of the original hourly resolution data distribution for observations, Noah-MP, and Noah-MP-PHS models. (f) Same as (e), but for the seasonal (daily averaged) data distributions. (g) Same as (e), but for the diurnal (local hour-averaged) data distributions. (e-g) include statistical information showing mean values, standard deviations (Std), and sample sizes (N) for each dataset."

### Example 2: Precipitation Bias Comparison

**Problem:**
Create a caption for a 4-panel figure comparing precipitation bias across two GCMs (GFDL CM4, MPI-ESM1.2) for the Global Precipitation Measurement (GPM) satellite period (2015-2020), showing: (a) spatial maps of mean bias, (b) zonal profiles, (c) seasonal cycle amplitude, (d) skill score distributions.

**Reasoning:**
1. Identify: 4 subplots, 2 models, observational reference (GPM satellite data), multiple metrics (bias, spatial, seasonal, skill)
2. Extract: Two GCMs by name, GPM reference dataset, 2015-2020 period, bias units likely in mm/day
3. Structure: Opening describes comparison, (a-b) describe spatial patterns, (c) temporal patterns, (d) performance metrics
4. Refine: Name models fully, specify reference dataset, include bias units

**Answer:**
"Figure 3. Precipitation bias evaluation for GFDL CM4 and MPI-ESM1.2 against Global Precipitation Measurement (GPM) satellite observations. (a) Spatial maps of annual mean precipitation bias (mm/day) for each model relative to GPM observations over the 2015-2020 period. (b) Zonal profiles of mean bias showing tropical and subtropical error distributions for both models. (c) Seasonal cycle amplitude of precipitation anomalies relative to the 6-year mean for each model and observations. (d) Probability distributions of Taylor skill scores computed for regional precipitation over all land grid points, quantifying overall model performance relative to GPM."

## References

- *How to Write a Figure Caption for a Scientific Paper* — Purdue OWL Online Writing Lab: Guidance on scientific figure caption standards
- IPCC Technical Report: *Climate Change 2021: The Physical Science Basis* — conventions for multi-model earth systems figures
- *Latent Heat Flux from Global Atmospheric Reanalysis Products* — example papers with detailed earth systems modeling figure captions
- *Standards for Reporting Published Climate Data* — World Climate Research Programme recommendations for figure documentation
- arXiv Physics taxonomy: https://arxiv.org/archive/physics/ — Reference for earth-system-modeling (geophysics, atmospheric physics) domain classification

---
# REQUIRED FIELDS — fill in all of these before opening a PR
name: your-skill-name                        # lowercase, hyphens only. This is the Claude Code invocation name.
description: >                               # 1-2 sentences: when should this skill be used?
  Describe what this skill does and when to invoke it.
domain: physics                              # physics | mathematics | computer-science | quantitative-biology | statistics | eess | economics | quantitative-finance
subdomain: ""                                # more specific area (e.g. quantum-physics)
author: "Full Name (Institution)"            # e.g. "Dr. Albert Einstein (ETH Zürich Physics)"
expertise_level: advanced                    # beginner | intermediate | advanced
status: draft                                # leave as draft; reviewer will update after review
---

<!--
  INSTRUCTIONS FOR CONTRIBUTORS
  ─────────────────────────────
  1. Delete these comment blocks before submitting.
  2. Fill in ALL required frontmatter fields above.
  3. Complete each section below. "Required" sections must be present.
  4. Run `python utils/tools/validate.py skills/<domain>/<subdomain>/<your-skill>.md` before opening a PR.
  5. See utils/SKILL_SCHEMA.md for full field documentation.

  NOTE: The primary contribution method is now skills via /extract-knowhow.
  This template is for manually written skills only.
-->

## Purpose
<!-- REQUIRED -->
<!-- One paragraph: what problem does this skill solve? When should it be invoked?
     Example: "Use this skill when analyzing experimental data involving quantum entanglement.
     It guides the AI through Bell inequality calculations and statistical interpretation." -->

## Tools
<!-- REQUIRED -->
<!-- List the key tools, software, libraries, databases, or instruments used in this domain.
     For each tool, briefly describe what it does and when to use it.
     Example: "BLAST (sequence alignment) — use when comparing DNA/protein sequences against a database." -->

- **[Tool Name]**: what it does, when to use it
- **[Tool Name]**: what it does, when to use it

## Domain Knowledge
<!-- REQUIRED -->
<!-- The core content: key concepts, definitions, equations, established facts.
     Be precise and comprehensive — this is what the AI will draw on. -->

### Key Concepts

### Fundamental Equations / Principles

### Important Results & Theorems

## Reasoning Protocol
<!-- REQUIRED -->
<!-- Numbered steps guiding AI reasoning for this domain. -->

Step 1: 
Step 2: 
Step 3: 

## Common Pitfalls
<!-- REQUIRED -->
<!-- Mistakes, misconceptions, edge cases, and counterintuitive results to watch for. -->

- 

## Examples
<!-- RECOMMENDED -->
<!-- One or more worked examples demonstrating correct application. -->

### Example 1: [Title]

**Problem:**

**Reasoning:**

**Answer:**

## References
<!-- RECOMMENDED -->
<!-- Key papers, textbooks, or resources. Use standard citation format. -->

- 

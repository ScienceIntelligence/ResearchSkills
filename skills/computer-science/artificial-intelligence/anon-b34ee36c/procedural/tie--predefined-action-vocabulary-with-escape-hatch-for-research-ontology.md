---
name: predefined-action-vocabulary-with-escape-hatch-for-research-ontology
memory_type: procedural
subtype: tie
domain: computer-science
subdomain: artificial-intelligence
contributor: anon-b34ee36c
source:
  type: session
  session_id: bfafe2a8-ae36-43c3-9b2b-7a7c0c0c5857
extracted_at: 2026-04-13
tags: [knowledge-representation, schema-design, research-actions, ontology-flexibility]
---

## When

You are designing a structured representation for research decision trees extracted from unstructured conversations, and must choose between:
- **Fully open** (free-text action descriptions) → maximum fidelity, zero structure
- **Fully closed** (rigid taxonomy) → analyzable, but lossy if taxonomy is wrong
- **Hybrid** (predefined + escape hatch) → ?

### Exclusions

- Do NOT use this for domain-specific ontologies where the action space is well-known and stable (e.g., organic chemistry reactions have established vocabularies)
- Do NOT use this for coding workflows (use LSP action types like refactor/rename/extract)
- Do NOT use this when users are unreliable (escape hatch will be overused)

## Decision

### Preferred: Predefined ~20 core actions + `other` escape hatch

1. **Define 20 atomic research actions** covering:
   - Literature: `search_literature`, `read_paper`, `synthesize_related_work`
   - Hypothesis: `propose_hypothesis`, `refine_question`
   - Method: `design_experiment`, `implement_method`, `run_experiment`
   - Analysis: `analyze_results`, `visualize_data`, `statistical_test`
   - Decision: `compare_alternatives`, `pivot`, `plan_next_step`, `abandon`
   - Meta: `debug_method`, `validate_assumption`, `resolve_anomaly`, `spot_error`

2. **Add `other` with mandatory free-text `action_description`**:
   - User/LLM must fill `action_description` if choosing `other`
   - Periodic review: if `other` represents >5% of nodes, mine common patterns and promote to core vocabulary

3. **Metadata per node** (action-agnostic):
   - `summary`, `outcome`, `alternatives_considered`, `timestamps`, `initiator` (human/AI)

### Rejected: Fully open (free-text only)

- **Impossible to aggregate**: "tried different approach" vs "pivoted strategy" vs "changed method" are the same but unsearchable
- **No cross-researcher patterns**: Can't answer "how often do researchers abandon hypotheses after negative results?"

### Rejected: Fully closed (no escape hatch)

- **Premature taxonomy lock-in**: If real researchers use an action you didn't anticipate, they're forced into mislabeling
- **Inhibits discovery**: You WANT to find action types you didn't predict — that's signal about research practice

### Reasoning

Research is **structured but not fully enumerable**:
- Core patterns recur (literature search, hypothesis formation, experiment design)
- But edge cases and domain-specific moves exist (e.g., "contacted author for dataset", "filed IRB amendment")

**20 actions + escape hatch**:
- Captures ~95% of actions with structure
- Allows ~5% outliers without forcing mislabeling
- Escape hatch becomes a **sensor** for missing ontology coverage

## Local Verifiers

- ✅ If `other` usage <10% after 50+ trees → vocabulary covers real workflows
- ✅ If `other` descriptions cluster into 2-3 recurring patterns → promote to core vocabulary
- ❌ If `other` usage >25% → vocabulary is too narrow, or instructions unclear

## Failure Handling

**If users overuse `other` because core actions feel "wrong"**:
- Survey `other` descriptions
- Common cause: **granularity mismatch** (e.g., "implement method" too coarse, users want "implement baseline" vs "implement novel variant")
- Solution: Split overly broad actions OR add optional `subtype` field

**If users underuse `other` and force-fit into wrong categories**:
- Spot-check: sample 20 nodes labeled `debug_method`, ask "does this really fit?"
- If 30%+ are mislabeled → instructions need examples of when to use `other`

**If LLM auto-extraction never uses `other`**:
- LLM has a bias toward "pick from menu"
- Add to prompt: "If the action doesn't clearly fit one of the 20 types, use `other` and describe it precisely"

## Anti-exemplars

❌ "Use a 200-category research ontology from a published taxonomy paper"
- Over-specified for this use case; users won't know which category to pick

❌ "Let users invent arbitrary action names, we'll cluster them later with embeddings"
- Defers the hard problem; embeddings conflate synonyms but also unrelated actions

❌ "Start with 5 actions, expand only when needed"
- **Too permissive** → users will overuse `other` because 5 actions can't cover real diversity
- Leads to massive unlabeled `other` pile that's expensive to re-categorize later


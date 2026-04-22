> **Deprecated:** This document describes the Phase 1 decision tree format, which has been replaced by the cognitive memory-type skill system. See [Skill Schema Design](superpowers/specs/2026-04-11-skill-schema-design.md) for the current design.

# /extract-knowhow v2 — Research Decision Tree Collection

## Context

v1 of `/extract-knowhow` treats chat history as uniform text and summarizes it into 10 fixed categories. This produces textbook-like output that misses the actual value: the tacit judgments researchers make during their work — what they tried, what they rejected, and why.

**Strategic insight:** The scarcest resource is researcher participation, not algorithm precision. Rather than designing the perfect skill-extraction pipeline first, v2 prioritizes **collecting structured-but-flexible data at low friction**. We can iterate on downstream analysis later without re-collecting.

**The intermediate representation is a Research Decision Tree** — a structured trace of atomic research actions extracted from AI chat history. It captures the full trajectory of a research project: what was tried, what worked, what was abandoned, and the reasoning behind each step. Decision trees sit between raw chat logs (too invasive) and fully-processed skills (too rigid). They can later be analyzed to produce skills, patterns, and other derivatives.

## Data Model

### Tree Structure

```
Project Tree (anchored to paper or project)
├── Sub-tree from conversation 1
│   ├── search_literature: "surveyed methods for X"
│   ├── formulate_hypothesis: "proposed approach A"
│   ├── implement: "built initial prototype"
│   │   ├── debug: "fixed convergence issue"
│   │   └── validate: "sanity check on toy data"
│   └── observe_result: "accuracy below baseline"
│       ├── diagnose_failure: "identified data leakage"
│       └── pivot: "switched to approach B"  [status: abandoned → led to new branch]
├── Sub-tree from conversation 2 (continues from "pivot" node above)
│   ├── survey_methods: "reviewed alternative architectures"
│   └── ...
```

**Two-layer structure:**
- **Bottom layer:** Each chat session (conversation) produces one sub-tree automatically.
- **Top layer:** Sub-trees are joined into a project-level tree. AI infers continuation relationships; user confirms in review UI.

### Tree Anchor

Each tree is bound to one of:

| Anchor type | Format | When to use |
|---|---|---|
| **Paper** | arXiv ID/URL, DOI, or published URL | Research that has produced a paper |
| **Project** | Name + one-sentence description | In-progress work without a paper yet |

Project anchors can be upgraded to paper anchors later.

### Node Schema

Each node represents one atomic research action:

```yaml
id:          # unique node identifier (e.g., "conv1-003")
action:      # one of 20 core types + "other: free text"
summary:     # one sentence: what was done (de-identified)
outcome:     # success | failure | uncertain + short explanation
reasoning:   # why this step was taken
tools_used:  # tools, models, libraries involved
parent_id:   # parent node ID (builds tree structure)
confidence:  # high | medium | low
initiator:   # ai | human | collaborative
status:      # active | abandoned | paused
```

**Field details:**

- `action` — from the 20-type vocabulary (see below). If none fit, use `other: "free text"`.
- `summary` — one sentence, de-identified. Preserves scientific content (materials, parameters, methods), strips identity (names, institutions, paths, URLs).
- `outcome` — what happened after this action. `uncertain` for actions whose result isn't yet clear.
- `reasoning` — the motivation or evidence that led to this action. This is where tacit knowledge surfaces.
- `tools_used` — empty list if no specific tools involved.
- `confidence` — the researcher's apparent confidence level, as inferred from the conversation tone.
- `initiator` — `ai` if the AI proposed it, `human` if the researcher drove it, `collaborative` if it emerged from dialogue and the boundary is unclear.
- `status` — `active` for nodes on the current research path, `abandoned` for dead ends, `paused` for paths set aside for later.

### Action Vocabulary: 20 Core Types + Open Escape

| Phase | Actions |
|---|---|
| **Exploration** | `search_literature`, `formulate_hypothesis`, `survey_methods` |
| **Design** | `design_experiment`, `select_tool`, `prepare_data` |
| **Execution** | `implement`, `run_experiment`, `debug` |
| **Observation** | `observe_result`, `analyze_result`, `validate` |
| **Decision** | `compare_alternatives`, `pivot`, `abandon`, `diagnose_failure`, `plan_next_step` |
| **Output** | `write_paper`, `make_figure`, `respond_to_review` |
| **Escape** | `other: "free text"` |

Actions interleave freely — the phase grouping is for human readability, not a constraint on ordering.

**Ontology evolution:** Accumulated `other` entries are periodically reviewed. When a pattern recurs across multiple trees, it becomes a candidate for promotion to a new core type.

## Collection Pipeline

### Step 1: Local Extraction

User runs `/extract-knowhow` in Claude Code or Codex. The system:

1. Reads local conversation history.
2. For each conversation, the LLM:
   - Identifies meaningful research actions (skipping small talk, setup, generic programming).
   - Maps each action to one of the 20 core types (or `other`).
   - Fills the 9 metadata fields per node.
   - Infers parent-child relationships within the conversation (which action led to which).
3. Produces one sub-tree (JSON) per conversation.

### Step 2: Sub-tree Joining

If the user has multiple conversations for the same project:

1. AI analyzes context overlap between sub-trees (topic similarity, temporal sequence, explicit references).
2. Infers which node in a prior sub-tree the new sub-tree continues from.
3. Produces a draft project-level tree with join hypotheses.

### Step 3: Browser Review

Opens a local web page (reusing v1's browser review infrastructure) where the user:

- **Reviews nodes:** Edit summary, reasoning, action type. Fix any misclassifications.
- **Checks de-identification:** AI has auto-stripped identity info. User verifies nothing sensitive remains.
- **Confirms joins:** For multi-conversation trees, accept or correct where sub-trees connect.
- **Binds anchor:** Attach a paper URL/DOI or write a project description.
- **Adds missed sessions:** "Add missed session" button for conversations the system didn't auto-link.

### Step 4: Public Submission

User submits the reviewed tree to the ResearchSkills GitHub repo. Format TBD (GitHub Issue with JSON attachment, or PR adding a tree file to a designated directory).

## De-identification

**AI auto-strips:**
- Personal names, collaborator names
- Institution names
- Project-specific names (repo names, internal codenames)
- File paths, private URLs
- Email addresses, usernames

**AI preserves:**
- Scientific content: materials, compounds, parameter values, method names
- Tool/library names (these are public knowledge)
- Observation values, metrics, error messages (scientific content)

**User final review:** The browser review UI highlights AI-stripped content in a distinct color so the user can verify completeness.

## Output Format

### Tree JSON Schema

```json
{
  "version": "2.0.0",
  "anchor": {
    "type": "paper | project",
    "paper_url": "https://arxiv.org/abs/...",
    "project_name": "...",
    "project_description": "..."
  },
  "contributor": "Name (Institution)",
  "extracted_at": "2026-04-10",
  "conversations_analyzed": 5,
  "nodes": [
    {
      "id": "conv1-001",
      "action": "search_literature",
      "summary": "Surveyed recent methods for protein folding prediction",
      "outcome": "success: identified 3 promising approaches",
      "reasoning": "Needed to understand SOTA before designing experiment",
      "tools_used": ["Google Scholar", "Semantic Scholar API"],
      "parent_id": null,
      "confidence": "high",
      "initiator": "human",
      "status": "active"
    },
    {
      "id": "conv1-002",
      "action": "formulate_hypothesis",
      "summary": "Hypothesized that combining method A with data augmentation B would improve accuracy",
      "outcome": "uncertain",
      "reasoning": "Method A showed strong results on similar tasks; B addresses its known weakness on small datasets",
      "tools_used": [],
      "parent_id": "conv1-001",
      "confidence": "medium",
      "initiator": "collaborative",
      "status": "active"
    }
  ],
  "joins": [
    {
      "from_subtree": "conv2",
      "to_node": "conv1-005",
      "confidence": "high",
      "confirmed_by_user": true
    }
  ]
}
```

## Relationship to Phase 2 (Skill Derivation)

Decision trees are the upstream data source. Phase 2 derives decision-shaped skills from collected trees:

- **A (marker scan)** operates on tree structure: `pivot`, `abandon`, `diagnose_failure` nodes with `outcome: failure` are natural decision markers.
- **C (paper differential)** compares the tree against the paper's claims to find silent decisions — paths explored and abandoned that the paper never mentions.
- **B (interview)** asks researchers to elaborate on high-value nodes.
- **Skill derivation** clusters related decision nodes into skills using the v2 schema.

This separation means tree collection ships first and starts gathering data before skill derivation is finalized.

## Verification

- **Schema verification:** Manually map 2-3 real CC conversation sessions to decision tree nodes. Confirm the 20-type vocabulary + 9-field schema can faithfully represent the research trajectory.
- **Roundtrip test:** From a tree, can a reader reconstruct what the researcher did, why, and what they rejected? If not, the schema is missing something.
- **Pipeline verification:** Run extraction on 5-10 real conversations, inspect trees in browser review UI, judge completeness and accuracy.

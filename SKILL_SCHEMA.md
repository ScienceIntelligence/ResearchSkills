# Skill Schema

This document defines the complete specification for OpenScientist skill files.

---

## 1. File Location

```
skills/<domain>/<subdomain>/<skill-name>.md
```

- `domain` must match one of: `physics`, `mathematics`, `computer-science`, `quantitative-biology`, `statistics`, `eess`, `economics`, `quantitative-finance`
- `subdomain` must match one of the arXiv-aligned subdomain folders under each domain (see `skills/<domain>/` for the full list)
- `skill-name` must be lowercase, hyphen-separated

---

## 2. Frontmatter Fields

```yaml
---
name: <string>                  # REQUIRED. Unique identifier. Lowercase, hyphen-separated. Used as the Claude Code skill invocation name.
description: <string>           # REQUIRED. 1-2 sentences. When should this skill be invoked? What does it do?
domain: <string>                # REQUIRED. One of: physics | mathematics | computer-science | quantitative-biology | statistics | eess | economics | quantitative-finance
subdomain: <string>             # optional. More specific area within the domain.
author: <string>                # REQUIRED. "Full Name (Affiliation)" — e.g. "Dr. Albert Einstein (ETH Zürich Physics)"
expertise_level: <string>       # REQUIRED. One of: beginner | intermediate | advanced
tags: [<string>, ...]           # optional. Keywords for discovery.
dependencies: [<string>, ...]   # optional. Names of other skills this one builds upon.
version: <semver>               # REQUIRED. Semantic version, starting at "1.0.0"
status: <string>                # REQUIRED. One of: draft | reviewed | verified
reviewed_by: [<string>, ...]    # optional. GitHub usernames of reviewers who approved this skill.
---
```

### 2.1 Field Reference

| Field | Required | Type | Valid Values |
|---|---|---|---|
| `name` | yes | string | lowercase, hyphens only |
| `description` | yes | string | 1–2 sentences |
| `domain` | yes | enum | see list above |
| `subdomain` | no | string | free text |
| `author` | yes | string | "Name (Affiliation)" |
| `expertise_level` | yes | enum | `beginner` `intermediate` `advanced` |
| `tags` | no | list | free text keywords |
| `dependencies` | no | list | other skill `name` values |
| `version` | yes | semver | e.g. `1.0.0` |
| `status` | yes | enum | `draft` `reviewed` `verified` |
| `reviewed_by` | no | list | GitHub usernames |

---

## 3. Body Sections

The skill body (after frontmatter) should follow this structure. Sections marked **Required** must be present.

### 3.1 Required Sections

```markdown
## Purpose
One paragraph explaining what problem this skill solves and when to invoke it.

## Domain Knowledge
Key concepts, definitions, equations, and established facts the AI needs to know.
Be precise — this is the core of the skill.

## Reasoning Protocol
Numbered steps guiding the AI through the reasoning process for this domain.
Step 1: ...
Step 2: ...

## Common Pitfalls
Mistakes, misconceptions, and edge cases to avoid.
```

### 3.2 Recommended Sections

```markdown
## Examples
One or more worked examples demonstrating correct application of the skill.

## References
Key papers, textbooks, or resources. Use standard citation format.
```

---

## 4. Example Skill

```markdown
---
name: quantum-entanglement-analysis
description: Guide AI to reason about quantum entanglement in experimental setups. Use when analyzing Bell inequality tests, EPR pairs, or entangled photon experiments.
domain: physics
subdomain: quantum-mechanics
author: Dr. Albert Einstein (ETH Zürich Physics)
expertise_level: advanced
tags: [entanglement, Bell inequality, quantum information, EPR]
dependencies: []
version: 1.0.0
status: draft
---

## Purpose
...

## Domain Knowledge
...

## Reasoning Protocol
Step 1: ...

## Common Pitfalls
...

## Examples
...

## References
...
```

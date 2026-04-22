# Skill Schema

This document defines the specification for ResearchSkills skill files (manually written skills).

> **Skills extracted via /extract-knowhow** are now the primary contribution format. See [Skill Schema Design](../docs/superpowers/specs/2026-04-11-skill-schema-design.md) for the current schema. This document covers only the manual skill file format.

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
name: <string>                  # REQUIRED. Unique identifier. Lowercase, hyphen-separated.
description: <string>           # REQUIRED. 1-2 sentences. When should this skill be invoked?
domain: <string>                # REQUIRED. One of: physics | mathematics | computer-science | quantitative-biology | statistics | eess | economics | quantitative-finance
subdomain: <string>             # optional. More specific area within the domain.
author: <string>                # REQUIRED. "Full Name (Affiliation)"
expertise_level: <string>       # REQUIRED. One of: beginner | intermediate | advanced
status: <string>                # REQUIRED. One of: draft | reviewed | verified
---
```

### 2.1 Field Reference

| Field | Required | Type | Valid Values |
|---|---|---|---|
| `name` | yes | string | lowercase, hyphens only |
| `description` | yes | string | 1-2 sentences |
| `domain` | yes | enum | see list above |
| `subdomain` | no | string | free text |
| `author` | yes | string | "Name (Affiliation)" |
| `expertise_level` | yes | enum | `beginner` `intermediate` `advanced` |
| `status` | yes | enum | `draft` `reviewed` `verified` |

---

## 3. Body Sections

The skill body (after frontmatter) should follow this structure. Sections marked **Required** must be present.

### 3.1 Required Sections

```markdown
## Purpose
One paragraph explaining what problem this skill solves and when to invoke it.

## Domain Knowledge
Key concepts, definitions, equations, and established facts the AI needs to know.

## Reasoning Protocol
Numbered steps guiding the AI through the reasoning process for this domain.

## Common Pitfalls
Mistakes, misconceptions, and edge cases to avoid.
```

### 3.2 Recommended Sections

```markdown
## Examples
One or more worked examples demonstrating correct application of the skill.

## References
Key papers, textbooks, or resources.
```

---

## 4. Extracted Skills Schema

The primary contribution format is now **research skills** — cognitive memory extracted from AI conversation history, organized into procedural (IF-THEN rules), semantic (domain facts), and episodic (research episodes) types.

For the full skill schema specification, see [docs/superpowers/specs/2026-04-11-skill-schema-design.md](../docs/superpowers/specs/2026-04-11-skill-schema-design.md).

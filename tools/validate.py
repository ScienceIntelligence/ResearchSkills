#!/usr/bin/env python3
"""Validate OpenScientist skill files against the schema defined in SKILL_SCHEMA.md."""

import sys
import re
from pathlib import Path

try:
    import yaml
except ImportError:
    print("ERROR: pyyaml not installed. Run: pip install pyyaml")
    sys.exit(1)

REQUIRED_FIELDS = {
    "name": str,
    "description": str,
    "domain": str,
    "author": str,
    "expertise_level": str,
    "version": str,
    "status": str,
}

VALID_DOMAINS = {
    "physics", "mathematics", "computer-science",
    "quantitative-biology", "statistics", "eess",
    "economics", "quantitative-finance",
}

VALID_EXPERTISE_LEVELS = {"beginner", "intermediate", "advanced"}
VALID_STATUSES = {"draft", "reviewed", "verified"}

REQUIRED_SECTIONS = [
    "## Purpose",
    "## Domain Knowledge",
    "## Reasoning Protocol",
    "## Common Pitfalls",
]

SEMVER_RE = re.compile(r"^\d+\.\d+\.\d+$")


def validate_file(path: Path) -> list[str]:
    errors = []
    text = path.read_text(encoding="utf-8")

    # Extract YAML frontmatter
    if not text.startswith("---"):
        errors.append("Missing YAML frontmatter (file must start with ---)")
        return errors

    parts = text.split("---", 2)
    if len(parts) < 3:
        errors.append("Malformed YAML frontmatter (no closing ---)")
        return errors

    try:
        front = yaml.safe_load(parts[1])
    except yaml.YAMLError as e:
        errors.append(f"YAML parse error: {e}")
        return errors

    if not isinstance(front, dict):
        errors.append("Frontmatter is not a YAML mapping")
        return errors

    # Check required fields
    for field, ftype in REQUIRED_FIELDS.items():
        if field not in front or front[field] is None:
            errors.append(f"Missing required field: '{field}'")
        elif not isinstance(front[field], (str, ftype)):
            errors.append(f"Field '{field}' must be a string")

    # Validate enum fields
    if front.get("domain") and front["domain"] not in VALID_DOMAINS:
        errors.append(f"Invalid domain '{front['domain']}'. Must be one of: {sorted(VALID_DOMAINS)}")

    if front.get("expertise_level") and front["expertise_level"] not in VALID_EXPERTISE_LEVELS:
        errors.append(f"Invalid expertise_level '{front['expertise_level']}'. Must be one of: {sorted(VALID_EXPERTISE_LEVELS)}")

    if front.get("status") and front["status"] not in VALID_STATUSES:
        errors.append(f"Invalid status '{front['status']}'. Must be one of: {sorted(VALID_STATUSES)}")

    if front.get("version") and not SEMVER_RE.match(str(front["version"])):
        errors.append(f"Invalid version '{front['version']}'. Must be semver format (e.g. 1.0.0)")

    # Check name matches filename
    expected_name = path.stem
    if front.get("name") and front["name"] != expected_name:
        errors.append(f"'name' field '{front['name']}' does not match filename '{expected_name}'")

    # Check required sections in body
    body = parts[2]
    for section in REQUIRED_SECTIONS:
        if section not in body:
            errors.append(f"Missing required section: '{section}'")

    return errors


def main():
    paths = [Path(p) for p in sys.argv[1:] if p.endswith(".md")]
    if not paths:
        print("Usage: validate.py <skill1.md> [skill2.md ...]")
        sys.exit(1)

    all_ok = True
    for path in paths:
        if not path.exists():
            print(f"SKIP  {path} (file not found)")
            continue
        errors = validate_file(path)
        if errors:
            all_ok = False
            print(f"FAIL  {path}")
            for e in errors:
                print(f"      - {e}")
        else:
            print(f"OK    {path}")

    sys.exit(0 if all_ok else 1)


if __name__ == "__main__":
    main()

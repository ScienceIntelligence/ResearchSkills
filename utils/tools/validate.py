#!/usr/bin/env python3
"""Validate ResearchSkills skill files against the schema defined in SKILL_SCHEMA.md."""

import sys
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
    "status": str,
}

VALID_EXPERTISE_LEVELS = {"beginner", "intermediate", "advanced"}
VALID_STATUSES = {"draft", "reviewed", "verified"}

REQUIRED_SECTIONS = [
    "## Purpose",
    "## Domain Knowledge",
    "## Reasoning Protocol",
    "## Common Pitfalls",
]

REPO_ROOT = Path(__file__).resolve().parent.parent.parent
SKILLS_DIR = REPO_ROOT / "skills"

# Derive valid domains from directory structure (single source of truth)
VALID_DOMAINS = {p.name for p in SKILLS_DIR.iterdir() if p.is_dir() and not p.name.startswith('.')} if SKILLS_DIR.is_dir() else set()


def validate_path(path: Path) -> list[str]:
    """Validate that the skill file is in a correct skills/<domain>/<subdomain>/ directory."""
    errors = []
    try:
        rel = path.resolve().relative_to(SKILLS_DIR)
    except ValueError:
        errors.append(f"File is not under skills/ directory")
        return errors

    parts = rel.parts  # e.g. ('physics', 'quantum-physics', 'my-skill.md')
    if len(parts) < 3:
        errors.append(f"File must be in skills/<domain>/<subdomain>/, got: skills/{'/'.join(parts)}")
        return errors

    domain, subdomain = parts[0], parts[1]
    if domain not in VALID_DOMAINS:
        errors.append(f"Invalid domain folder '{domain}'. Must be one of: {sorted(VALID_DOMAINS)}")

    subdomain_dir = SKILLS_DIR / domain / subdomain
    if not subdomain_dir.is_dir():
        errors.append(f"Subdomain folder 'skills/{domain}/{subdomain}/' does not exist")

    return errors


def validate_file(path: Path) -> list[str]:
    errors = []

    # Validate file path structure
    errors.extend(validate_path(path))

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

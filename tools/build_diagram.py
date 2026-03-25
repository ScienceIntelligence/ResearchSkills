#!/usr/bin/env python3
"""
Scan skills/ folder structure and regenerate the Mermaid knowledge tree
in README.md. Run this whenever a new domain or subdomain folder is added.

Usage:
    python tools/build_diagram.py
"""

import re
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
SKILLS_DIR = REPO_ROOT / "skills"
README = REPO_ROOT / "readme.md"

DOMAIN_EMOJI = {
    "physics":              "⚛️",
    "mathematics":          "➗",
    "computer-science":     "💻",
    "quantitative-biology": "🧬",
    "statistics":           "📊",
    "eess":                 "⚡",
    "economics":            "📈",
    "quantitative-finance": "💹",
}

# Broad groupings for colour coding (arXiv-aligned)
NATURAL_SCIENCES = {"physics", "quantitative-biology", "eess"}
FORMAL_SCIENCES  = {"mathematics", "computer-science", "statistics", "economics", "quantitative-finance"}


def label(name: str) -> str:
    return name.replace("-", " ").title()


def node_id(path: str) -> str:
    return path.upper().replace("-", "_").replace("/", "__")


def scan() -> dict[str, list[str]]:
    """Returns {domain: [subdomain, ...]} sorted alphabetically."""
    tree: dict[str, list[str]] = {}
    for d in sorted(SKILLS_DIR.iterdir()):
        if not d.is_dir() or d.name.startswith("_"):
            continue
        subs = sorted(
            s.name for s in d.iterdir()
            if s.is_dir() and not s.name.startswith("_")
        )
        tree[d.name] = subs
    return tree


def generate(tree: dict[str, list[str]]) -> str:
    lines = ["graph TD"]
    lines.append('    ROOT(("🌍 OpenScientist"))')
    lines.append("")

    domain_ids:    list[str] = []
    sub_ids:       list[str] = []
    nat_group_ids: list[str] = []
    for_group_ids: list[str] = []

    # Group intermediate nodes
    has_nat = any(d in NATURAL_SCIENCES for d in tree)
    has_for = any(d in FORMAL_SCIENCES  for d in tree)

    if has_nat:
        lines.append('    ROOT --> NAT("🔬 Natural Sciences")')
        nat_group_ids.append("NAT")
    if has_for:
        lines.append('    ROOT --> FORM("📐 Formal Sciences")')
        for_group_ids.append("FORM")

    lines.append("")

    for domain, subdomains in tree.items():
        emoji = DOMAIN_EMOJI.get(domain, "🔬")
        did   = node_id(domain)
        lbl   = label(domain)
        domain_ids.append(did)

        if domain in NATURAL_SCIENCES:
            parent = "NAT"
        elif domain in FORMAL_SCIENCES:
            parent = "FORM"
        else:
            parent = "ROOT"

        lines.append(f'    {parent} --> {did}("{emoji} {lbl}")')

        for sub in subdomains:
            sid = node_id(f"{domain}/{sub}")
            sub_ids.append(sid)
            lines.append(f'    {did} --> {sid}["{label(sub)}"]')

        if subdomains:
            lines.append("")

    lines.append("")
    lines.append("    classDef root    fill:#1a1a2e,stroke:#4A90D9,stroke-width:3px,color:#fff,font-weight:bold")
    lines.append("    classDef group   fill:#16213e,stroke:#4A90D9,stroke-width:2px,color:#7eb8f7,font-weight:bold")
    lines.append("    classDef domain  fill:#0f3460,stroke:#4A90D9,stroke-width:1.5px,color:#a8d4ff")
    lines.append("    classDef subdomain fill:#ffffff,stroke:#d0d7de,stroke-width:1px,color:#24292f")
    lines.append("")
    lines.append("    class ROOT root")

    group_ids = nat_group_ids + for_group_ids
    if group_ids:
        lines.append(f"    class {','.join(group_ids)} group")
    if domain_ids:
        lines.append(f"    class {','.join(domain_ids)} domain")
    if sub_ids:
        lines.append(f"    class {','.join(sub_ids)} subdomain")

    return "\n".join(lines)


def update_readme(mermaid: str) -> None:
    text = README.read_text(encoding="utf-8")
    pattern = re.compile(r"```mermaid\ngraph TD.*?```", re.DOTALL)
    replacement = f"```mermaid\n{mermaid}\n```"
    new_text, n = pattern.subn(replacement, text)
    if n == 0:
        raise ValueError("Could not find mermaid graph TD block in README")
    README.write_text(new_text, encoding="utf-8")
    print(f"Updated {README} ({n} block(s) replaced)")


if __name__ == "__main__":
    tree    = scan()
    mermaid = generate(tree)
    update_readme(mermaid)
    print("Done. Domains found:", list(tree.keys()))
    for d, subs in tree.items():
        if subs:
            print(f"  {d}/: {subs}")

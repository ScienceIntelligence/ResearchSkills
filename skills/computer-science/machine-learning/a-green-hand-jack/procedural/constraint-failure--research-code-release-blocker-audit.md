---
name: "Research Code Release Blocker Audit"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: machine-learning
contributor: a-green-hand-jack
---

# Research Code Release Blocker Audit

## When

Use this when preparing an ML or scientific code repository for public release alongside a paper, arXiv preprint, conference submission, GitHub release, or reproducibility package.

Exclude purely private internal handoffs where no public artifact will be created.

## Decision

Preferred: perform a blocker audit before generating release polish. First check for secrets, credentials, private paths, large binaries, missing license, missing citation metadata, skeletal README, committed outputs, and reproducibility gaps.

Rejected: start by writing release notes or improving the README while security, legal, or artifact-size risks remain unknown.

Reasoning: public research releases fail most severely when they leak private credentials or publish unreproducible artifacts. Documentation polish is secondary until blockers are classified.

## Local Verifiers

- Search code and config files for password, token, API key, credential, private key, and secret patterns.
- Find sensitive files such as `.env`, key files, private certificates, secrets files, and credential JSON files.
- Find large files over the repository's intended threshold, excluding deliberately externalized outputs.
- Check whether README, LICENSE, CITATION, dependency files, and ignore rules exist.
- Inspect git status and recent commits before tagging or publishing.

## Failure Handling

If secrets or credentials are found, stop release work and ask the user to remove and rotate them before continuing.

If large artifacts are present, move them to an external release channel such as a model hub, dataset repository, or release asset instead of committing them as ordinary source files.

If README or citation metadata is missing, generate them with explicit TODO markers for claims that require author-provided numbers, URLs, or model-weight locations.

## Anti-exemplars

Do not create a public tag or GitHub release while blockers remain unresolved.

Do not overwrite a substantial existing README without explicit user approval; identify missing sections instead.

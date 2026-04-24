---
name: "Submission Readiness Checks For Anonymous Papers"
memory_type: procedural
subtype: constraint-failure
domain: computer-science
subdomain: machine-learning
contributor: a-green-hand-jack
---

# Submission Readiness Checks For Anonymous Papers

## When

Use this before submitting a LaTeX ML, NLP, CV, or computer-science paper to a conference, especially for anonymous review, camera-ready, or arXiv conversion.

Exclude ordinary draft editing where the goal is prose quality rather than submission compliance.

## Decision

Preferred: run a systematic readiness check that separates blocking failures from warnings. Verify submission mode, anonymity, TODO artifacts, bibliography wiring, mandatory venue sections, abstract length, figure and table references, and optional compilation/page-count status.

Rejected: only compile the PDF and assume successful compilation means the paper is submission-ready.

Reasoning: many submission failures are semantic or policy failures rather than LaTeX compilation failures. Anonymous review can be broken by acknowledgements, personal URLs, funding disclosures, author macros, or wrong style options even when the PDF builds.

## Local Verifiers

- `main.tex` and venue preamble exist and use the intended anonymous, preprint, or camera-ready mode.
- TODO, FIXME, colored revision macros, and author comment macros are absent or intentionally retained.
- Acknowledgements, funding disclosures, email addresses, and personal URLs are removed or hidden for anonymous submission.
- Required venue sections such as limitations, broader impact, ethics, or checklist are present when applicable.
- Bibliography files are non-empty and connected to the main document.
- Figure and table labels are referenced in text.
- Compilation output has no unresolved references, missing citations, or page-limit surprises when compilation is requested.

## Failure Handling

If the submission mode is wrong, edit only the central venue preamble or equivalent style switch rather than changing scattered style commands.

If anonymity blockers are found, show file and line references and ask before removing content that may be needed for camera-ready or arXiv versions.

If mandatory sections are missing, add explicit placeholders only with user approval because placeholder text may still be a submission risk.

## Anti-exemplars

Do not treat a clean LaTeX build as sufficient evidence of readiness.

Do not automatically remove acknowledgements or author information when the target mode is camera-ready or arXiv.

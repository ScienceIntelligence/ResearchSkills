## Submission Type

- [ ] **Research Skill** — extracted via `/researchskills-extract`, converted via `/researchskills-convert`, or written by hand using the research skill templates
- [ ] **Decision Tree** — research trajectory extracted via `/researchskills-extract` or web prompt
- [ ] **Skill (from Gemini/ChatGPT/Claude Web UI)** — submit via [here](https://researchskills.ai/submit-manually)
- [ ] **Skill (legacy)** — manually written skill file using the legacy template (`_template.md`)

---

### For Research Skill submissions:

**Domain / Subdomain:** <!-- e.g. physics / geophysics -->

- [ ] Files are placed in `skills/<domain>/<subdomain>/<contributor>/<memory_type>/`
- [ ] Filenames follow the pattern `<subtype>--<skill-name>.md` (lowercase, hyphen-separated)
- [ ] All **required** frontmatter fields are filled in (`name`, `memory_type`, `subtype`, `domain`, `subdomain`, `contributor`)
- [ ] All **required** body sections are present for each memory type:
  - Procedural: When, Decision, Local Verifiers, Failure Handling
  - Semantic: Fact, Evidence, Expiry Signal (+ LLM Default Belief for `correction`)
  - Episodic: Situation, Action, Outcome, Lesson, Retrieval Cues
- [ ] Content is de-identified (no personal names, private file paths, internal URLs)
- [ ] All content is in English

### For Decision Tree submissions:

- [ ] JSON file is placed in the correct location
- [ ] Tree is de-identified (no personal names, file paths, private URLs)
- [ ] Anchor is specified (paper URL/DOI or project description)
- [ ] All nodes have valid action types (20 core types or `other`)
- [ ] I have reviewed the tree for accuracy

### For Skill (legacy) submissions:

**Domain:** <!-- e.g. physics / quantum-physics -->
**Skill name:** <!-- value of the `name` frontmatter field -->

- [ ] File is placed in the correct `skills/<domain>/<subdomain>/` folder
- [ ] Filename is lowercase and hyphen-separated
- [ ] All **required** frontmatter fields are filled in (`name`, `description`, `domain`, `author`, `expertise_level`, `status: draft`)
- [ ] All **required** body sections are present: Purpose, Domain Knowledge, Reasoning Protocol, Common Pitfalls
- [ ] `python utils/tools/validate.py <path-to-skill>` passes locally
- [ ] I am a domain expert in this area (or have collaborated with one)

### Summary
<!-- Brief description of what this submission covers -->

### Notes for reviewer
<!-- Anything the reviewer should pay special attention to -->

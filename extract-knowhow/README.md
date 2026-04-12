# @openscientist/extract-knowhow

> Automatically extract **research skills** from Claude Code conversation history and submit them to [OpenScientist](https://github.com/OpenScientists/OpenScientist).

## What It Does

When you use Claude Code for scientific research — data analysis, paper writing, experiment design, theoretical derivation — your conversations contain valuable tacit knowledge: judgment calls, abandoned approaches, tool choices, and reasoning patterns.

`/extract-knowhow` extracts three types of cognitive memory from your research sessions:

- **Procedural memory:** IF-THEN rules for navigating research impasses (e.g., "IF gradient explodes THEN check learning rate before architecture")
- **Semantic memory:** Domain facts that LLMs don't reliably know (e.g., calibration constants, undocumented tool behaviors)
- **Episodic memory:** Concrete research episodes capturing what was tried, what failed, and what was learned

## Install

```bash
npm install -g @openscientist/extract-knowhow
```

This installs the command automatically:
- **Claude Code** → `~/.claude/commands/extract-knowhow.md`

## Usage

```
/extract-knowhow
```

The command will:

1. **Scan** all your Claude Code sessions
2. **Format** research-related sessions (ignoring engineering/casual conversations)
3. **Extract** research skills using AI, organized by cognitive memory type:
   - Procedural rules for research decision-making
   - Semantic facts missing from LLM training data
   - Episodic traces of concrete research attempts and outcomes
4. **Validate** extracted skills for completeness and de-identification
5. **Upload** your skills to OpenScientist via GitHub

## Output

A markdown skill file organized by cognitive memory type:

```markdown
## Procedural Memory
- IF model loss plateaus after 50 epochs THEN try reducing learning rate
  by 10x before changing architecture BECAUSE architecture changes are
  expensive and LR is the most common culprit

## Semantic Memory
- Library X's default tokenizer silently truncates inputs over 512 tokens
  without warning

## Episodic Memory
- Attempted approach A for protein folding prediction; failed due to
  insufficient training data. Pivoted to approach B with data augmentation,
  which achieved 15% improvement over baseline.
```

## Contributing Back

After reviewing your extracted skills:

- [**Submit via GitHub Issue →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=01-submit-skill.yml) (paste the markdown — no git required!)
- Or open a PR if you prefer git

## Uninstall

```bash
npm uninstall -g @openscientist/extract-knowhow
```

## Privacy

- All analysis happens locally via your Claude Code session
- Session data is read from `~/.claude/projects/` on your machine
- No data is sent to external servers beyond your normal Claude Code API usage
- AI auto-strips personal information; you review before submitting
- You choose what to submit — nothing is sent without your explicit action

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## Part of [OpenScientist](https://github.com/OpenScientists/OpenScientist)

> Building the Library of Alexandria for AGI — Accelerating Automated Scientific Discovery.

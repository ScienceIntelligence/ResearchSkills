# Contributing to OpenScientist

Thank you for contributing your expertise! This guide walks you through writing and submitting a skill.

---

## What is a Skill?

A skill is a single Markdown file (`.md`) with YAML frontmatter that encodes expert-level domain knowledge for Claude Code. When invoked, the skill instructs the AI to reason as a domain expert would.

---

## Step-by-Step Guide

### 1. Fork & clone

```bash
git clone https://github.com/YOUR_USERNAME/OpenScientist.git
cd OpenScientist
```

### 2. Create your skill file

Copy the template and place it in the correct domain folder:

```bash
cp skills/_template.md skills/<domain>/<your-skill-name>.md
```

**File naming:** lowercase, hyphen-separated. Examples:
- `skills/physics/quantum-entanglement.md`
- `skills/biology/crispr-gene-editing.md`
- `skills/cross-domain/ai-drug-discovery.md`

### 3. Fill in the template

Open your new file and complete every section. See [SKILL_SCHEMA.md](SKILL_SCHEMA.md) for a full description of each frontmatter field.

Required frontmatter fields:
- `name`, `description`, `domain`, `author`, `expertise_level`, `version`, `status`

### 4. Validate locally (optional but recommended)

```bash
python tools/validate.py skills/<domain>/<your-skill-name>.md
```

### 5. Open a Pull Request

- Target branch: `main`
- Title format: `[<domain>] Add <skill-name> skill`
- The PR template will prompt you for a checklist

A domain maintainer listed in [CODEOWNERS](CODEOWNERS) will review your submission for scientific accuracy.

---

## Review Process

| Stage | Who | What they check |
|---|---|---|
| CI (automated) | GitHub Actions | Frontmatter schema validity |
| Domain review | Domain maintainer | Scientific accuracy, completeness |
| Merge | Domain maintainer | Approve + merge |

After merge, `status` starts as `draft`. It becomes `reviewed` once a maintainer signs off, and `verified` after real-world testing.

---

## Code of Conduct

- Be respectful and constructive
- Cite your sources
- Don't submit skills outside your domain of expertise without collaborating with a domain expert

---

## Questions?

Open a GitHub Discussion or reach out to the core team via issues.

---

---

# 贡献指南（中文）

感谢你贡献专业知识！本指南将引导你完成撰写和提交 Skill 的全流程。

---

## 什么是 Skill？

Skill 是一个带有 YAML frontmatter 的 Markdown 文件，将专家级领域知识编码供 Claude Code 使用。调用时，Skill 会指示 AI 像领域专家一样进行推理。

---

## 操作步骤

### 1. Fork 并克隆仓库

```bash
git clone https://github.com/YOUR_USERNAME/OpenScientist.git
cd OpenScientist
```

### 2. 创建你的 Skill 文件

复制模板，放置到对应领域文件夹：

```bash
cp skills/_template.md skills/<领域>/<你的skill名称>.md
```

**命名规范：** 小写字母，用连字符分隔。例如：
- `skills/physics/quantum-entanglement.md`
- `skills/biology/crispr-gene-editing.md`

### 3. 填写模板

打开新文件，完成每个部分。参阅 [SKILL_SCHEMA.md](SKILL_SCHEMA.md) 了解各字段说明。

必填 frontmatter 字段：
- `name`、`description`、`domain`、`author`、`expertise_level`、`version`、`status`

### 4. 本地验证（推荐）

```bash
python tools/validate.py skills/<领域>/<你的skill名称>.md
```

### 5. 提交 Pull Request

- 目标分支：`main`
- 标题格式：`[<领域>] Add <skill名称> skill`
- PR 模板会提示你完成检查清单

[CODEOWNERS](CODEOWNERS) 中列出的领域维护者将审核你的提交。

---

## 审核流程

| 阶段 | 负责人 | 检查内容 |
|---|---|---|
| CI（自动）| GitHub Actions | Frontmatter schema 合规性 |
| 领域审核 | 领域维护者 | 科学准确性、完整性 |
| 合并 | 领域维护者 | 批准并合并 |

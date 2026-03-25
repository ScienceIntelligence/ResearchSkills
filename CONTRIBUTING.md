# Contributing to OpenScientist

Thank you for contributing your expertise! This guide walks you through writing and submitting a skill.

---

## 1. What is a Skill?

A skill is a single Markdown file (`.md`) with YAML frontmatter that encodes expert-level domain knowledge for Claude Code. When invoked, the skill instructs the AI to reason as a domain expert would.

---

## 2. Step-by-Step Guide

### 2.1 Fork & clone

```bash
git clone https://github.com/YOUR_USERNAME/OpenScientist.git
cd OpenScientist
```

### 2.2 Create your skill file

Copy the template and place it in the correct subdomain folder:

```bash
cp skills/_template.md skills/<domain>/<subdomain>/<your-skill-name>.md
```

**File naming:** lowercase, hyphen-separated. Examples:
- `skills/physics/quantum-physics/quantum-entanglement.md`
- `skills/computer-science/machine-learning/transformer-architectures.md`

### 2.3 Fill in the template

Open your new file and complete every section. See [SKILL_SCHEMA.md](SKILL_SCHEMA.md) for a full description of each frontmatter field.

Required frontmatter fields:
- `name`, `description`, `domain`, `author`, `expertise_level`, `version`, `status`

### 2.4 Validate locally (optional but recommended)

```bash
python tools/validate.py skills/<domain>/<subdomain>/<your-skill-name>.md
```

### 2.5 Open a Pull Request

- Target branch: `main`
- Title format: `[<domain>/<subdomain>] Add <skill-name> skill`
- The PR template will prompt you for a checklist

A domain maintainer listed in [CODEOWNERS](CODEOWNERS) will review your submission for scientific accuracy.

---

## 3. Propose a New Area

Don't see your field represented? You can propose a new **subdomain** (a folder within an existing domain) or an entirely new **top-level domain**.

### 3.1 New subdomain

All 131 arXiv-aligned subdomain folders are pre-created under `skills/`. If you believe a subdomain is missing, create it directly in your PR alongside your first skill:

```bash
mkdir skills/physics/your-new-subdomain
cp skills/_template.md skills/physics/your-new-subdomain/your-skill.md
```

### 3.2 New top-level domain (e.g. `skills/earth-science/`)

A new top-level domain requires broader consensus. Open a **GitHub Issue** first using the *Propose New Area* template before submitting a PR:

1. [Open an issue](https://github.com/HHHHHejia/OpenScientist/issues/new?template=propose-new-area.md) with the *Propose New Area* template
2. Describe the domain, why it belongs here, and who will maintain it
3. Once the core team approves (label: `area: accepted`), submit a PR that includes:
   - `skills/<new-domain>/README.md` — domain overview and maintainer info
   - At least one initial skill file
   - An updated `CODEOWNERS` entry for the new folder

### 3.3 What makes a good area proposal?

- Clear scope: skills in this area are distinct and non-overlapping with existing domains
- An identified expert willing to serve as maintainer
- At least 3–5 skills that could realistically be contributed

---

## 4. Review Process

| Stage | Who | What they check |
|---|---|---|
| CI (automated) | GitHub Actions | Frontmatter schema validity |
| Domain review | Domain maintainer | Scientific accuracy, completeness |
| Merge | Domain maintainer | Approve + merge |

After merge, `status` starts as `draft`. It becomes `reviewed` once a maintainer signs off, and `verified` after real-world testing.

---

## 5. Code of Conduct

- Be respectful and constructive
- Cite your sources
- Don't submit skills outside your domain of expertise without collaborating with a domain expert

---

## 6. Questions?

Open a GitHub Discussion or reach out to the core team via issues.

---

---

# 贡献指南（中文）

感谢你贡献专业知识！本指南将引导你完成撰写和提交 Skill 的全流程。

---

## 1. 什么是 Skill？

Skill 是一个带有 YAML frontmatter 的 Markdown 文件，将专家级领域知识编码供 Claude Code 使用。调用时，Skill 会指示 AI 像领域专家一样进行推理。

---

## 2. 操作步骤

### 2.1 Fork 并克隆仓库

```bash
git clone https://github.com/YOUR_USERNAME/OpenScientist.git
cd OpenScientist
```

### 2.2 创建你的 Skill 文件

复制模板，放置到对应子领域文件夹：

```bash
cp skills/_template.md skills/<领域>/<子领域>/<你的skill名称>.md
```

**命名规范：** 小写字母，用连字符分隔。例如：
- `skills/physics/quantum-physics/quantum-entanglement.md`
- `skills/computer-science/machine-learning/transformer-architectures.md`

### 2.3 填写模板

打开新文件，完成每个部分。参阅 [SKILL_SCHEMA.md](SKILL_SCHEMA.md) 了解各字段说明。

必填 frontmatter 字段：
- `name`、`description`、`domain`、`author`、`expertise_level`、`version`、`status`

### 2.4 本地验证（推荐）

```bash
python tools/validate.py skills/<领域>/<子领域>/<你的skill名称>.md
```

### 2.5 提交 Pull Request

- 目标分支：`main`
- 标题格式：`[<领域>/<子领域>] Add <skill名称> skill`
- PR 模板会提示你完成检查清单

[CODEOWNERS](CODEOWNERS) 中列出的领域维护者将审核你的提交。

---

## 3. 提议新领域或子领域

没有看到你的研究方向？你可以提议新的**子领域**（在已有领域下新建文件夹）或全新的**顶层领域**。

### 3.1 新子领域

所有 131 个 arXiv 对齐的子领域文件夹已预创建在 `skills/` 下。如果你认为缺少某个子领域，可以直接在 PR 中新建：

```bash
mkdir skills/physics/your-new-subdomain
cp skills/_template.md skills/physics/your-new-subdomain/your-skill.md
```

### 3.2 新顶层领域（例如 `skills/earth-science/`）

新顶层领域需要更广泛的共识。请先通过 **GitHub Issue** 提议，再提交 PR：

1. [创建 Issue](https://github.com/HHHHHejia/OpenScientist/issues/new?template=propose-new-area.md)，使用 *Propose New Area* 模板
2. 描述该领域、为什么适合加入本仓库、谁来担任维护者
3. 核心团队批准后（标签：`area: accepted`），提交 PR，包含：
   - `skills/<新领域>/README.md` —— 领域概述与维护者信息
   - 至少一个初始 Skill 文件
   - 更新 `CODEOWNERS` 中对应的条目

### 3.3 好的领域提议应具备

- 明确的范围：与现有领域不重叠
- 已确定愿意担任维护者的专家
- 至少可以预见贡献 3–5 个 Skill

---

## 4. 审核流程

| 阶段 | 负责人 | 检查内容 |
|---|---|---|
| CI（自动）| GitHub Actions | Frontmatter schema 合规性 |
| 领域审核 | 领域维护者 | 科学准确性、完整性 |
| 合并 | 领域维护者 | 批准并合并 |

# Contributing to ResearchSkills

Thank you for contributing your expertise! There are two ways to contribute:

1. **Research Skills (recommended):** Use `/extract-knowhow` to automatically extract research skills from AI conversation history. This is the primary contribution method.
2. **Skills (manual):** Write a skill file by hand following the template.

---

## 1. Submit Research Skills (Recommended)

### Via Claude Code / Codex

```bash
npm install -g @researchskills/extract-knowhow
```

Then in Claude Code: `/extract-knowhow`
Or in Codex: `$extract-knowhow`

The tool scans your conversation history, extracts research skills (procedural, semantic, and episodic), and opens a browser review page. After reviewing, submit via GitHub.

### Via Web (ChatGPT / Claude / Gemini)

Use the one-click prompt from the [README](https://github.com/ScienceIntelligence/ResearchSkills#method-b-one-click-prompt-for-web-users-chatgpt--claude--gemini), then submit via [**Submit a Skill →**](https://researchskills.ai/submit-manually)

---

## 2. Write a Skill Manually

### 2.1 Fork & clone

```bash
git clone https://github.com/YOUR_USERNAME/ResearchSkills.git
cd ResearchSkills
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
- `name`, `description`, `domain`, `author`, `expertise_level`, `status`

### 2.4 Validate locally (optional but recommended)

```bash
python utils/tools/validate.py skills/<domain>/<subdomain>/<your-skill-name>.md
```

### 2.5 Open a Pull Request

- Target branch: `main`
- Title format: `[<domain>/<subdomain>] Add <skill-name> skill`
- The PR template will prompt you for a checklist

A domain reviewer listed in [CODEOWNERS](../.github/CODEOWNERS) will review your submission for scientific accuracy.

---

## 3. Propose a New Area

All 155 arXiv-aligned subcategory folders are pre-created under `skills/`. If you believe a subdomain is missing or want to propose a new top-level domain, [**open an issue →**](https://github.com/ScienceIntelligence/ResearchSkills/issues/new?template=04-propose-new-area.md)

---

## 4. Review Process

| Stage | Who | What they check |
|---|---|---|
| CI (automated) | GitHub Actions | Schema validity |
| Domain review | Domain reviewer | Scientific accuracy, completeness |
| Merge | Domain reviewer | Approve + merge |

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

感谢你贡献专业知识！有两种贡献方式：

1. **科研技能（推荐）：** 使用 `/extract-knowhow` 从 AI 对话历史中自动提取科研技能。这是主要的贡献方式。
2. **Skill（手动）：** 参照模板手动撰写 Skill 文件。

---

## 1. 提交科研技能（推荐）

### 通过 Claude Code / Codex

```bash
npm install -g @researchskills/extract-knowhow
```

在 Claude Code 中运行: `/extract-knowhow`
在 Codex 中运行: `$extract-knowhow`

工具会扫描你的对话历史，提取科研技能（程序性、语义性和情景性），并在浏览器中打开审阅页面。审阅后通过 GitHub 提交。

### 通过网页版（ChatGPT / Claude / Gemini）

使用 [README](https://github.com/ScienceIntelligence/ResearchSkills#方式-b网页版用户一键提取chatgpt--claude--gemini) 中的一键 prompt，然后通过 [**提交 Skill →**](https://researchskills.ai/submit-manually) 提交。

---

## 2. 手动撰写 Skill

### 2.1 Fork 并克隆仓库

```bash
git clone https://github.com/YOUR_USERNAME/ResearchSkills.git
cd ResearchSkills
```

### 2.2 创建你的 Skill 文件

复制模板，放置到对应子领域文件夹：

```bash
cp skills/_template.md skills/<领域>/<子领域>/<你的skill名称>.md
```

**命名规范：** 小写字母，用连字符分隔。

### 2.3 填写模板

打开新文件，完成每个部分。参阅 [SKILL_SCHEMA.md](SKILL_SCHEMA.md) 了解各字段说明。

必填 frontmatter 字段：
- `name`、`description`、`domain`、`author`、`expertise_level`、`status`

### 2.4 本地验证（推荐）

```bash
python utils/tools/validate.py skills/<领域>/<子领域>/<你的skill名称>.md
```

### 2.5 提交 Pull Request

- 目标分支：`main`
- 标题格式：`[<领域>/<子领域>] Add <skill名称> skill`

[CODEOWNERS](../.github/CODEOWNERS) 中列出的领域维护者将审核你的提交。

---

## 3. 提议新领域或子领域

所有 155 个 arXiv 对齐的子领域文件夹已预创建在 `skills/` 下。如果你认为缺少某个子领域或想提议新的顶层领域，[**提交 Issue →**](https://github.com/ScienceIntelligence/ResearchSkills/issues/new?template=04-propose-new-area.md)

---

## 4. 审核流程

| 阶段 | 负责人 | 检查内容 |
|---|---|---|
| CI（自动）| GitHub Actions | Schema 合规性 |
| 领域审核 | 领域维护者 | 科学准确性、完整性 |
| 合并 | 领域维护者 | 批准并合并 |

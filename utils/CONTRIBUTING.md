# Contributing to ResearchSkills

Thank you for contributing your expertise! There are three ways to contribute:

1. **Extract from AI history (recommended):** Use `/researchskills-extract` to automatically extract research skills from your Claude Code or Codex conversation history.
2. **Convert existing skills:** Use `/researchskills-convert` to convert skills you already have (notes, documents, any format) into ResearchSkills format and open a PR.
3. **Write manually:** Write a skill file by hand following the templates.

---

## 1. Extract from AI History (Recommended)

### Via Claude Code / Codex

```bash
npm install -g @scienceintelligence/researchskills-extract
```

Then in Claude Code: `/researchskills-extract`
Or in Codex: `$researchskills-extract`

The tool scans your conversation history, extracts research skills (procedural, semantic, and episodic), and opens a browser review page. After reviewing, submit via GitHub.

### Via Web (ChatGPT / Claude / Gemini)

https://researchskills.ai/submit-manually

---

## 2. Convert Existing Skills

Already have research skills in notes, documents, or any format? Use `/researchskills-convert` to convert them and open a PR — all in one step.

```bash
npm install -g @scienceintelligence/researchskills-extract
```

Then in Claude Code: `/researchskills-convert`
Or in Codex: `$researchskills-convert`

The command will ask where your skills are (file path or directory), read them, convert each one into the correct format, and open a PR to this repository. It handles forking, branching, file placement, and de-identification automatically.

---

## 3. Write a Skill Manually

### 3.1 Fork & clone

```bash
git clone https://github.com/YOUR_USERNAME/ResearchSkills.git
cd ResearchSkills
```

### 3.2 Create your skill file

Pick the template matching your skill type and copy it to the correct location:

```bash
# Procedural — IF-THEN rules for research decisions
cp skills/_template-procedural.md skills/<domain>/<subdomain>/<your-username>/procedural/<subtype>--<skill-name>.md

# Semantic — domain facts LLMs don't reliably know
cp skills/_template-semantic.md skills/<domain>/<subdomain>/<your-username>/semantic/<subtype>--<skill-name>.md

# Episodic — concrete research episodes
cp skills/_template-episodic.md skills/<domain>/<subdomain>/<your-username>/episodic/<subtype>--<skill-name>.md
```

**File naming:** `<subtype>--<skill-name>.md`, lowercase, hyphen-separated. Examples:
- `skills/physics/geophysics/jdoe/procedural/tie--exploiting-cross-domain-concepts.md`
- `skills/computer-science/machine-learning/jdoe/semantic/correction--batch-norm-placement.md`
- `skills/physics/geophysics/jdoe/episodic/failure--gradient-explosion-under-fp16.md`

> The legacy template (`skills/_template.md`) is still supported for backward compatibility.

### 3.3 Fill in the template

Open your new file and complete every section. Required frontmatter fields:
- `name`, `memory_type`, `subtype`, `domain`, `subdomain`, `contributor`

### 3.4 Open a Pull Request

- Target branch: `main`
- Title format: `[<domain>/<subdomain>] Add <skill-name> research skill`
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

感谢你贡献专业知识！有三种贡献方式：

1. **从 AI 历史中提取（推荐）：** 使用 `/researchskills-extract` 从 Claude Code 或 Codex 对话历史中自动提取科研技能。
2. **转换已有技能：** 使用 `/researchskills-convert` 将你已有的技能（笔记、文档、任何格式）转换为 ResearchSkills 格式并自动提交 PR。
3. **手动撰写：** 参照模板手动撰写 Skill 文件。

---

## 1. 从 AI 历史中提取（推荐）

### 通过 Claude Code / Codex

```bash
npm install -g @scienceintelligence/researchskills-extract
```

在 Claude Code 中运行: `/researchskills-extract`
在 Codex 中运行: `$researchskills-extract`

工具会扫描你的对话历史，提取科研技能（程序性、语义性和情景性），并在浏览器中打开审阅页面。审阅后通过 GitHub 提交。

### 通过网页版（ChatGPT / Claude / Gemini）

https://researchskills.ai/submit-manually

---

## 2. 转换已有技能

已有科研技能记录——笔记、文档或任何格式？使用 `/researchskills-convert` 一键转换并提交 PR。

```bash
npm install -g @scienceintelligence/researchskills-extract
```

在 Claude Code 中运行: `/researchskills-convert`
在 Codex 中运行: `$researchskills-convert`

该命令会询问你的技能文件位置（文件路径或目录），读取并转换为正确格式，然后自动向本仓库提交 PR。Fork、分支创建、文件放置和去标识化均自动完成。

---

## 3. 手动撰写 Skill

### 3.1 Fork 并克隆仓库

```bash
git clone https://github.com/YOUR_USERNAME/ResearchSkills.git
cd ResearchSkills
```

### 3.2 创建你的 Skill 文件

选择对应类型的模板，复制到正确位置：

```bash
# 程序性 — 科研决策的 IF-THEN 规则
cp skills/_template-procedural.md skills/<领域>/<子领域>/<用户名>/procedural/<子类型>--<技能名>.md

# 语义性 — LLM 不可靠掌握的领域知识
cp skills/_template-semantic.md skills/<领域>/<子领域>/<用户名>/semantic/<子类型>--<技能名>.md

# 情景性 — 具体科研经历
cp skills/_template-episodic.md skills/<领域>/<子领域>/<用户名>/episodic/<子类型>--<技能名>.md
```

**命名规范：** `<子类型>--<技能名>.md`，小写字母，用连字符分隔。

> 旧版模板（`skills/_template.md`）仍然支持向后兼容。

### 3.3 填写模板

打开新文件，完成每个部分。必填 frontmatter 字段：
- `name`、`memory_type`、`subtype`、`domain`、`subdomain`、`contributor`

### 3.4 提交 Pull Request

- 目标分支：`main`
- 标题格式：`[<领域>/<子领域>] Add <技能名> research skill`

[CODEOWNERS](../.github/CODEOWNERS) 中列出的领域维护者将审核你的提交。

---

## 4. 提议新领域或子领域

所有 155 个 arXiv 对齐的子领域文件夹已预创建在 `skills/` 下。如果你认为缺少某个子领域或想提议新的顶层领域，[**提交 Issue →**](https://github.com/ScienceIntelligence/ResearchSkills/issues/new?template=04-propose-new-area.md)

---

## 5. 审核流程

| 阶段 | 负责人 | 检查内容 |
|---|---|---|
| CI（自动）| GitHub Actions | Schema 合规性 |
| 领域审核 | 领域维护者 | 科学准确性、完整性 |
| 合并 | 领域维护者 | 批准并合并 |

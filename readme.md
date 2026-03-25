<div align="right">

[English](#-openscientist) · [中文](#中文版本)

</div>

<div align="center">

# 🌍 OpenScientist

[![GitHub stars](https://img.shields.io/github/stars/HHHHHejia/OpenScientist?style=social)](https://github.com/HHHHHejia/OpenScientist/stargazers) [![GitHub forks](https://img.shields.io/github/forks/HHHHHejia/OpenScientist?style=social)](https://github.com/HHHHHejia/OpenScientist/fork) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> *"Wer nicht von dreitausend Jahren sich weiß Rechenschaft zu geben,*
> *bleibt im Dunkeln unerfahren, mag von Tag zu Tage leben."*
>
> 不能汲取三千年历史经验的人，没有未来可言。
>
> *He who cannot draw on three thousand years of history is living hand to mouth.*
>
> — **Johann Wolfgang von Goethe**

<br>

**Our mission:** Unite the knowledge of the world's top experts across every domain — to accelerate AI-driven scientific discovery.

**Call for action:** Share your research expertise. Together, we create the AI-era Einstein, Da Vinci, and Kant.

<p align="center">
  <a href="https://hhhhhejia.github.io/OpenScientist/">
    <img src="https://raw.githubusercontent.com/HHHHHejia/OpenScientist/main/utils/assets/knowledge-tree-v2.png" alt="Knowledge Tree" width="100%">
  </a>
</p>

<p align="center">
  <a href="https://hhhhhejia.github.io/OpenScientist/">View Interactive Knowledge Tree →</a>
</p>

---

<h2 align="center">1. About OpenScientist</h2>

</div>

### 1.1 What is it

OpenScientist is a curated library of **Claude Code Skills** — structured Markdown files that give AI agents deep, expert-level reasoning capabilities in specific scientific domains.

### 1.2 How it works

Each skill is written by a domain expert and encodes the knowledge, tools, reasoning protocols, and common pitfalls of their field. Point your AI agent at a skill, and it reasons like a domain expert.

### 1.3 What can you do

Contribute your expertise, or use this repo to supercharge your AI agent's scientific discovery.

### 1.4 Why should you contribute?

Turning your know-how into AI-reusable knowledge means:

- **Boost your own research efficiency** — your AI agent gains your expertise and works alongside you
- **Boost humanity's research efficiency** — every scientist benefits from the collective knowledge
- **Survive the Singularity** — when ASI takes over, your contribution to this repo might just save your life

---

<h2 align="center">2. Domains</h2>

Aligned with the [arXiv category taxonomy](https://arxiv.org/category_taxonomy). 8 domains, 155 subcategories.

| Domain | arXiv | Subcategories | Reviewer(s) |
|---|---|---|---|
| ⚛️ Physics | astro-ph, cond-mat, gr-qc, hep, nlin, physics, ... | 51 | *Seeking reviewer* |
| ➗ Mathematics | math | 32 | *Seeking reviewer* |
| 💻 Computer Science | cs | 40 | *Seeking reviewer* |
| 🧬 Quantitative Biology | q-bio | 10 | *Seeking reviewer* |
| 📊 Statistics | stat | 6 | *Seeking reviewer* |
| ⚡ Electrical Engineering & Systems Science | eess | 4 | *Seeking reviewer* |
| 📈 Economics | econ | 3 | *Seeking reviewer* |
| 💹 Quantitative Finance | q-fin | 9 | *Seeking reviewer* |

> [View all 155 subcategories in the interactive knowledge tree →](https://hhhhhejia.github.io/OpenScientist/)

---

<h2 align="center">3. How It Works</h2>

### 3.1 Install

Each skill is a single `.md` file. Install it once, invoke it any time in Claude Code:

```bash
# 1. Clone
git clone https://github.com/HHHHHejia/OpenScientist.git

# 2. Copy a skill (or symlink a whole domain)
cp OpenScientist/skills/physics/quantum-physics/quantum-entanglement.md ~/.claude/skills/
# or: ln -s $(pwd)/OpenScientist/skills/physics ~/.claude/skills/os-physics

# 3. Invoke in Claude Code
/quantum-entanglement  →  Claude reasons as a quantum physics expert
```

### 3.2 What's inside a skill file?

| Section                 | Purpose                                                 |
| ------------------------- | --------------------------------------------------------- |
| YAML frontmatter        | Machine-readable metadata: name, domain, author, status |
| `## Purpose`            | When to invoke this skill                               |
| `## Domain Knowledge`   | Core concepts, equations, established facts             |
| `## Reasoning Protocol` | Step-by-step guide for AI reasoning                     |
| `## Tools`              | Key software, libraries, databases used in this domain  |
| `## Common Pitfalls`    | Mistakes and edge cases to avoid                        |
| `## Examples`           | Worked examples                                         |
| `## References`         | Key papers and textbooks                                |

### 3.3 Quality tiers

| Status     | Meaning                                |
| ------------ | ---------------------------------------- |
| `draft`    | Authored, not yet peer-reviewed        |
| `reviewed` | Approved by a domain expert reviewer |
| `verified` | Tested in real AI-scientist workflows  |

Every pull request touching a skill file triggers CI (`utils/tools/validate.py`) that checks required fields and section structure. A PR cannot be merged if validation fails.

---

<h2 align="center">4. How to Contribute</h2>

We welcome contributions from domain experts. See [CONTRIBUTING.md](utils/CONTRIBUTING.md) for the full guide.

### 4.1 Contributor Requirements

> **Who can contribute?** We maintain a high bar for scientific accuracy.

- **Academic credential** — PhD degree or equivalent research position (postdoc, research scientist, professor, etc.) is **required**
- **Real-name identity** — Contributors must use their real name and institutional affiliation in the `author` field (e.g., `"Dr. Albert Einstein (ETH Zürich Physics)"`)
- **Domain expertise** — You may only contribute skills within your area of professional expertise

### 4.2 Five Steps

- **Fork** this repo
- **Copy the template** into the right domain folder:
  ```bash
  cp skills/_template.md skills/<domain>/<subdomain>/<your-skill-name>.md
  ```
- **Fill in every section** — Purpose, Domain Knowledge, Reasoning Protocol, Tools, Common Pitfalls
- **Validate locally** (optional but recommended):
  ```bash
  python utils/tools/validate.py skills/<domain>/<subdomain>/<your-skill-name>.md
  ```
- **Open a pull request** — title format: `[physics/quantum-physics] Add quantum-entanglement skill`

A domain reviewer listed in CODEOWNERS will be automatically assigned to review your PR for scientific accuracy.

### 4.3 Don't see your field?

- [**Propose a new area →**](https://github.com/HHHHHejia/OpenScientist/issues/new?template=propose-new-area.md)

### 4.4 Need a skill but can't write it yourself?

- [**Request a skill →**](https://github.com/HHHHHejia/OpenScientist/issues/new?template=skill-request.yml)

---

<h2 align="center">5. Reviewers</h2>

Reviewers are domain experts who ensure the scientific quality of skills in their subdomain.

### 5.1 Responsibilities

- Review skill PRs in your subdomain for scientific accuracy and completeness
- Provide constructive feedback to contributors
- Promote skill status from `draft` → `reviewed` after verification

### 5.2 Permissions

- Approve or request changes on PRs touching your subdomain
- Self-approve and merge your own PRs within your subdomain
- Auto-assigned as reviewer via CODEOWNERS when a PR touches your subdomain

### 5.3 Actions

- [**Apply to become a category reviewer →**](https://github.com/HHHHHejia/OpenScientist/issues/new?template=maintainer-application.yml)
- [**View all reviewers in the Knowledge Tree →**](https://hhhhhejia.github.io/OpenScientist/)
- [**View all reviewers list →**](https://hhhhhejia.github.io/OpenScientist/reviewers.html)

---

<h2 align="center">6. Repository Management</h2>

### 6.1 Domain ownership

Each `skills/<domain>/` folder is owned by a domain expert reviewer, defined in [CODEOWNERS](.github/CODEOWNERS). When a PR touches that folder, GitHub automatically requests their review.

### 6.2 Updating the skills index

```bash
python utils/tools/build_index.py   # writes utils/SKILLS_INDEX.md
```

### 6.3 Onboarding a new domain expert

Edit CODEOWNERS and replace the placeholder with their GitHub handle:

```
skills/physics/    @their-github-handle
```

### 6.4 Promoting a skill's status

- `draft` → `reviewed` (reviewer approves)
- `reviewed` → `verified` (tested in a real workflow)

---

## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — free to share and adapt, with attribution.

---

<details open>
<summary><h2 id="中文版本">中文版本</h2></summary>

**我们的使命：** 汇集全人类各领域顶尖专家的知识，加速 AI 驱动的科学进步。

**行动号召：** 共享你的研究知识，创造 AI 时代的爱因斯坦、达芬奇与康德。

---

<h2 align="center">1. 关于 OpenScientist</h2>

### 1.1 这是什么

OpenScientist 是一个精心策划的 **Claude Code Skills 库** —— 每个 Skill 是一个结构化的 Markdown 文件，赋予 AI 智能体特定科学领域的专家级推理能力。

### 1.2 如何运作

每个 Skill 由该领域的专家撰写，编码了领域知识、工具、推理协议和常见陷阱。让 AI 调用一个 Skill，就能像领域专家一样思考。

### 1.3 你能做什么

贡献你的专业知识，或使用本仓库加速你 AI agent 的科学发现。

### 1.4 为什么你应该贡献？

将你的 know-how 变成 AI 可复用的知识意味着：

- **提升你自己的科研效率** —— 你的 AI agent 获得你的专业知识，成为你的研究搭档
- **提升全人类的科研效率** —— 每位科学家都能从集体知识中受益
- **在奇点中存活** —— 当 ASI 统治人类以后，看到这个仓库里你的贡献，没准可以饶你一命

---

<h2 align="center">2. 领域列表</h2>

对齐 [arXiv 分类体系](https://arxiv.org/category_taxonomy)。8 个顶层领域，155 个子领域。

| 领域 | arXiv | 子领域数 | 审稿人 |
|---|---|---|---|
| ⚛️ Physics 物理 | astro-ph, cond-mat, gr-qc, hep, nlin, physics, ... | 51 | *招募中* |
| ➗ Mathematics 数学 | math | 32 | *招募中* |
| 💻 Computer Science 计算机科学 | cs | 40 | *招募中* |
| 🧬 Quantitative Biology 定量生物学 | q-bio | 10 | *招募中* |
| 📊 Statistics 统计学 | stat | 6 | *招募中* |
| ⚡ Electrical Engineering & Systems Science 电气工程与系统科学 | eess | 4 | *招募中* |
| 📈 Economics 经济学 | econ | 3 | *招募中* |
| 💹 Quantitative Finance 定量金融 | q-fin | 9 | *招募中* |

> [查看全部 155 个子领域（交互式知识树）→](https://hhhhhejia.github.io/OpenScientist/)

---

<h2 align="center">3. 如何使用</h2>

### 3.1 安装

每个 Skill 是一个 `.md` 文件，安装一次，在 Claude Code 中随时调用：

```bash
# 1. 克隆仓库
git clone https://github.com/HHHHHejia/OpenScientist.git

# 2. 复制 Skill（或符号链接整个领域）
cp OpenScientist/skills/physics/quantum-physics/quantum-entanglement.md ~/.claude/skills/
# 或：ln -s $(pwd)/OpenScientist/skills/physics ~/.claude/skills/os-physics

# 3. 在 Claude Code 中调用
/quantum-entanglement  →  Claude 以量子物理专家身份推理
```

### 3.2 Skill 文件的结构

| 部分                    | 作用                                           |
| ------------------------- | ------------------------------------------------ |
| YAML frontmatter        | 机器可读的元数据：name、domain、author、status |
| `## Purpose`            | 何时调用此 Skill                               |
| `## Domain Knowledge`   | 核心概念、公式、既定事实                       |
| `## Reasoning Protocol` | AI 推理的分步指南                              |
| `## Tools`              | 该领域常用的软件、库、数据库                   |
| `## Common Pitfalls`    | 常见错误和边界情况                             |
| `## Examples`           | 示范性例题                                     |
| `## References`         | 关键论文和教材                                 |

### 3.3 质量等级

| 状态       | 含义                           |
| ------------ | -------------------------------- |
| `draft`    | 已撰写，尚未同行评审           |
| `reviewed` | 已由领域专家审核通过           |
| `verified` | 已在真实 AI 科学家工作流中验证 |

每次 PR 修改 Skill 文件时，CI 会自动运行 `utils/tools/validate.py` 检查必填字段和章节结构。校验不通过则无法合并。

---

<h2 align="center">4. 如何贡献</h2>

我们欢迎各领域专家贡献知识。请参阅 [CONTRIBUTING.md](utils/CONTRIBUTING.md) 了解完整流程。

### 4.1 贡献者要求

> **谁可以贡献？** 我们对科学准确性有严格要求。

- **学术资质** — 必须持有博士学位或同等研究岗位（博士后、研究员、教授等）
- **实名认证** — 贡献者必须在 `author` 字段使用真实姓名和所属机构（如 `"Dr. Albert Einstein (ETH Zürich Physics)"`)
- **领域专长** — 只能在自己的专业领域内贡献 Skill

### 4.2 五个步骤

- **Fork** 本仓库
- **复制模板** 到对应领域文件夹：
  ```bash
  cp skills/_template.md skills/<领域>/<子领域>/<你的skill名称>.md
  ```
- **填写每个章节** —— Purpose、Domain Knowledge、Reasoning Protocol、Tools、Common Pitfalls
- **本地验证**（推荐）：
  ```bash
  python tools/validate.py skills/<领域>/<子领域>/<你的skill名称>.md
  ```
- **提交 Pull Request** —— 标题格式：`[physics/quantum-physics] Add quantum-entanglement skill`

CODEOWNERS 中的领域审稿人会自动收到 review 请求，负责审核科学内容的准确性。

### 4.3 没有你的研究方向？

- [**提议新领域 →**](https://github.com/HHHHHejia/OpenScientist/issues/new?template=propose-new-area.md)

### 4.4 需要某个 Skill 但自己写不了？

- [**请求 Skill →**](https://github.com/HHHHHejia/OpenScientist/issues/new?template=skill-request.yml)

---

<h2 align="center">5. 审稿人</h2>

审稿人是负责其子领域 Skill 科学质量的领域专家。

### 5.1 职责

- 审核所属子领域的 Skill PR，确保科学准确性和完整性
- 为贡献者提供建设性反馈
- 验证后将 Skill 状态从 `draft` 提升为 `reviewed`

### 5.2 权限

- 对所属子领域的 PR 进行审批或提出修改意见
- 在自己的子领域内可以自审自批、合并自己的 PR
- 通过 CODEOWNERS 自动分配为审稿人

### 5.3 行动

- [**申请成为类别审稿人 →**](https://github.com/HHHHHejia/OpenScientist/issues/new?template=maintainer-application.yml)
- [**查看全部审稿人（知识树）→**](https://hhhhhejia.github.io/OpenScientist/)
- [**查看全部审稿人列表 →**](https://hhhhhejia.github.io/OpenScientist/reviewers.html)

---

<h2 align="center">6. 仓库管理</h2>

### 6.1 领域归属

每个 `skills/<domain>/` 文件夹由一位领域审稿人负责，定义在 [CODEOWNERS](.github/CODEOWNERS) 中。当 PR 涉及该文件夹时，GitHub 会自动请求其 review。

### 6.2 更新 Skills 索引

```bash
python utils/tools/build_index.py   # 生成 utils/SKILLS_INDEX.md
```

### 6.3 添加新的领域专家

编辑 CODEOWNERS，将占位符替换为其 GitHub 用户名：

```
skills/physics/    @their-github-handle
```

### 6.4 提升 Skill 状态

- `draft` → `reviewed`（审稿人审核通过）
- `reviewed` → `verified`（在真实工作流中验证）

</details>

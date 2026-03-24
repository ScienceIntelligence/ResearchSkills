# 🌍 OpenScientist

> A collaborative repository of Claude Code Skills encoding frontier scientific knowledge across disciplines — contributed by domain experts worldwide.

```mermaid
mindmap
  root((🌍 OpenScientist))
    🔬 Natural Sciences
      ⚛️ Physics
        Quantum Mechanics
        Thermodynamics
        Condensed Matter
        Astrophysics
      🧬 Biology
        Molecular Biology
        Genetics
        Ecology
        Evolutionary Biology
      ⚗️ Chemistry
        Organic Chemistry
        Physical Chemistry
        Materials Science
      🧠 Neuroscience
        Computational Neuroscience
        Cognitive Science
    📐 Formal Sciences
      ➗ Mathematics
        Analysis
        Algebra
        Statistics & Probability
        Topology
      💻 Computer Science
        Machine Learning
        Algorithms
        Systems
    🔀 Cross-Domain
      AI × Biology
      AI × Physics
      AI × Chemistry
```

## What is OpenScientist?

OpenScientist is a curated library of **Claude Code Skills** — structured Markdown files that give AI agents deep, expert-level reasoning capabilities in specific scientific domains. Each skill is written by a domain expert and encodes the knowledge, tools, reasoning protocols, and common pitfalls of their field.

**The goal:** Point your AI agent at a skill, and it reasons like a domain expert.

---

## How It Works

Each skill is a single `.md` file. Install it once, invoke it any time in Claude Code:

```bash
# 1. Clone
git clone https://github.com/HHHHHejia/OpenScientist.git

# 2. Copy a skill (or symlink a whole domain)
cp OpenScientist/skills/physics/quantum-mechanics.md ~/.claude/skills/
# or: ln -s $(pwd)/OpenScientist/skills/physics ~/.claude/skills/os-physics

# 3. Invoke in Claude Code
/quantum-mechanics  →  Claude reasons as a quantum physics expert
```

### What's inside a skill file?

Every skill has the same structure:

| Section | Purpose |
|---|---|
| YAML frontmatter | Machine-readable metadata: name, domain, author, status |
| `## Purpose` | When to invoke this skill |
| `## Tools` | Key software, libraries, databases used in this domain |
| `## Domain Knowledge` | Core concepts, equations, established facts |
| `## Reasoning Protocol` | Step-by-step guide for AI reasoning |
| `## Common Pitfalls` | Mistakes and edge cases to avoid |
| `## Examples` | Worked examples |
| `## References` | Key papers and textbooks |

### Quality tiers

Every skill carries a `status` field that tracks review progress:

| Status | Meaning |
|---|---|
| `draft` | Authored, not yet peer-reviewed |
| `reviewed` | Approved by a domain expert maintainer |
| `verified` | Tested in real AI-scientist workflows |

### Automated validation

Every pull request touching a skill file triggers CI (`tools/validate.py`) that checks required fields and section structure. A PR cannot be merged if validation fails.

---

## How to Contribute

We welcome contributions from domain experts. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

**5 steps:**

1. **Fork** this repo
2. **Copy the template** into the right domain folder:
   ```bash
   cp skills/_template.md skills/<domain>/<your-skill-name>.md
   ```
3. **Fill in every section** — Purpose, Tools, Domain Knowledge, Reasoning Protocol, Common Pitfalls
4. **Validate locally** (optional but recommended):
   ```bash
   python tools/validate.py skills/<domain>/<your-skill-name>.md
   ```
5. **Open a pull request** — title format: `[physics] Add quantum-entanglement skill`

A domain maintainer listed in [CODEOWNERS](CODEOWNERS) will be automatically assigned to review your PR for scientific accuracy.

---

## How the Repository is Managed

### Domain ownership

Each `skills/<domain>/` folder is owned by a domain expert maintainer, defined in [CODEOWNERS](CODEOWNERS). When a PR touches that folder, GitHub automatically requests their review. The maintainer approves or requests changes — repository owner (@HHHHHejia) only needs to intervene at the root level.

### Updating the skills index

After any skill is merged, regenerate the browsable index:

```bash
python tools/build_index.py   # writes SKILLS_INDEX.md
git add SKILLS_INDEX.md && git commit -m "chore: update skills index"
```

### Onboarding a new domain expert

Edit [CODEOWNERS](CODEOWNERS) and replace the placeholder with their GitHub handle:

```
skills/physics/    @their-github-handle
```

They will now automatically receive review requests for all physics PRs.

### Promoting a skill's status

After a maintainer reviews a skill, manually update the `status` field in that file:
- `draft` → `reviewed` (maintainer approves)
- `reviewed` → `verified` (tested in a real workflow)

---

## Domains

| Domain | Skills | Maintainer(s) |
|---|---|---|
| ⚛️ Physics | — | *Seeking maintainer* |
| 🧬 Biology | — | *Seeking maintainer* |
| ⚗️ Chemistry | — | *Seeking maintainer* |
| ➗ Mathematics | — | *Seeking maintainer* |
| 🧠 Neuroscience | — | *Seeking maintainer* |
| 💻 Computer Science | — | *Seeking maintainer* |
| 🔀 Cross-Domain | — | Core team |

---

## License

MIT

---

---

# 🌍 OpenScientist（中文）

> 一个由各领域前沿科学家共同贡献的 Claude Code Skills 开源仓库 —— 将人类科学知识编码为 AI 可直接调用的能力。

## 这是什么？

OpenScientist 是一个精心策划的 **Claude Code Skills 库** —— 每个 Skill 是一个结构化的 Markdown 文件，赋予 AI 智能体特定科学领域的专家级推理能力。每个 Skill 由该领域的专家撰写，编码了领域知识、工具、推理协议和常见陷阱。

**目标：** 让 AI 调用一个 Skill，就能像领域专家一样思考。

---

## 如何运作

每个 Skill 是一个 `.md` 文件，安装一次，在 Claude Code 中随时调用：

```bash
# 1. 克隆仓库
git clone https://github.com/HHHHHejia/OpenScientist.git

# 2. 复制 Skill（或符号链接整个领域）
cp OpenScientist/skills/physics/quantum-mechanics.md ~/.claude/skills/
# 或：ln -s $(pwd)/OpenScientist/skills/physics ~/.claude/skills/os-physics

# 3. 在 Claude Code 中调用
/quantum-mechanics  →  Claude 以量子物理专家身份推理
```

### Skill 文件的结构

| 部分 | 作用 |
|---|---|
| YAML frontmatter | 机器可读的元数据：name、domain、author、status |
| `## Purpose` | 何时调用此 Skill |
| `## Tools` | 该领域常用的软件、库、数据库 |
| `## Domain Knowledge` | 核心概念、公式、既定事实 |
| `## Reasoning Protocol` | AI 推理的分步指南 |
| `## Common Pitfalls` | 常见错误和边界情况 |
| `## Examples` | 示范性例题 |
| `## References` | 关键论文和教材 |

### 质量等级

| 状态 | 含义 |
|---|---|
| `draft` | 已撰写，尚未同行评审 |
| `reviewed` | 已由领域专家审核通过 |
| `verified` | 已在真实 AI 科学家工作流中验证 |

### 自动化校验

每次 PR 修改 Skill 文件时，CI 会自动运行 `tools/validate.py` 检查必填字段和章节结构。校验不通过则无法合并。

---

## 如何贡献

我们欢迎各领域专家贡献知识。请参阅 [CONTRIBUTING.md](CONTRIBUTING.md) 了解完整流程。

**5 个步骤：**

1. **Fork** 本仓库
2. **复制模板** 到对应领域文件夹：
   ```bash
   cp skills/_template.md skills/<领域>/<你的skill名称>.md
   ```
3. **填写每个章节** —— Purpose、Tools、Domain Knowledge、Reasoning Protocol、Common Pitfalls
4. **本地验证**（推荐）：
   ```bash
   python tools/validate.py skills/<领域>/<你的skill名称>.md
   ```
5. **提交 Pull Request** —— 标题格式：`[physics] Add quantum-entanglement skill`

[CODEOWNERS](CODEOWNERS) 中的领域维护者会自动收到 review 请求，负责审核科学内容的准确性。

---

## 如何管理这个仓库

### 领域所有权

每个 `skills/<domain>/` 文件夹由对应的领域专家维护，定义在 [CODEOWNERS](CODEOWNERS)。PR 触碰该文件夹时，GitHub 自动指派他们 review。仓库管理员（@HHHHHejia）只需处理根目录级别的事务。

### 更新 Skills 索引

每次有新 Skill 合并后，重新生成索引：

```bash
python tools/build_index.py   # 生成 SKILLS_INDEX.md
git add SKILLS_INDEX.md && git commit -m "chore: update skills index"
```

### 招募新的领域专家

编辑 [CODEOWNERS](CODEOWNERS)，替换对应行的占位符：

```
skills/physics/    @专家的GitHub用户名
```

之后该领域的所有 PR 都会自动指派给他们 review。

### 提升 Skill 的状态

维护者审核通过后，手动修改文件中的 `status` 字段：
- `draft` → `reviewed`（维护者批准后）
- `reviewed` → `verified`（在真实工作流中验证后）

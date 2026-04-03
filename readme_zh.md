<div align="right">

[English](readme.md) · [中文](#-openscientist)

</div>

<div align="center">

# 🌍 OpenScientist

[![GitHub stars](https://img.shields.io/github/stars/OpenScientists/OpenScientist?style=social)](https://github.com/OpenScientists/OpenScientist/stargazers) [![GitHub forks](https://img.shields.io/github/forks/OpenScientists/OpenScientist?style=social)](https://github.com/OpenScientists/OpenScientist/fork) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

> *2015 年：5,154 位科学家联名发表了一篇希格斯玻色子论文。*
>
> *今天：我们正在开启人类有史以来最大规模的学术合作 —*
> 🏛️ **为 AGI 建一座亚历山大图书馆，加速自动化科学发现。**

<p align="center">
  <a href="https://openscientists.github.io/OpenScientist/">
    <img src="https://raw.githubusercontent.com/OpenScientists/OpenScientist/main/utils/assets/knowledge-tree-v2.png" alt="Knowledge Tree" width="100%">
  </a>
</p>

<p align="center">
  <a href="https://openscientists.github.io/OpenScientist/">查看交互式知识树 →</a>
</p>

---

<h2 align="center">1. 关于 OpenScientist</h2>

</div>

### 1.1 这是什么

OpenScientist 是一个精心策划的 **AI agent 技能库**（兼容 **Claude Code** 和 **Codex CLI**）—— 每个 Skill 是一个结构化的 Markdown 文件，赋予 AI 智能体特定科学领域的专家级推理能力。

我们的使命是汇集全人类各领域顶尖专家的知识，将其转化为 AI 可复用的技能，加速科学发现。共享你的研究知识 —— 让我们一起创造 AI 时代的爱因斯坦、达芬奇与康德。

### 1.2 如何运作

每个 Skill 编码了领域知识、工具、推理协议和常见陷阱。Skill 可以由领域专家手动撰写，也可以通过 `/extract-knowhow` **从你的科研对话中自动提取**。让 AI 调用一个 Skill，就能像领域专家一样思考。

### 1.3 你能做什么

贡献你的专业知识，或使用本仓库加速你 AI agent 的科学发现。

### 1.4 开源与非盈利

OpenScientist 是一个完全开源、非盈利的项目。随着项目的发展，我们计划成立一个非盈利组织（NGO），以确保所有贡献知识的长期治理、透明性和可持续管理。

### 1.5 为什么你应该贡献？

将你的 know-how 变成 AI 可复用的知识意味着：

- **提升你自己的科研效率** —— 你的 AI agent 获得你的专业知识，成为你的研究搭档
- **提升全人类的科研效率** —— 每位科学家都能从集体知识中受益
- **在奇点中存活** —— 当 ASI 统治人类以后，看到这个仓库里你的贡献，没准可以饶你一命

---

<h2 align="center">2. 领域列表</h2>

对齐 [arXiv 分类体系](https://arxiv.org/category_taxonomy)。8 个顶层领域，155 个子领域。


| 领域                                                           | arXiv                                              | 子领域数 | 审稿人   |
| ---------------------------------------------------------------- | ---------------------------------------------------- | ---------- | ---------- |
| ⚛️ Physics 物理                                              | astro-ph, cond-mat, gr-qc, hep, nlin, physics, ... | 51       | *招募中* |
| ➗ Mathematics 数学                                            | math                                               | 32       | *招募中* |
| 💻 Computer Science 计算机科学                                 | cs                                                 | 40       | *招募中* |
| 🧬 Quantitative Biology 定量生物学                             | q-bio                                              | 10       | *招募中* |
| 📊 Statistics 统计学                                           | stat                                               | 6        | *招募中* |
| ⚡ Electrical Engineering & Systems Science 电气工程与系统科学 | eess                                               | 4        | *招募中* |
| 📈 Economics 经济学                                            | econ                                               | 3        | *招募中* |
| 💹 Quantitative Finance 定量金融                               | q-fin                                              | 9        | *招募中* |

> [查看全部 155 个子领域（交互式知识树）→](https://openscientists.github.io/OpenScientist/)

Skill 还按**科研活动类型**分类 —— 10 个跨领域的类别：

| # | 类别 | 涵盖内容 |
|---|------|---------|
| 1 | `01-literature-search` | 搜索策略、论文筛选、引用分析 |
| 2 | `02-hypothesis-and-ideation` | 假设构建、研究问题提炼 |
| 3 | `03-math-and-modeling` | 证明策略、建模、数学表述 |
| 4 | `04-experiment-planning` | 实验方案、控制策略、变量选择 |
| 5 | `05-data-acquisition` | 数据来源、清洗流程、标注 |
| 6 | `06-coding-and-execution` | 编码模式、库选择、调试 |
| 7 | `07-result-analysis` | 统计方法、可视化、结果解读 |
| 8 | `08-reusable-tooling` | 可复用工具、方法创新、工作流 |
| 9 | `09-paper-writing` | 论文结构、图表、论点构建 |
| 10 | `10-review-and-rebuttal` | 自我批判、回复审稿人、修改 |

---

<h2 align="center">3. 如何贡献</h2>

我们欢迎各领域专家贡献知识。请参阅 [CONTRIBUTING.md](utils/CONTRIBUTING.md) 了解完整流程。

### 3.1 贡献者要求

> **谁可以贡献？** 我们对科学准确性有严格要求。

- **学术资质** — 必须持有博士学位或同等研究岗位（博士后、研究员、教授等）
- **实名认证** — 贡献者必须在 `author` 字段使用真实姓名和所属机构（如 `"Dr. Albert Einstein (ETH Zürich Physics)"`)
- **领域专长** — 只能在自己的专业领域内贡献 Skill

### 3.2 方式 A：用 `/extract-knowhow` 自动提取（推荐）

让 AI 分析你的对话历史，自动从中提取科研 know-how 并生成 Skill 文件：

```bash
npm install -g @openscientist/extract-knowhow
```

然后运行提取：

**Claude Code:**
```
/model opus[1m]
/effort max
/extract-knowhow
```

**Codex CLI:**
```
/model gpt-5.4
/reasoning high
$extract-knowhow
```

> **提示：** 使用最强模型 + 最大推理深度，可获得最佳提取效果。

该命令会：
1. 扫描你的对话历史
2. 过滤出与科研相关的会话
3. 按项目聚类并映射到科学领域
4. 从 10 个类别中提取可复用的 know-how（文献调研、提出想法、形式化、实验设计、数据采集、代码实现、结果分析、工具开发、论文写作、同行评审）
5. 展示报告供你确认
6. 生成 Skill 文件供你审核

命令运行完成后，检查生成文件的科学准确性，然后提交：

- [**通过 GitHub Issue 提交你的 Skill →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=submit-skill.yml)（直接粘贴文件内容，无需 git！）
- 或者，如果你熟悉 git：fork 仓库，将文件复制到 `skills/<领域>/<子领域>/`，提交 PR

### 3.3 方式 B：网页版用户一键提取（ChatGPT / Claude / Gemini）

适用于任何能引用历史对话的 AI 聊天工具。首先开启记忆功能，让 AI 能访问你的历史：

| 平台 | 如何开启 | 设置链接 |
|------|---------|---------|
| **ChatGPT** | Settings > Personalization > 开启 **Memory** 和 **Reference chat history** | [Settings](https://chatgpt.com/settings) |
| **Claude** | Settings > Capabilities > 开启 **Memory** | [Settings](https://claude.ai/settings/capabilities) |
| **Gemini** | Settings > Personal context > 开启 **Your past chats with Gemini** | [Settings](https://gemini.google.com/settings) |

然后在一个**新对话**中粘贴以下 prompt：

<details>
<summary><b>点击展开完整 prompt</b></summary>

```
回顾我们所有的历史对话，提取每一条可复用的科研 know-how。只关注科研活动，忽略通用编程、环境配置或闲聊内容。

将每条 know-how 归入以下 10 个类别之一：
1. 文献搜索 — 搜索策略、论文筛选、引用分析
2. 假设与构思 — 假设构建、研究问题提炼
3. 数学与建模 — 证明策略、推导、数学表述
4. 实验规划 — 实验方案、控制策略、变量选择
5. 数据采集 — 数据来源、清洗流程、标注策略
6. 编码与执行 — 科研编码模式、库选择、调试
7. 结果分析 — 统计方法、可视化、结果解读
8. 可复用工具 — 你让我帮你构建的工具、方法或工作流
9. 论文写作 — 写作结构、图表规范、论点构建
10. 评审与修改 — 自我批判、回复审稿人、修改策略

将每个条目输出在一个代码块中，使用以下格式，方便我直接复制粘贴：

---
name: 简短描述性标题
description: >
  2-3 句话解释这条 know-how 是什么以及何时使用。
domain: [physics|mathematics|computer-science|quantitative-biology|statistics|eess|economics|quantitative-finance]
subdomain: 具体子领域
category: [01-literature-search|02-hypothesis-and-ideation|03-math-and-modeling|04-experiment-planning|05-data-acquisition|06-coding-and-execution|07-result-analysis|08-reusable-tooling|09-paper-writing|10-review-and-rebuttal]
author: "我的姓名 (我的机构)"
expertise_level: intermediate
tags: [关键词1, 关键词2]
dependencies: []
version: 1.0.0
status: draft
reviewed_by: []
---

## Purpose

[将描述扩展为完整段落]

## Tools

- **[工具名]**: 用途和使用时机

## Domain Knowledge

### Key Concepts

[与此 know-how 相关的核心概念]

### Fundamental Principles

[底层科学原理]

## Reasoning Protocol

Step 1: [具体步骤]
Step 2: [具体步骤]
Step 3: [具体步骤]

## Common Pitfalls

- [陷阱 1: 哪里会出错以及如何避免]
- [陷阱 2: 哪里会出错以及如何避免]

## References

- 从对话历史中提取
- 提取日期: [今天日期]

---

规则：
- 提取每一条科研 know-how，无论多小
- 尽量保留我的原话和具体参数值
- 不要提取通用编程知识或教科书基础内容
- 不要合并或归纳多个条目 — 每条 know-how 单独一个 skill 文件
- 代码块之后，确认是否已经提取完整，是否还有遗漏
```

</details>

运行后检查输出的准确性，然后提交：

- [**通过 GitHub Issue 提交你的 Skill →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=submit-skill.yml)（直接粘贴，无需 git！）

### 3.4 方式 C：手动撰写

参照[模板](skills/_template.md)撰写你的 Skill，然后提交：

- [**通过 GitHub Issue 提交你的 Skill →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=submit-skill.yml)

### 3.5 没有你的研究方向？

- [**提议新领域 →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=propose-new-area.md)

### 3.6 需要某个 Skill 但自己写不了？

- [**请求 Skill →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=skill-request.yml)

---

<h2 align="center">4. Skill 格式</h2>

### 4.1 Skill 文件的结构


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

### 4.2 质量等级


| 状态       | 含义                           |
| ------------ | -------------------------------- |
| `draft`    | 已撰写，尚未同行评审           |
| `reviewed` | 已由领域专家审核通过           |
| `verified` | 已在真实 AI 科学家工作流中验证 |

---

<h2 align="center">5. 如何成为审稿人</h2>

审稿人是负责其子领域 Skill 科学质量的领域专家。

### 5.1 要求

- 满足[贡献者](#3-如何贡献)的所有要求（即首先是合格的贡献者）
- 在相关子领域有充分的同行评审经验

### 5.2 职责

- 审核所属子领域的 Skill PR，确保科学准确性和完整性
- 为贡献者提供建设性反馈
- 验证后将 Skill 状态从 `draft` 提升为 `reviewed`

### 5.3 权限

- 对所属子领域的 PR 进行审批或提出修改意见
- 在自己的子领域内可以自审自批、合并自己的 PR
- 通过 CODEOWNERS 自动分配为审稿人

### 5.4 行动

- [**申请成为类别审稿人 →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=maintainer-application.yml)
- [**查看全部审稿人（知识树）→**](https://openscientists.github.io/OpenScientist/)
- [**查看全部审稿人列表 →**](https://openscientists.github.io/OpenScientist/reviewers.html)

---

<h2 align="center">6. 运作机制</h2>

### 6.1 Issue 模板


| 模板                                                                                                                   | 使用场景                    |
| ------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| [Submit a Skill](https://github.com/OpenScientists/OpenScientist/issues/new?template=submit-skill.yml)                 | 提交 Skill（自动提取或手动撰写） |
| [Skill Request](https://github.com/OpenScientists/OpenScientist/issues/new?template=skill-request.yml)                 | 需要某个 Skill 但自己写不了 |
| [Reviewer Application](https://github.com/OpenScientists/OpenScientist/issues/new?template=maintainer-application.yml) | 申请成为子领域审稿人        |
| [Propose New Area](https://github.com/OpenScientists/OpenScientist/issues/new?template=propose-new-area.md)            | 提议新的顶层领域            |

### 6.2 Skill 提交工作流

1. 贡献者通过 [GitHub Issue](https://github.com/OpenScientists/OpenScientist/issues/new?template=submit-skill.yml) 提交 Skill（或提交 PR）
2. 子领域审稿人审核科学准确性
3. 维护者将 Skill 文件添加到仓库
4. Skill 状态初始为 `draft`

**状态生命周期：** `draft` → `reviewed`（审稿人审核通过）→ `verified`（在真实 AI 工作流中验证）

### 6.3 审稿人自动化入职

当 Reviewer Application issue 被打上 `approved` 标签后，[onboard-maintainer](/.github/workflows/onboard-maintainer.yml) 工作流自动：

- 将审稿人添加到 `.github/CODEOWNERS`
- 将其姓名添加到[知识树](https://openscientists.github.io/OpenScientist/)和[审稿人页面](https://openscientists.github.io/OpenScientist/reviewers.html)
- 关闭 issue 并发送欢迎评论

### 6.4 CODEOWNERS 与审核分配

每个 `skills/<domain>/<subdomain>/` 路径在 [`.github/CODEOWNERS`](.github/CODEOWNERS) 中映射到对应审稿人。涉及该路径的 PR 会自动请求对应审稿人 review。尚未认领的子领域由 `@HHHHHejia` 负责。

### 6.5 加入核心团队

想参与 CI 维护、文档完善、社区管理或项目运营？联系我们：**hejia@tapntell.ai**

---

## 许可证

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — 自由分享与改编，需注明出处。

---

<div align="center">

## 组织者与赞助商

[**查看全部组织者与赞助商 →**](https://openscientists.github.io/OpenScientist/organizers.html)

---

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=OpenScientists/OpenScientist&type=Date)](https://star-history.com/#OpenScientists/OpenScientist&Date)

</div>

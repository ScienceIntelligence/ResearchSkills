<div align="right">

[English](readme.md) · [中文](#-openscientist)

</div>

<div align="center">

# 🌍 OpenScientist

[![GitHub stars](https://img.shields.io/github/stars/OpenScientists/OpenScientist?style=social)](https://github.com/OpenScientists/OpenScientist/stargazers) [![GitHub forks](https://img.shields.io/github/forks/OpenScientists/OpenScientist?style=social)](https://github.com/OpenScientists/OpenScientist/fork) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

2015 年：5,154 位科学家联名发表了一篇希格斯玻色子论文。

今天：我们正在开启人类有史以来最大规模的学术合作

**— 🏛️ 为 AGI 建一座亚历山大图书馆，加速自动化科学发现。**

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

**科学，是 AI 剩下的最后一个真正重要的问题。** 写代码、做法律、搞设计 — AI 已经能做了。但真正的科学突破需要一种模型不具备的东西：在前沿领域摸爬滚打多年的研究者直觉。

这种直觉活在你的脑子里 — know-how、启发式方法、推理模式、"我就是知道这行不通"的第六感。它从不被写进论文。它会随着你的退休而消亡。

**OpenScientist 在它消失之前把它留住。** 我们把全世界顶尖研究者的隐性知识 — 他们的技能、思维框架和原则 — 变成可复用的 AI agent 技能（兼容 **Claude Code** 和 **Codex CLI**）。每一份贡献，都让现在和未来的每一个 AI 科学家变得更聪明，永久地。

每个 Skill 编码了领域知识、工具、推理协议和常见陷阱。Skill 可以由领域专家手动撰写，也可以通过 `/extract-knowhow` **从你的科研对话中自动提取**。让 AI 调用一个 Skill，就能像领域专家一样思考。

---

<h2 align="center">2. 领域列表</h2>

<div align="center">

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

[查看全部 155 个子领域（交互式知识树）→](https://openscientists.github.io/OpenScientist/)

</div>

---

<h2 align="center">3. 如何贡献</h2>

### 方式 A：用 `/extract-knowhow` 自动提取（推荐）

```bash
npm install -g @openscientist/extract-knowhow
```

**Claude Code:**
```
/extract-knowhow
```

**Codex CLI:**
```
$extract-knowhow
```

该命令会自动扫描你的对话历史，提取科研 know-how，并在浏览器中打开交互式报告 — 你可以在其中审核、编辑，并直接通过 GitHub 提交到 OpenScientist。

### 方式 B：网页版用户一键提取（ChatGPT / Claude / Gemini）

开启记忆功能，让 AI 能访问你的历史：

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
- 从项目细节中提炼通用原则：问自己"这对该领域的任何研究者都有用吗？"。例如："我们的 LiFePO4 模拟中 AMIX=0.05 有效" → "对于含 d 电子的过渡金属氧化物 GGA+U 计算，将 AMIX 降至 0.05"
- 脱敏处理：去除所有文件路径、用户名、项目名、私有 URL、合作者姓名，用通用描述替代。唯一允许使用真名的是 author 字段
- 聚焦于隐性知识：思维框架、决策原则、诊断推理、启发式方法 — 那些永远不会写进论文的直觉
- 不要提取通用编程知识、AI 工具使用技巧或教科书基础内容
- 不要合并或归纳多个条目 — 每条 know-how 单独一个 skill 文件
- 代码块之后，确认是否已经提取完整，是否还有遗漏
```

</details>

运行后提交：[**提交你的 Skill →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=01-submit-skill.yml)

### 方式 C：手动撰写

参照[模板](skills/_template.md)撰写，然后 [**通过 GitHub Issue 提交 →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=01-submit-skill.yml)

> 没有你的研究方向？[提议新领域 →](https://github.com/OpenScientists/OpenScientist/issues/new?template=04-propose-new-area.md) · 需要某个 Skill？[请求 Skill →](https://github.com/OpenScientists/OpenScientist/issues/new?template=02-skill-request.yml)

---

<h2 align="center">4. 成为审稿人</h2>

审稿人是守护其子领域 Skill 科学质量的领域专家。需要在相关领域有充分的同行评审经验。

**你的职责：** 审核提交的 Skill 的科学准确性和完整性。为贡献者提供建设性反馈。验证通过后将 Skill 状态从 `draft` 提升为 `reviewed`。

**你的权限：** 对所属子领域的提交进行审批或提出修改意见。

[**申请成为审稿人 →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=03-maintainer-application.yml)

---

## 许可证

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — 自由分享与改编，需注明出处。

---

<div align="center">

## 衷心感谢

感谢所有让这一切成为可能的人：

[**贡献者 →**](https://github.com/OpenScientists/OpenScientist/graphs/contributors) · [**审稿人 →**](https://openscientists.github.io/OpenScientist/reviewers.html) · [**赞助商 →**](https://openscientists.github.io/OpenScientist/organizers.html) · [**组织者 →**](https://openscientists.github.io/OpenScientist/organizers.html)

---

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=OpenScientists/OpenScientist&type=Date)](https://star-history.com/#OpenScientists/OpenScientist&Date)

</div>

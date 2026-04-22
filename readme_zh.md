<div align="right">

[English](readme.md) · [中文](#-researchskills)

</div>

<div align="center">

# 🌍 ResearchSkills

[![GitHub stars](https://img.shields.io/github/stars/ScienceIntelligence/ResearchSkills?style=social)](https://github.com/ScienceIntelligence/ResearchSkills/stargazers) [![GitHub forks](https://img.shields.io/github/forks/ScienceIntelligence/ResearchSkills?style=social)](https://github.com/ScienceIntelligence/ResearchSkills/fork) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

2015 年：5,154 位科学家联名发表了一篇希格斯玻色子论文。

今天：我们正在开启人类有史以来最大规模的学术合作

**— 🏛️ 为 AGI 建一座亚历山大图书馆，加速自动化科学发现。**

<p align="center">
  <a href="https://researchskills.ai/">https://researchskills.ai/</a>
</p>

---

<h2 align="center">1. 关于 ResearchSkills</h2>

</div>

**科学，是 AI 剩下的最后一个真正重要的问题。** 真正的科学突破需要一种模型不具备的东西：在前沿领域摸爬滚打多年的研究者直觉。

这种直觉活在你的脑子里 — know-how、启发式方法、推理模式、"我就是知道这行不通"的第六感。它从不被写进论文。它会随着你的退休而消亡。

**ResearchSkills 在它消失之前把它留住。** 我们把全世界顶尖研究者的隐性知识 — 他们的技能、思维框架和原则 — 变成可复用的 AI agent 技能（兼容 **Claude Code** 和 **Codex**）。每一份贡献，都让现在和未来的每一个 AI 科学家变得更聪明，永久地。

每个 Skill 编码了领域知识、工具、推理协议和常见陷阱。Skill 可以由领域专家手动撰写，也可以通过 `/extract-knowhow` **从你的科研对话中自动提取**。该命令从你的科研会话中提取三种认知记忆 — **程序性记忆**（应对科研困境的 IF-THEN 规则）、**语义记忆**（LLM 不知道的领域事实）和**情景记忆**（具体的科研经历）— 并将它们打包为可复用的 Skill。让 AI 调用一个 Skill，就能像领域专家一样思考。

---

<h2 align="center">为什么要贡献？</h2>

- **你的 Skill 首先让你自己的 AI 更聪明。** 提取的 Skill 会缓存在本地。你的 Claude Code / Codex / Cursor 立刻就能在你的领域中更好地推理 — 甚至不需要提交任何东西。

- **隐私优先。** 未经你的明确同意，不会扫描或上传任何内容。每次操作前都会弹出阻塞式授权确认。提交前你可以审核一切。

- **低成本，智能缓存。** 对话在分析前会被压缩。已处理的会话会被缓存并在重新运行时自动跳过。繁重的提取工作交给更轻量的模型处理。

- **到处都能用。** Claude Code、Codex、Cursor、Windsurf、VS Code、JetBrains — 任何支持 markdown 指令的工具都行。Skill 就是普通的 `.md` 文件，不绑定任何平台。

- **远程服务器也能用。** SSH 和无头环境会被自动检测。不需要浏览器 — 提交链接会直接打印到终端。

- **让你的专业知识永存。** 你数十年的 know-how 将成为科学的永久性、可引用贡献。你贡献的每一条 Skill，都在训练未来的每一个 AI 科学家。

---

<h2 align="center">2. 如何贡献</h2>

### 方式 A：用 `/extract-knowhow` 自动提取（推荐）

```bash
npm install -g @researchskills/extract-knowhow
```

**Claude Code:**
```
/extract-knowhow
```

**Codex:**
```
$extract-knowhow
```

> 💡 **为了最佳效果：** 使用最强模型 + 最高推理强度 — **Claude Code：** Opus 4.6 + max effort。**Codex：** GPT-5.4 + x-high。不必担心 token 消耗 — 对话会被充分压缩后再分析，每个会话的提取会交给较小的模型处理。你选的模型主要负责编排流水线。

该命令会扫描你的对话历史，提取按认知记忆类型组织的**科研技能**：

- **程序性记忆：** 应对科研困境的 IF-THEN 规则（如"IF 梯度爆炸 THEN 先检查学习率再改架构"）
- **语义记忆：** LLM 不可靠掌握的领域事实（如校准常数、未记录的工具行为、方法局限性）
- **情景记忆：** 具体的科研经历，记录尝试了什么、失败了什么、学到了什么

浏览器交互页面让你审核提取的技能、检查脱敏处理、绑定论文（arXiv/DOI）或项目。提交你的技能到 ResearchSkills，它将成为构建更强 AI 科学家的知识库的一部分。

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

````
你可以访问我所有的历史对话。请完整回顾它们，提取**科研技能** — 我科研工作中的隐性 know-how，那些前沿 LLM 本身不具备的知识。要求覆盖全面，不要保守：一个典型研究者一年的对话中会累积几十条值得提取的技能。

## 三种记忆类型（每种必须指定子类型）

每条技能只能归入一个子类型。如果都不匹配，就跳过该条目 — 不要勉强套。

### 1. 程序性（Procedural） — 应对科研困境的 IF-THEN 规则
- `tie` — 多条可行路径，不确定先走哪一条（如"消融实验还是完整重训？"）
- `no-change` — 完全卡住，没有可尝试的假设（如"结果很诡异，完全讲不通"）
- `constraint-failure` — 某个方法学前提不成立（如"数据违反 i.i.d. 假设"）
- `operator-fail` — 方法选对了，执行失败（如"大 batch size 下 CUDA OOM"）

### 2. 语义（Semantic） — 前沿 LLM 不可靠掌握的事实
- `frontier` — 训练截止日期之后的知识（如"Flash Attention 3 把 `causal` 参数改名了"）
- `non-public` — 实验室内部或未发表的发现（如"这批 H100 有 NCCL 拓扑问题"）
- `correction` — 纠正 LLM 默认的错误信念（如"fp16 下 Adam 的 eps=1e-8 不稳定，应该用 1e-5"）

### 3. 情景（Episodic） — 具有可迁移教训的具体经历
- `failure` — "做了 X，因为隐藏原因 Y 失败了"
- `adaptation` — "标准方法失败；权宜方案 Z 成功了"
- `anomalous` — "预期 A，观察到 B — 最后发现这很重要"

## 硬过滤（绝对不要提取）

- 工程 / DevOps / 部署 / CI / UI / 数据库 / Docker
- 通用编程：git、npm、React、构建错误调试
- 任何 LLM 都已熟知的教科书知识
- 闲聊、环境配置、文件组织、项目命名

LLM 自己就能生成的技能，价值为零。只提取那些**纠正或扩展**前沿模型已有认知的内容。

## 输出格式

每条技能输出一个 YAML+markdown 块，用 `===` 分隔：

```
---
name: gradient-explosion-under-fp16
memory_type: procedural
subtype: operator-fail
domain: computer-science      # arXiv 顶级分类：physics, math, computer-science, q-bio, stat, eess, econ, q-fin
subdomain: machine-learning   # 参考 https://arxiv.org/category_taxonomy
tags: [adam, mixed-precision, numerical-stability]
---

## When
在 fp16 下用 Adam 训练深度 Transformer；尽管有梯度裁剪，前几个 epoch 损失仍会突然变 NaN。

## Decision
先把 Adam 的 `eps` 从 1e-8 提到 1e-5，再考虑降学习率或改架构。已拒绝的方案：降 LR（只是掩盖症状）、换 SGD（丢掉 Adam 的优点）。

## Why
fp16 精度下 1e-8 会被规约为 0，Adam 的更新步骤相当于除以零。混合精度下多数"梯度爆炸"其实是这个问题，而不是真正的梯度不稳定。

## Local Verifiers
- 梯度裁剪触发**之前**，optimizer state 里就出现了 NaN
- 换成 bf16（动态范围更大）后症状消失 — 印证 eps 假设

## Anti-exemplars
如果是 bf16 或 fp32，不要套用这条 — 那种情况下 eps=1e-8 是正常的。
===
```

## 规则

- **脱敏处理**：去除文件路径、用户名、项目名、私有 URL、合作者姓名。保留科学内容（材料、参数、方法、模型名）。
- **死胡同最珍贵**：失败的实验、放弃的方向往往是最高价值的技能来源，不要跳过。
- **要具体**："IF 损失停滞 THEN 试 X" 是弱技能。"IF Adam 训练 >1B 参数 Transformer 在 warmup 后损失停滞 THEN 试 X 因为 Y" 是强技能。
- **追求覆盖而非精简**：如果你在一年的科研对话里只挑出了 3 条技能，说明绝大多数都被你漏了。

## 完成后

1. 报告一下提取总数和分布（X 条程序性 / Y 条语义 / Z 条情景）。
2. 列出你不确定要不要挖的对话话题 — 问我是否要重新回顾。
3. 提醒我提交：https://researchskills.ai/
````

</details>

运行后提交：[**提交你的 Skill →**](https://researchskills.ai/)

### 方式 C：手动撰写

参照[这个指南 →**](https://researchskills.ai/submit-manually)

> 没有你的研究方向？[提议新领域 →](https://github.com/ScienceIntelligence/ResearchSkills/issues/new?template=04-propose-new-area.md) · 需要某个 Skill？[请求 Skill →](https://github.com/ScienceIntelligence/ResearchSkills/issues/new?template=02-skill-request.yml)

---

<h2 align="center">3. Skill 架构设计</h2>

ResearchSkills 的 Skill 设计基于认知架构理论 — [Soar](https://en.wikipedia.org/wiki/Soar_(cognitive_architecture)) (Laird, 2012)、[ACT-R](https://en.wikipedia.org/wiki/ACT-R) (Anderson, 1996) 和[基于案例的推理](https://en.wikipedia.org/wiki/Case-based_reasoning) (Kolodner, 1993)。Skill 按照**研究者大脑实际存储和检索专业知识的方式**来组织，而非任意分类。

### 三种记忆类型

| 类型 | 存储内容 | 触发时机 |
|------|---------|---------|
| **程序性记忆** | 应对科研困境的 IF-THEN 规则 | Agent 面临决策、卡住或假设失效时 |
| **语义记忆** | LLM 训练数据中缺失的事实 | Agent 需要它不具备的领域知识时 |
| **情景记忆** | 具体的科研经历 | Agent 遇到与过去经验相似的情境时 |

### 程序性记忆 — "如何决策"

按**科研僵局类型**分类（改编自 Soar 的 impasse 分类体系）：

| 子类型 | 僵局 | 示例 |
|--------|------|------|
| `tie` | 多条路径，不知道选哪个 | "消融实验 vs 完全重训 — 先做哪个？" |
| `no-change` | 完全卡住，不知道下一步 | "结果很诡异，完全看不懂" |
| `constraint-failure` | 方法论假设不成立 | "数据不满足 i.i.d. 假设" |
| `operator-fail` | 选对了方法但执行失败 | "方法正确，但大 batch 时 CUDA OOM" |

每个程序性 Skill 包含：**When**（触发条件 + 排除项）→ **Decision**（首选行动 + 被拒替代方案 + 推理）→ **Local Verifiers**（如何验证）→ **Failure Handling**（失败后怎么办）→ **Anti-exemplars**（什么时候不该用）。

### 语义记忆 — "LLM 不知道的事"

只有三种子类型 — 其他内容 LLM 训练数据里已经有了：

| 子类型 | 存储内容 | 示例 |
|--------|---------|------|
| `frontier` | 训练截止后的新知识 | "Flash Attention 3 把 `causal` 参数改名了" |
| `non-public` | 实验室内部未发表的知识 | "这批 H100 的 NCCL 拓扑有问题" |
| `correction` | 纠正 LLM 的错误默认信念 | "Adam eps=1e-8 在混合精度下不稳定，应该用 1e-5" |

### 情景记忆 — "发生了什么"

使用基于案例推理（CBR）术语分类：

| 子类型 | 信号 | 检索触发 |
|--------|------|---------|
| `failure` | "做了 X，因为隐藏原因 Y 失败了" | Agent 准备做类似的事 |
| `adaptation` | "标准方法不行，但变通方法 Z 行得通" | Agent 用标准方法卡住了 |
| `anomalous` | "预期 A，观察到 B — 后来发现很重要" | Agent 观察到类似的异常 |

### 目录结构

```
skills/
└── {domain}/                    # 8 个 arXiv 对齐的顶层领域
    └── {subdomain}/             # 155 个子领域
        └── {contributor}/       # 你的名字
            ├── procedural/      # tie--, no-change--, constraint-failure--, operator-fail--
            ├── semantic/        # frontier--, non-public--, correction--
            └── episodic/        # failure--, adaptation--, anomalous--
```

### 理论基础

完整论述 — 为什么科研困难、为什么 LLM 在科研上力不从心、以及 Skill 如何改变 Agent 行为 — 参见[《为什么科研是困难的》](docs/why-research-is-hard.md)。完整 Schema 规范参见 [Skill Schema Design](docs/superpowers/specs/2026-04-11-skill-schema-design.md)。

---

<h2 align="center">4. 成为审稿人</h2>

审稿人是守护其子领域 Skill 科学质量的领域专家。需要在相关领域有充分的同行评审经验。

**你的职责：** 审核提交的 Skill 的科学准确性和完整性。为贡献者提供建设性反馈。验证通过后将 Skill 状态从 `draft` 提升为 `reviewed`。

**你的权限：** 对所属子领域的提交进行审批或提出修改意见。

[**申请成为审稿人 →**](https://github.com/ScienceIntelligence/ResearchSkills/issues/new?template=03-maintainer-application.yml)

---

<h2 align="center">5. 领域列表</h2>

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

[查看全部 155 个子领域（交互式知识树）→](https://scienceintelligence.github.io/ResearchSkills/)

</div>

---

## 许可证

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — 自由分享与改编，需注明出处。

---

<div align="center">

## 衷心感谢

感谢所有让这一切成为可能的人：

[**贡献者 →**](https://github.com/ScienceIntelligence/ResearchSkills/graphs/contributors) · [**审稿人 →**](https://scienceintelligence.github.io/ResearchSkills/reviewers.html) · [**赞助商 →**](https://scienceintelligence.github.io/ResearchSkills/organizers.html) · [**组织者 →**](https://scienceintelligence.github.io/ResearchSkills/organizers.html)

---

## Star 历史

[![Star History Chart](https://api.star-history.com/svg?repos=ScienceIntelligence/ResearchSkills&type=Date)](https://star-history.com/#ScienceIntelligence/ResearchSkills&Date)

</div>

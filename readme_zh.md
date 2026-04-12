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

**科学，是 AI 剩下的最后一个真正重要的问题。** 真正的科学突破需要一种模型不具备的东西：在前沿领域摸爬滚打多年的研究者直觉。

这种直觉活在你的脑子里 — know-how、启发式方法、推理模式、"我就是知道这行不通"的第六感。它从不被写进论文。它会随着你的退休而消亡。

**OpenScientist 在它消失之前把它留住。** 我们把全世界顶尖研究者的隐性知识 — 他们的技能、思维框架和原则 — 变成可复用的 AI agent 技能（兼容 **Claude Code** 和 **Codex CLI**）。每一份贡献，都让现在和未来的每一个 AI 科学家变得更聪明，永久地。

每个 Skill 编码了领域知识、工具、推理协议和常见陷阱。Skill 可以由领域专家手动撰写，也可以通过 `/extract-knowhow` **从你的科研对话中自动提取**。该命令从你的科研会话中提取三种认知记忆 — **程序性记忆**（应对科研困境的 IF-THEN 规则）、**语义记忆**（LLM 不知道的领域事实）和**情景记忆**（具体的科研经历）— 并将它们打包为可复用的 Skill。让 AI 调用一个 Skill，就能像领域专家一样思考。

---

<h2 align="center">2. 如何贡献</h2>

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

该命令会扫描你的对话历史，提取按认知记忆类型组织的**科研技能**：

- **程序性记忆：** 应对科研困境的 IF-THEN 规则（如"IF 梯度爆炸 THEN 先检查学习率再改架构"）
- **语义记忆：** LLM 不可靠掌握的领域事实（如校准常数、未记录的工具行为、方法局限性）
- **情景记忆：** 具体的科研经历，记录尝试了什么、失败了什么、学到了什么

浏览器交互页面让你审核提取的技能、检查脱敏处理、绑定论文（arXiv/DOI）或项目。提交你的技能到 OpenScientist，它将成为构建更强 AI 科学家的知识库的一部分。

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
回顾我们所有的历史对话，按认知记忆类型提取科研技能。只关注科研活动，忽略通用编程、环境配置或闲聊内容。

提取三种科研知识：

1. **程序性记忆** — 应对科研困境的 IF-THEN 规则：
   - 格式："IF [情境] THEN [行动] BECAUSE [原因]"
   - 重点关注：决策点、失败恢复、方法选择启发式
   - 示例："IF 模型损失在 50 轮后停滞 THEN 先尝试将学习率降低 10 倍再改架构 BECAUSE 架构变更代价高昂，学习率是最常见的原因"

2. **语义记忆** — LLM 不可靠掌握的领域事实：
   - 校准常数、未记录的工具行为、方法局限性
   - 示例："库 X 的默认分词器会静默截断超过 512 个 token 的输入，不会发出警告"

3. **情景记忆** — 具体的科研经历：
   - 尝试了什么、失败了什么、学到了什么
   - 包含死胡同和被放弃的方向 — 这些是最有价值的

对每个技能，包含：
- 科研上下文（在解决什么问题）
- 领域/子领域（如 physics/quantum-physics）
- 置信度：high | medium | low

输出为 markdown 文档，按记忆类型分节。

规则：
- 提取完整的科研轨迹，包括死胡同和被放弃的方向
- 脱敏处理：去除文件路径、用户名、项目名、私有 URL、合作者姓名。保留科学内容（材料、参数、方法）
- 重点捕捉每个动作背后的推理和判断 — 那些永远不会写进论文的直觉
- 不要跳过失败的尝试或放弃的方向 — 它们蕴含隐性知识
- 不要提取通用编程知识、AI 工具使用技巧或教科书基础内容
- 输出之后，询问是否有遗漏的科研对话
```

</details>

运行后提交：[**提交你的 Skill →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=01-submit-skill.yml)

### 方式 C：手动撰写

参照[模板](skills/_template.md)撰写，然后 [**通过 GitHub Issue 提交 →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=01-submit-skill.yml)

> 没有你的研究方向？[提议新领域 →](https://github.com/OpenScientists/OpenScientist/issues/new?template=04-propose-new-area.md) · 需要某个 Skill？[请求 Skill →](https://github.com/OpenScientists/OpenScientist/issues/new?template=02-skill-request.yml)

---

<h2 align="center">3. 成为审稿人</h2>

审稿人是守护其子领域 Skill 科学质量的领域专家。需要在相关领域有充分的同行评审经验。

**你的职责：** 审核提交的 Skill 的科学准确性和完整性。为贡献者提供建设性反馈。验证通过后将 Skill 状态从 `draft` 提升为 `reviewed`。

**你的权限：** 对所属子领域的提交进行审批或提出修改意见。

[**申请成为审稿人 →**](https://github.com/OpenScientists/OpenScientist/issues/new?template=03-maintainer-application.yml)

---

<h2 align="center">4. 领域列表</h2>

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

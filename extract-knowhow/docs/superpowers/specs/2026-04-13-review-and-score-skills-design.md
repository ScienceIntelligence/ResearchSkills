# Design: Review & Score Skills

## Context

`/extract-knowhow` 当前的 pipeline 是 scan → classify → extract (Sonnet) → finalize → upload。Sonnet 提取的 skills 存在三类质量问题：

1. **工程类 skill 泄漏** — 如 Supabase auth deadlock、GitHub Rulesets UI 行为、可视化选型等纯工程内容通过了 tag 过滤
2. **语义重复** — 名字不同但内容高度重叠的 skills（如 `claim-level-paper-chat-diffing` 和 `claim-level-paper-chat-diffing-for-tacit-knowledge`）
3. **匿名化不一致** — 部分 skill 的 contributor 字段仍是原始用户名

此外，当前的 `llm_score` 是 Sonnet 自评的单一数字（0-5），无法回答核心问题：**这个 skill 是否真的扩展了最强 AI 的能力边界？**

## 解决方案

在 extract 和 finalize 之间新增两个 Stage，各自独立：

```
Stage 1 — Scan
Stage 2 — Classify
Stage 3 — Extract (Sonnet)
Stage 4 — Clean (Opus)        ← NEW
Stage 5 — Score (Opus)        ← NEW
Stage 6 — Finalize
Stage 7 — Terminal Summary
```

- Stage 4 和 Stage 5 各自是一个独立脚本（`clean-skills.js` 和 `score-skills.js`）
- 各自调用一次 `claude -p --model opus`，Opus 直接操作磁盘文件
- 两个 Stage 完全隔离：Stage 5 只看到 Stage 4 清洗后存活的文件

---

## Stage 4 — Clean Skills

### 脚本

`scripts/clean-skills.js`，安装到 `~/.claude/utils/clean-skills.js`

### 调用方式

```bash
node ~/.claude/utils/clean-skills.js --session-ids <csv> [--verbose]
```

### 行为

1. 收集 `~/.researchskills/cache/skills/` 下所有目标 session 的 `.md` 文件
2. 将所有 skill 内容内联到 prompt 中（每个 skill 用 `<skill path="...">...</skill>` 标签包裹）
3. 通过 stdin 传给 `claude -p --model opus`
4. Opus 输出结构化 JSON 决策清单，脚本解析后执行文件操作

> **为什么不是 Opus 直接操作文件？** `claude -p`（pipe mode）是纯文本 I/O，不支持工具调用。所以 Opus 输出决策，脚本执行操作。但对于合并操作，Opus 直接在输出中给出合并后的 skill 全文，脚本写入文件——这样创造性工作仍由 Opus 完成。

Opus 逐个审查每个 skill，输出三类决策：

#### 4a. 剔除不合格的 skills

删除不符合"科学研究知识"定义的 skill 文件。判断标准：

**删除**（这些不是 research skill）：
- GitHub 平台操作（权限、Rulesets、repo transfer、CI/CD）
- 前后端工程（auth、数据库、UI 布局、CSS、可视化选型）
- DevOps / 部署 / 包管理
- 项目管理 / 术语命名 / 文档组织

**保留**（这些是 research skill）：
- 科学研究的方法论决策（实验设计、假设选择、数据解释策略）
- AI/LLM 不知道的领域事实（前沿知识、非公开信息、LLM 常见错误信念的纠偏）
- 具体的研究转折点（假设被推翻、方法论放弃、意外发现改变方向）
- 知识表征 / 知识提取的方法论设计（如 schema 设计用于捕获研究决策树）— 当且仅当它讨论的是"如何表征科学知识"而非"如何写代码实现"

#### 4b. 修复匿名化

检查每个存活 skill 的 `contributor` 字段。如果不是 `anon-*` 格式，替换为 `anon-<sha256(原值)前8位>`。

同时扫描 body 内容中可能残留的 PII：
- 原始用户名
- 私有 URL（非 arxiv/doi/github/wikipedia/researchskills.ai）
- 邮箱地址
- 绝对文件路径

发现则移除或替换为通用描述。

#### 4c. 合并重复 skills

如果两个 skill 的核心内容高度重叠（同一个知识点的不同表述），保留内容更丰富、质量更高的那个，删除另一个。

合并判断依据：
- 核心 claim / decision / episode 是否本质相同
- 不同视角描述同一个设计决策 → 合并
- 相似但有实质不同的 scope 或 context → 不合并

### Opus 输出格式

Opus 在回复末尾输出一个 ````clean-result` fenced JSON block：

```json
{
  "actions": [
    {"action": "keep", "file": "skill-xxx-1.md"},
    {"action": "reject", "file": "skill-xxx-2.md", "reason": "engineering: Supabase auth debugging"},
    {"action": "fix_pii", "file": "skill-xxx-3.md", "contributor_hash": "anon-b34ee36c"},
    {"action": "merge", "keep_file": "skill-xxx-4.md", "delete_file": "skill-xxx-5.md", "merged_content": "---\nname: ...\n---\n(full merged skill text)"}
  ]
}
```

脚本解析 JSON 后执行文件操作：
- `reject` → 删除文件
- `fix_pii` → 用正则替换 contributor 字段
- `merge` → 将 `merged_content` 写入 `keep_file`，删除 `delete_file`
- `keep` → 不操作

然后打印 human-readable summary。

---

## Stage 5 — Score Skills

### 脚本

`scripts/score-skills.js`，安装到 `~/.claude/utils/score-skills.js`

### 调用方式

```bash
node ~/.claude/utils/score-skills.js --session-ids <csv> [--verbose]
```

### 行为

1. 收集 Stage 4 存活的 `.md` 文件
2. 将所有 skill 内容内联到 prompt 中，通过 stdin 传给 `claude -p --model opus`
3. Opus 输出每个 skill 的 3 维分数（JSON 格式），脚本解析后写入对应文件的 YAML frontmatter

### 三个评分维度

每个维度 0-5 分。写入 YAML frontmatter 的 `review_scores` 字段：

```yaml
review_scores:
  procedural: 4
  semantic: 2
  episodic: 0
```

#### procedural — 程序性记忆价值

**问题**：这个 skill 是否提供了最强 AI 不熟悉的研究决策流程或原则？

| 分数 | 含义 |
|------|------|
| 0 | AI 完全能自己推导出这个决策逻辑，无需外部提示 |
| 1 | AI 大概率能想到，但可能不会优先选择这条路径 |
| 2 | AI 能想到其中一部分，但会遗漏关键的排除条件或失败处理 |
| 3 | AI 不太可能自主产生这个决策框架，但看到后会认为合理 |
| 4 | AI 在面对同样的研究 impasse 时会走错路，这个 skill 能直接纠正搜索方向 |
| 5 | AI 不仅会走错，而且会对错误方向很有信心；这个 skill 纠正的是一个 confident but wrong 的决策模式 |

**关注点**：决策的 trigger condition 是否具体？是否明确拒绝了某些备选方案并给出理由？失败后怎么恢复？

#### semantic — 陈述性记忆价值

**问题**：这个 skill 是否提供了最强 AI 不知道的知识或信念？

| 分数 | 含义 |
|------|------|
| 0 | 教科书级知识，任何 LLM 都知道 |
| 1 | 公开但冷门的知识，模型可能知道但不确定 |
| 2 | 较新的知识，模型可能在训练截止后才出现 |
| 3 | 模型大概率不知道的具体事实（如某工具的未文档化行为） |
| 4 | 模型在此处持有错误信念，会给出自信但错误的回答 |
| 5 | 非公开的、实验室级别的知识，训练数据中不可能存在 |

**关注点**：这个事实是否有具体的 evidence？是 frontier / non-public / correction 中的哪一类？

#### episodic — 情景性记忆价值

**问题**：这个 skill 是否提供了 AI 可供参考的具体研究经验？

| 分数 | 含义 |
|------|------|
| 0 | 纯抽象建议，没有具体情境 |
| 1 | 有情境描述但很笼统（"在某次实验中……"） |
| 2 | 有具体的情境和行动，但结果/教训不够明确 |
| 3 | 完整的情境-行动-结果，AI 在类似情境下可参考 |
| 4 | 包含反直觉的转折（预期 A 却观察到 B），AI 遇到类似异常时可直接复用 |
| 5 | 高度具体的失败/适应/异常经历，包含明确的 retrieval cue，AI 在相似情境下能被自动触发 |

**关注点**：是否有具体的 situation → action → outcome 链条？教训是否可迁移？

### 关键设计原则

- **三维独立**：一个 procedural skill 可能同时有高 semantic_value（携带 AI 不知道的事实）和高 episodic_value（来自具体研究 episode）
- **核心判断标准**：最强的 AI（Opus 级别）在没有这个 skill 的情况下，是否会在对应维度上表现更差？
- **不是 memory_type 的重复**：`memory_type` 是 skill 的结构分类（它的格式像什么），`review_scores` 是内容价值评估（它真的带来了什么）

### 输出

操作完毕后，Opus 输出 summary：

```
SCORE_RESULT: {"scored": 12, "scores": [{"name": "...", "procedural": 4, "semantic": 2, "episodic": 0}, ...]}
```

---

## 对 extract-knowhow.md 命令文件的修改

### Pipeline 更新

```
scan-sessions.js       ─┐
classify-projects.js   ─┤
extract-skills.js      ─┤  deterministic scripts (you call them)
clean-skills.js        ─┤  ← NEW: Opus cleans extracted skills
score-skills.js        ─┤  ← NEW: Opus scores surviving skills
finalize.js            ─┘
```

### Helper scripts 表格新增

| Script | What it does |
|--------|-------------|
| `clean-skills.js` | Review extracted skills with Opus: reject engineering, fix PII, merge duplicates |
| `score-skills.js` | Score surviving skills with Opus on 3 dimensions: procedural, semantic, episodic value |

### 新增 Stage 4 — Clean Skills

```bash
node ~/.claude/utils/clean-skills.js \
  --session-ids <ALL-research-session-ids-csv> \
  --verbose
```

读取输出，报告：`"Cleaned: kept N, rejected M, merged K."`

### 新增 Stage 5 — Score Skills

```bash
node ~/.claude/utils/score-skills.js \
  --session-ids <ALL-research-session-ids-csv> \
  --verbose
```

读取输出，报告：`"Scored N skills. Average: procedural X.X, semantic X.X, episodic X.X."`

### Stage 编号调整

- Stage 1 — Scan（不变）
- Stage 2 — Classify（不变）
- Stage 3 — Extract（不变）
- Stage 4 — Clean Skills（新）
- Stage 5 — Score Skills（新）
- Stage 6 — Finalize（原 Stage 4）
- Stage 7 — Terminal Summary（原 Stage 5，新增 review_scores 统计）

### Terminal Summary 更新

```
═══════════════════════════════════════════════════════
  /extract-knowhow Complete!
═══════════════════════════════════════════════════════

Extracted N skills from M sessions across P projects:
  • Episodic:   E skills
  • Semantic:   S skills
  • Procedural: Pr skills

Review (Opus):
  • Kept: K / Rejected: R / Merged: G
  • Avg scores: procedural X.X, semantic X.X, episodic X.X

Review your skills:
  → https://researchskills.ai/review/batch/<batchId>
═══════════════════════════════════════════════════════
```

---

## 文件清单

### 新建
- `scripts/clean-skills.js` — Stage 4 脚本
- `scripts/score-skills.js` — Stage 5 脚本

### 修改
- `commands/extract-knowhow.md` — 插入 Stage 4、5，调整后续编号
- `scripts/postinstall.js` — HELPER_SCRIPTS 数组新增两个脚本
- `scripts/postuninstall.js` — 清理新增脚本（如有清理逻辑）

---

## 验证

1. 在现有 cache 上运行 `clean-skills.js`，确认工程类 skills 被删除、PII 被修复、重复被合并
2. 在清洗后的 cache 上运行 `score-skills.js`，确认每个 skill 的 YAML 中有 `review_scores` 字段
3. 运行完整 `/extract-knowhow` 流程，确认 7 个 Stage 顺序正确，Terminal Summary 包含 review 统计
4. 检查上传到 researchskills.ai 的 skills 是否携带 `review_scores`

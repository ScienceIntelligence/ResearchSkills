# Codex Migration Plan

> 从 Claude Code 迁移 extract-knowhow 到 Codex 的平台差异参考。
> 内容与具体 JS 实现正交——无论 skills 脚本怎么改，这些平台事实不变。

---

## 1. Codex Session 文件格式（实测验证 2026-04）

### 文件位置

```
~/.codex/sessions/YYYY/MM/DD/rollout-<datetime>-<uuid>.jsonl
~/.codex/archived_sessions/rollout-<datetime>-<uuid>.jsonl
~/.codex/session_index.jsonl   # 索引：{id, thread_name, updated_at}
```

### JSONL 事件类型全表

每行一个 JSON 对象，`type` 字段区分事件类型，数据在 `payload` 中。

#### session_meta（首行，每个文件只有一条）

```json
{
  "timestamp": "2026-03-12T13:29:01.469Z",
  "type": "session_meta",
  "payload": {
    "id": "019ce23c-0ff4-7fb1-aee9-a3bb96504102",
    "cwd": "/Users/genghejia/Desktop/ai_lawyer",
    "originator": "codex_vscode",
    "cli_version": "0.108.0-alpha.12",
    "source": "vscode",
    "model_provider": "openai",
    "base_instructions": { "text": "..." }
  }
}
```

关键字段：`payload.id`（session UUID）、`payload.cwd`（项目路径）

#### event_msg — 用户消息

```json
{
  "timestamp": "...",
  "type": "event_msg",
  "payload": {
    "type": "user_message",
    "message": "用户输入的文本",
    "images": [],
    "local_images": [],
    "text_elements": []
  }
}
```

#### event_msg — Agent 评论

```json
{
  "type": "event_msg",
  "payload": {
    "type": "agent_message",
    "message": "Agent 的解释性文本...",
    "phase": "commentary"
  }
}
```

`phase` 可能值：`"commentary"`, `"final_answer"`

#### event_msg — 其他（可跳过）

| `payload.type` | 说明 | 提取价值 |
|---|---|---|
| `token_count` | token 使用量统计 | 无，跳过 |
| `task_started` | 任务开始，含 turn_id | 可用于时间戳 |
| `task_complete` | 任务结束，含 last_agent_message | 可用于摘要 |

#### response_item — 工具调用

```json
{
  "type": "response_item",
  "payload": {
    "type": "function_call",
    "name": "exec_command",
    "arguments": "{\"cmd\":\"pwd && ls\",\"workdir\":\"/path\",\"max_output_tokens\":4000}",
    "call_id": "call_Vl7nOpPrsZRGrGi42QDkNCwJ"
  }
}
```

工具名：`exec_command`（shell 命令）、`write_stdin`

#### response_item — 工具输出

```json
{
  "type": "response_item",
  "payload": {
    "type": "function_call_output",
    "call_id": "call_Vl7nOpPrsZRGrGi42QDkNCwJ",
    "output": "Chunk ID: f896ae\nWall time: 0.0509 seconds\nProcess exited with code 0\nOriginal token count: 2571\nOutput:\n实际输出内容..."
  }
}
```

注意：output 包含元数据前缀（Chunk ID, Wall time, exit code, token count），实际内容在 `Output:\n` 之后。

#### response_item — apply_patch（custom_tool_call）

```json
{
  "type": "response_item",
  "payload": {
    "type": "custom_tool_call",
    "status": "completed",
    "call_id": "call_xxx",
    "name": "apply_patch",
    "input": "*** Begin Patch\n*** Add File: /path/to/file.js\n+line1\n+line2\n*** End Patch"
  }
}
```

#### response_item — Assistant 消息

```json
{
  "type": "response_item",
  "payload": {
    "type": "message",
    "role": "assistant",
    "content": [{ "type": "output_text", "text": "..." }],
    "phase": "commentary"
  }
}
```

#### response_item — 推理（加密，无法读取）

```json
{
  "type": "response_item",
  "payload": {
    "type": "reasoning",
    "encrypted_content": "gAAAAAB...(base64)..."
  }
}
```

跳过，加密内容无法解密。

#### turn_context（每个 turn 开头）

```json
{
  "type": "turn_context",
  "payload": {
    "turn_id": "...",
    "cwd": "/path",
    "model": "gpt-5.4",
    "personality": "pragmatic",
    "effort": "low"
  }
}
```

对提取无直接价值，但 `model` 字段可用于判断用了什么模型。

---

## 2. Claude Code vs Codex 对照表

### 消息结构

| 概念 | Claude Code | Codex |
|------|------------|-----------|
| 用户消息 | `{type:"user", message:{role:"user", content}}` | `{type:"event_msg", payload:{type:"user_message", message}}` |
| Assistant 消息 | `{type:"assistant", message:{role:"assistant", content}}` | `{type:"response_item", payload:{type:"message", role:"assistant", content:[{type:"output_text", text}]}}` 或 `{type:"event_msg", payload:{type:"agent_message", message}}` |
| 工具调用 | content 数组中的 `{type:"tool_use", name, input}` | 独立行 `{type:"response_item", payload:{type:"function_call", name, arguments, call_id}}` |
| 工具结果 | content 数组中的 `{type:"tool_result", content}` | 独立行 `{type:"response_item", payload:{type:"function_call_output", call_id, output}}` |
| 文件编辑 | `Edit` 工具 (old_string/new_string) | `apply_patch` (custom_tool_call, unified diff) |
| 时间戳 | 顶层 `timestamp` 字段 | 顶层 `timestamp` 字段 |
| Session ID | 文件名即 ID（`<uuid>.jsonl`） | 文件名中的 UUID 或 `session_meta.payload.id` |
| 项目路径 | JSONL 中的 `cwd` 或目录名编码 | `session_meta.payload.cwd` |

### 工具体系

| Claude Code 工具 | Codex 等价 | 压缩策略建议 |
|---|---|---|
| `Read` | `exec_command` → `cat/head/tail` | 丢弃输出，只保留文件名 |
| `Edit` / `Write` | `apply_patch` | 只保留文件名，保留 rejection |
| `Bash` | `exec_command` | 同 CC：错误 120 字符，正常 60 字符 |
| `Grep` | `exec_command` → `grep/rg` | 丢弃 |
| `Glob` | `exec_command` → `find/fd/ls` | 丢弃 |
| `Agent` | 无直接等价 | N/A |
| `TodoWrite` | 无直接等价 | N/A |

Codex `exec_command` 需要解析 `cmd` 字符串来判断意图：
```
cat/head/tail/less  → 文件读取
grep/rg/ag          → 搜索
find/fd/ls          → 文件发现
git *               → git 操作（��弃）
其他                → 通用 shell 命令
```

### 丢弃/跳过的事件

| 事件 | 原因 |
|------|------|
| `session_meta` | 元数据，非对话内容（但需提取 cwd） |
| `token_count` | 计费信息，无研究价值 |
| `task_started` / `task_complete` | 流程控制，非知识 |
| `reasoning` | 加密，无法读取 |
| `turn_context` | 配置上下文，非对话 |

### 安装路径

| 用途 | Claude Code | Codex |
|------|------------|-----------|
| Skill/Command 文件 | `~/.claude/commands/extract-knowhow.md` | `~/.codex/skills/extract-knowhow/SKILL.md` |
| 辅助脚本 | `~/.claude/utils/` | `~/.codex/skills/extract-knowhow/scripts/` |
| Session 数据 | `~/.claude/projects/` | `~/.codex/sessions/` + `~/.codex/archived_sessions/` |
| 共享缓存 | `~/.openscientist/cache/` | `~/.openscientist/cache/`（共用） |

---

## 3. Codex 非交互模式（`codex exec`）

用于 AI 提取阶段，等价于 Claude Code 的 `claude -p --model haiku`。

```bash
# 基本用法：prompt 通过 stdin 传入
echo "$PROMPT" | codex exec --full-auto --ephemeral

# 指定模型
echo "$PROMPT" | codex exec --full-auto --ephemeral -m <model>

# JSON 输出（结构化）
echo "$PROMPT" | codex exec --full-auto --ephemeral --json

# 输出到文件
codex exec --full-auto --ephemeral -o /tmp/result.txt "prompt here"
```

关键 flag：

| Flag | 作用 |
|------|------|
| `--full-auto` | 自动批准所有操作，无交互 |
| `--ephemeral` | 不持久化 session（避免污染用户 session 历史） |
| `-m <model>` | 指定模型 |
| `--json` | JSONL 事件流输出 |
| `-o <file>` | 最终消息写入文件 |
| `-C <dir>` | 设置工作目录 |
| `--skip-git-repo-check` | 允许在非 git 目录运行 |

**输出行为**：
- 默认：进度信息 → stderr，最终回答 → stdout
- `--json`：所有事件以 JSONL 流式输出到 stdout

---

## 4. SKILL.md 格式差异

### Claude Code（当前）

`~/.claude/commands/extract-knowhow.md` — 纯 Markdown，无需 frontmatter：

```markdown
# /extract-knowhow

Extract research skills from...
```

### Codex（需要 YAML frontmatter）

`~/.codex/skills/extract-knowhow/SKILL.md`：

```yaml
---
name: "extract-knowhow"
description: "Extract research skills from conversation history into OpenScientist skill files."
---
# /extract-knowhow

Extract research skills from...
```

Codex 只在启动时读 frontmatter（name + description），正文在触发后才加载。

### 跨平台建议

SKILL.md 正文内容可以完全相同。postinstall 时：
- Claude Code：直接复制
- Codex：在头部加 YAML frontmatter 后复制

---

## 5. Adapter 架构设计

### 接口

每个平台 adapter 导出一个普通对象，实现以下方法：

```js
{
  name: 'claude-code' | 'codex-cli',

  // Session 发现
  discoverSessions(),                  // → string[]
  extractSessionId(filePath),          // → string
  deriveProjectPath(filePath, meta),   // → string

  // JSONL 解析
  parseEntry(jsonParsedLine),          // → { role, text, timestamp, tools[] } | null
  isDroppedTool(toolName),             // → boolean
  compressTool(toolName, toolInfo, output), // → string | null

  // AI 调用
  runExtraction(prompt, timeoutMs),    // → Promise<{ ok, output, error }>
}
```

### 平台检测

优先级：
1. `--platform` CLI 参数（显式覆盖）
2. 环境变量 `EXTRACT_KNOWHOW_PLATFORM`
3. 文件系统检测（哪个目录有 session 数据）
4. 两个都有 → 两个都扫（合并结果，`source` 字段区分）

### 共享逻辑（不在 adapter 中）

以下逻辑与平台无关，保留在主脚本中：
- Session 过滤（文件大小、消息数、时长、subagent、去重）
- format-session 的 Pass 1.5（清理用户消息）、Pass 3（折叠连续工具）、Pass 4（过滤噪音）
- 验证（validate-skills.js）
- 上传（upload-skills.js）
- 打包（finalize.js）
- 提取 prompt 模板
- 缓存机制

---

## 6. Codex exec_command 输出解析

Codex 的 `function_call_output` 有固定的元数据前缀格式：

```
Chunk ID: f896ae
Wall time: 0.0509 seconds
Process exited with code 0
Original token count: 2571
Output:
<实际命令输出>
```

解析时需要：
1. 提取 `Process exited with code N` 判断成功/失败
2. 跳过前缀行，从 `Output:\n` 之后开始读实际内容
3. 用 exit code + 输出内容中的关键词（Error, Traceback, panic 等）判断是否为错误输出

---

## 7. Subagent 检测

### Claude Code
- Subagent session 在 `subagents/` 子目录中
- 或首 5 行包含 `RESPOND WITH ONLY A VALID JSON OBJECT` / `record_facets`

### Codex
- 待确认。可能通过 `session_meta.payload.originator` 判断
- 或者 Codex 不产生独立的 subagent session 文件

---

## 8. 实施清单

### Phase 1: Adapter 基础设施（重构，不改行为）
- [ ] 创建 `scripts/adapters/index.js`
- [ ] 创建 `scripts/adapters/claude-code.js`（从现有代码提取）
- [ ] 重构 `scan-sessions.js` 使用 adapter
- [ ] 重构 `format-session.js` 使用 adapter
- [ ] 重构 `extract-skills.js` 使用 adapter
- [ ] 验证：Claude Code 功能不回归

### Phase 2: Codex 支持
- [ ] 创建 `scripts/adapters/codex-cli.js`
- [ ] 更新 `postinstall.js` 双平台安装
- [ ] 更新 `postuninstall.js` 双平台卸载
- [ ] 用真实 Codex session 文件测试解析

### Phase 3: 文档
- [ ] 更新 `commands/extract-knowhow.md` 支持动态路径
- [ ] 更新 `README.md` 双平台说明
- [ ] 更新 `OpenScientist/readme.md`

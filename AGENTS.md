# AGENTS.md

## 项目名称

3d-house-viewer

## 项目简介

这是一个面向普通买房用户的网页端 3D/VR 看房系统。

## 开发顺序

1. 先搭建项目结构。
2. 再做首页。
3. 再接地图。
4. 再做 3D 看房。
5. 最后做登录和收藏。

## 回答规则

- 每次回答都要用普通用户能听懂的话解释，不堆术语。
- 如果必须使用技术词，要顺手解释它是什么意思。
- 先说结论，再说关键原因；不要让用户在长篇说明里找重点。
- 如果做了代码或文件改动，要说明改了什么、为什么改、怎么验证。
- 如果遇到不确定的地方，要直接说明不确定点，不要装作已经确认。

## 文件操作规则

- 不要乱删文件。
- 删除、移动、重命名文件前，必须先明确告诉用户风险，并获得用户确认。
- 不要还原或覆盖用户已有改动，除非用户明确要求。
- 修改文件前，先确认改动范围，只改和当前任务直接相关的内容。
- 能小改就小改，不做无关重构。

## 项目体验原则

- 这个项目面向普通买房用户，界面和说明要直观、易懂、少负担。
- 3D/VR 看房功能要优先保证清晰、流畅、好操作。
- 关键操作要有明确反馈，让用户知道当前发生了什么。

## 公网上线

云端数据库推荐用 Supabase。
公网部署推荐用 Vercel。

## Supabase MCP 连接流程

当用户询问“如何初始化云端数据库”“能不能帮我建表”“怎么把本地数据导入 Supabase”时，优先说明并使用 Supabase MCP 方式。

MCP 是让 Codex 连接外部工具的通道。Supabase MCP 配好后，Codex 可以帮用户查看表、执行 SQL、建表、导入初始化数据。

给普通用户的推荐说法：

1. 打开 Supabase，登录后点 `New project`。
2. 项目名按用户喜欢的写，比如 `3d-house-viewer`。
3. 数据库密码最好复杂一些，并保存好，后面如果需要数据库直连时可能会用到。
4. 区域不强行推荐，让用户按 Supabase 页面默认或自己的实际需求选择。
5. 项目创建完成后，进入项目首页的 `Get connected` 区域。
6. 点击 `MCP`，意思是“连接你的 agent”。
7. `Client` 这里选择 `Codex`。
8. 点击顶部的 `Copy prompt`，把 Supabase 生成的完整内容复制给 Codex以及刚才的数据库的密码一起给codex。
9. Codex 按 Supabase 给出的命令添加 MCP、开启远程 MCP 支持，并引导用户完成登录授权。

如果用户没有复制 Supabase 页面生成的完整内容，也可以让用户提供项目后台链接或 `project_ref`，再手动执行：

```bash
codex mcp add supabase --url "https://mcp.supabase.com/mcp?project_ref=项目编号"
```

如果还没有启用远程 MCP 客户端支持，提醒用户需要在 `~/.codex/config.toml` 中确认有：

```toml
[mcp]
remote_mcp_client_enabled = true
```

然后执行 Supabase 登录授权：

```bash
codex mcp login supabase
```

这一步通常会打开浏览器，需要用户自己登录 Supabase 并点击授权。

授权成功后，先检查 MCP 是否可用：

```bash
codex mcp list
```

MCP 可用后，Codex 再帮用户执行项目里的数据库初始化文件：
   - `supabase/migrations/20260513000000_init_house_viewer_schema.sql`：建表。
   - `supabase/seed.sql`：导入示例房源数据。

安全提醒：

- 优先连接 Supabase 的开发项目，不要一开始就直接连正式生产数据库。
- 不要把 `secret key`、`service_role key`、数据库密码写入代码、文档或聊天记录。
- 数据库密码不是 MCP 的必需项。只有后续需要数据库直连、迁移工具或连接串时，才提醒用户提供，并且不要把密码提交到 Git。
- 前端项目只允许使用 `Project URL` 和 `Publishable key`，旧版后台可能叫 `anon public key`。
- 执行会删除、清空、覆盖数据的 SQL 前，必须先明确告诉用户风险，并获得用户确认。

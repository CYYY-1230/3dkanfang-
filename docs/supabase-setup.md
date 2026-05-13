# Supabase 对接指南

这份指南用于把当前项目的房源数据放到 Supabase 云端数据库，并让本地网页能读取云端数据。

简单说：Supabase 就是云端数据库和登录服务。本项目现在已经准备好“本地示例数据”和“云端读取代码”，你只需要创建 Supabase 项目、执行建表和导入数据，再把项目地址和公开密钥填到本地配置里。

## 我已经帮你准备好的文件

- `supabase/migrations/20260513000000_init_house_viewer_schema.sql`：建表文件，会创建小区、楼栋、户型、装修风格、收藏表。
- `supabase/seed.sql`：示例数据文件，会导入当前页面里用到的小区、楼栋、户型和装修风格。
- `.env.example`：环境变量示例文件，用来提醒需要哪些 Supabase 配置。
- `src/lib/supabase.ts`：Supabase 前端连接入口。
- `src/services/houseData.ts`：读取云端房源数据，并在没配置或读取失败时自动切回本地示例数据。

“环境变量”就是配置项，适合放数据库地址和公开访问钥匙，避免直接写死在代码里。

如果你是第一次用 Supabase，先按下面步骤做就行。现在先不用理解所有数据库概念，先把表和示例数据放上去。

## 当前本机状态

我已经检查过当前本机：

- 项目里已经有建表 SQL 和示例数据 SQL。
- Codex 还没有配置 Supabase MCP。
- `.env.local` 里还没有 Supabase 的 `Project URL` 和 `Publishable key`。

MCP 是让 Codex 连接外部工具的通道。Supabase MCP 配好后，Codex 可以直接帮你执行 SQL、查看表和导入数据。

## 推荐方式：用 Supabase MCP 让我帮你执行

### 1. 创建 Supabase 项目

1. 打开 [Supabase](https://supabase.com/)。
2. 注册或登录账号。
3. 点击 `New project`。
4. 填项目名，比如 `3d-house-viewer`。
5. 区域按 Supabase 页面默认或你的实际需求选择。
6. 设置数据库密码，并保存好。
7. 等待项目创建完成。

### 2. 把 Supabase MCP prompt 发给 Codex

1. 进入 Supabase 项目后台。
2. 在项目首页找到 `Get connected` 区域。
3. 点击 `MCP`，意思是“连接你的 agent”。
4. `Client` 选择 `Codex`。
5. 点击顶部的 `Copy prompt`。
6. 把复制出来的完整内容发给 Codex。

如果你没有复制完整 prompt，也可以把项目后台链接或 `project_ref` 发给 Codex。`project_ref` 通常是 Supabase 项目 URL 里的那串项目编号。

### 3. 我拿到信息后会执行的命令

如果你给的是 `project_ref`，我会执行类似下面的命令：

```bash
codex mcp add supabase --url "https://mcp.supabase.com/mcp?project_ref=你的项目编号"
```

如果本机还没有启用远程 MCP 客户端支持，需要确认 `~/.codex/config.toml` 里有：

```toml
[mcp]
remote_mcp_client_enabled = true
```

然后执行登录授权：

```bash
codex mcp login supabase
```

这一步通常会打开浏览器，需要你自己登录 Supabase 并点击授权。授权成功后，我会检查：

```bash
codex mcp list
```

### 4. MCP 连上后我会帮你初始化数据库

我会通过 Supabase MCP 执行：

1. `supabase/migrations/20260513000000_init_house_viewer_schema.sql`：创建表。
2. `supabase/seed.sql`：导入示例房源数据。

执行成功后，左侧 `Table Editor` 里应该能看到这些表：

- `communities`：小区
- `buildings`：楼栋或期数
- `layouts`：户型
- `decor_styles`：装修风格
- `favorites`：用户收藏

## 备用方式：你自己在网页 SQL Editor 执行

如果暂时不配置 MCP，也可以手动操作：

### 1. 创建数据库表

1. 进入 Supabase 项目后台。
2. 打开左侧 `SQL Editor`。
3. 点击 `New query`。
4. 打开本项目里的 `supabase/migrations/20260513000000_init_house_viewer_schema.sql`。
5. 全部复制到 Supabase 的 SQL Editor。
6. 点击 `Run`。

### 2. 导入示例数据

1. 继续打开 `SQL Editor`。
2. 新建一个 SQL 查询。
3. 打开本项目里的 `supabase/seed.sql`。
4. 全部复制进去。
5. 点击 `Run`。

执行成功后，可以在 `Table Editor` 检查数据数量：

- `communities` 应该有 3 条
- `buildings` 应该有 4 条
- `layouts` 应该有 7 条
- `decor_styles` 应该有 3 条

也可以在 `SQL Editor` 里运行下面这段检查：

```sql
select 'communities' as table_name, count(*) as total from public.communities
union all
select 'buildings', count(*) from public.buildings
union all
select 'layouts', count(*) from public.layouts
union all
select 'decor_styles', count(*) from public.decor_styles;
```

## 让本地网页读取 Supabase

1. 在 Supabase 左侧打开 `Project Settings`。
2. 打开 `Data API` 或 `API Keys`。不同版本后台名字可能略有不同。
3. 复制 `Project URL`。
4. 复制 `Publishable key`。

注意：

- 如果后台只看到旧版 `anon public` key，也可以先用它；新版更推荐 `Publishable key`。
- 不要复制 `secret` key 或 `service_role` key 到前端项目里。它们像管理员钥匙，泄露后风险很高。

然后打开项目里的 `.env.local`，加入下面两行：

```env
VITE_SUPABASE_URL=你的 Project URL
VITE_SUPABASE_PUBLISHABLE_KEY=你的 Publishable key
```

`VITE_` 是 Vite 项目的规则，表示这个配置可以被前端页面读取。

保存后重启本地开发服务：

```bash
npm run dev
```

打开页面后，首页顶部会显示数据来源：

- `云端数据`：说明已经读到 Supabase。
- `示例数据`：说明还没填配置，或者 Supabase 暂时读取失败，页面正在用本地数据兜底。

## 验证方式

### 1. 在 Supabase 后台验证

1. 打开 Supabase 的 `Table Editor`。
2. 点开 `communities`、`buildings`、`layouts`。
3. 确认能看到中文房源数据。

### 2. 在本地网页验证

1. 确认 `.env.local` 已填写 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_PUBLISHABLE_KEY`。
2. 重启 `npm run dev`。
3. 打开首页。
4. 看到 `云端数据` 就表示本地网页已经连到 Supabase。

## 常见问题

### SQL 执行报错怎么办？

先看报错里有没有具体表名。如果是某个表已经存在，通常可以继续执行后面的数据导入；这份建表文件已经尽量写成“存在就不重复创建”。

### 示例数据可以重复导入吗？

可以。`seed.sql` 里用了“同一个 id 就更新”的写法，所以重复运行不会产生一堆重复房源。

### 为什么没有马上改收藏为云端保存？

当前收藏仍保存在浏览器本地。云端收藏需要登录功能，因为数据库要知道“是谁收藏的”。项目开发顺序里登录和收藏排在最后，所以这里先完成房源数据对接，避免一下子把范围做大。

### 后面部署到 Vercel 要填什么？

和本地一样，在 Vercel 项目的 `Environment Variables` 里填：

```env
VITE_SUPABASE_URL=你的 Project URL
VITE_SUPABASE_PUBLISHABLE_KEY=你的 Publishable key
```

这样线上网页才能连到同一个 Supabase 数据库。

## 安全提醒

- 优先连接 Supabase 的开发项目，不要一开始就直接连正式生产数据库。
- 不要把 `secret key`、`service_role key`、数据库密码写入代码、文档或聊天记录。
- 数据库密码不是 MCP 的必需项。只有后续需要数据库直连、迁移工具或连接串时才会用到。
- 前端项目只允许使用 `Project URL` 和 `Publishable key`，旧版后台可能叫 `anon public key`。
- 执行会删除、清空、覆盖数据的 SQL 前，必须先确认风险。当前这两个初始化文件不会主动清空整库。

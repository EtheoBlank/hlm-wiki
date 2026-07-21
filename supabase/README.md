# 红楼梦人物维基 · Supabase 集成

## 1. 创建 Supabase 项目

1. 访问 https://supabase.com/dashboard
2. 点击 "New Project"
3. 名称：`hlm-wiki`
4. 数据库密码：<自己设置，记住>
5. Region：Singapore / N. Virginia
6. 等待 1-2 分钟

## 2. 执行 SQL Schema

在 Supabase Dashboard → **SQL Editor** → New Query → 粘贴 `supabase/schema.sql` 全部内容 → Run

这会创建：
- `characters` (204 行) + 4 个 GIN 索引
- `character_content` + 4 个 GIN 索引
- `judgements` (15 行) + GIN 索引
- `glossary_terms` (200+ 行) + GIN 索引
- `page_views` (浏览统计) + 索引
- 全文搜索触发器（自动维护 tsvector）
- 4 个 RPC 函数（search, increment_view, top_characters, ...）
- RLS 策略（anon 可读可写 views）

## 3. 获取 API 凭证

在 Supabase Dashboard → **Settings** → **API** 复制：

- **Project URL**: `https://<your-project-ref>.supabase.co`
- **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (以 `eyJ` 开头)
- **service_role key**: （admin 操作，**不要暴露给客户端**）

## 4. 配置到 Vercel

在 Vercel 项目 → **Settings** → **Environment Variables** 添加：

```
NEXT_PUBLIC_SUPABASE_URL = https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGc...
```

（NEXT_PUBLIC_ 前缀表示暴露给客户端；supabase JS client 用于 anon 操作）

## 5. 触发自动部署

`git push` 后 Vercel 会自动重新部署。

## 6. （可选）批量导入数据

数据从仓库的 `content/` Markdown 文件导入 Supabase：
- 仓库根创建 `scripts/import-to-supabase.mjs`
- 用 `gray-matter` 解析 `profile.md`, `quotes.md` 等
- 批量 INSERT 到 `characters` + `character_content` + `judgements` + `glossary_terms`

> 完整 import 脚本见 `scripts/import-to-supabase.mjs`（待创建）

## 7. 搜索 API

部署后，Next.js 路由：
- `GET /api/search?q=林黛玉&lang=zh` → 调用 Supabase RPC `search_all_v2`
- `GET /zh/search?q=林黛玉` → 搜索结果页

## 数据流

```
content/<family>/<slug>/profile.md
  ↓ scripts/import-to-supabase.mjs
  ↓
Supabase Postgres
  ├─ characters (master table)
  ├─ character_content (4 types per char)
  ├─ judgements (15)
  └─ glossary_terms (200+)
  ↓
Next.js site
  ├─ /zh (static, from content/)
  ├─ /zh/search?q=... (Supabase)
  └─ /zh/character/[id] (Supabase + static fallback)
```

最后更新：2026-07-20
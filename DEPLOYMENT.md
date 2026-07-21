# 部署指南 / Deployment Guide

## Vercel 一键部署

### 方式 1：Vercel CLI（推荐）

```bash
# 安装 Vercel CLI（如果未安装）
npm install -g vercel

# 登录
vercel login

# 在项目根目录
cd D:\桌面\KIMI\hlm-wiki

# 部署
vercel --prod
```

### 方式 2：GitHub + Vercel 自动部署

1. 将 `D:\桌面\KIMI\hlm-wiki\` 推送到 GitHub：
   ```bash
   git remote add origin https://github.com/<用户名>/hlm-wiki.git
   git push -u origin main
   ```

2. 在 [vercel.com](https://vercel.com) 新建项目，导入该 GitHub 仓库

3. Vercel 会自动识别 Next.js，使用 `vercel.json` 配置：
   - **Framework Preset**: Next.js
   - **Build Command**: `cd site && npm install && npm run build`
   - **Output Directory**: `site/out`

### 方式 3：手动上传

1. 在本地构建：
   ```bash
   cd site
   npm install
   npm run build
   ```

2. 拖拽 `site/out` 目录到 [vercel.com/new](https://vercel.com/new)

## 本地预览

```bash
cd D:\桌面\KIMI\hlm-wiki\site
npm run dev
# 访问 http://localhost:3000
```

或使用 Python 简易 HTTP 服务器预览 `out/`：

```bash
cd site/out
python -m http.server 8080
# 访问 http://localhost:8080
```

## 当前状态（v1）

- ✅ 788 文件已提交到 Git
- ✅ Next.js 14 静态站点可构建（414 静态 HTML）
- ✅ 4 轮红学审查完成，0 错误
- ⏳ 等待 Vercel 部署

## 自定义域名

部署后，在 Vercel 项目 Settings → Domains 添加自定义域名（如 `hlm.wiki`）。

## 环境要求

- Node.js ≥ 18
- npm ≥ 9

## 关键路径

| 路径 | 说明 |
|------|------|
| `vercel.json` | Vercel 配置 |
| `site/` | Next.js 14 项目 |
| `site/out/` | 构建产物（414 HTML + 静态资源） |
| `site/lib/data.ts` | 角色数据加载 |
| `site/lib/markdown.ts` | Markdown → HTML |
| `site/app/[lang]/page.tsx` | 首页（中英） |
| `site/app/[lang]/character/` | 角色页 |
| `content/` | 源 Markdown 内容 |
| `assets/portraits/` | 古风人物像 |

最后更新：2026-07-20
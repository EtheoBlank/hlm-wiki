# 🚀 红楼梦人物维基 · 5 步部署

## 比其他项目**更简单**的方法

很多人 Vercel 部署只用 Vercel 后台，**不需要 CLI、不需要 token**。

## 🚀 5 步完成（无 token）

### 1. 打开 Vercel 后台
👉 https://vercel.com/new

### 2. 点击 "Import Git Repository"
- 用 GitHub 登录
- 搜索 `EtheoBlank/hlm-wiki`
- 点 "Import"

### 3. 等待 Vercel 自动识别项目
Vercel 会自动读取根目录的 `vercel.json`，显示：
- **Framework Preset**: Next.js
- **Build Command**: `cd site && npm install && npm run build`
- **Output Directory**: `site/out`

### 4. 点击 "Deploy"
- 5–10 分钟构建完成
- 部署成功会得到 URL：`https://hlm-wiki-xxx.vercel.app`

### 5. （可选）绑定自定义域名
在 Vercel 项目 → Settings → Domains 添加 `hlm.wiki`（如需）

---

## 为什么这个项目之前"麻烦"？

| 步骤 | 其他项目 | 本项目 | 原因 |
|------|----------|--------|------|
| 仓库根 | 只有源码 | 源码 + `site/` + `content/` | 红楼梦 wiki 内容多 |
| Vercel 配置 | 一个 `package.json` | 根 `vercel.json` + `site/vercel.json` | 需建站分离 |
| 部署命令 | `npm run build` | `cd site && npm install && npm run build` | site 是子目录 |
| 输出 | `.next/` | `site/out/` | 用静态导出 |

**但 Vercel 后台**能自动处理根目录的 `vercel.json`，**不需要 CLI**。

---

## 如果你坚持用 vercel CLI

### 方式 1：本地先登录
```powershell
cd D:\桌面\KIMI\hlm-wiki
vercel login
# 浏览器完成授权
vercel link
vercel --prod
```

### 方式 2：提供 VERCEL_TOKEN
```powershell
$env:VERCEL_TOKEN = "your-token-here"
cd D:\桌面\KIMI\hlm-wiki
vercel link --yes
vercel deploy --prod --yes
```

### 方式 3：GitHub Action 自动部署
代码已配好 workflow（`.github/workflows/deploy.yml`）。  
在 https://github.com/EtheoBlank/hlm-wiki/settings/secrets/actions 添加 3 个 Secret：
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

**之后每次 push 都自动部署**。

---

## 🎯 结论

**项目结构没问题，配置已就位**。最简路径就是 Vercel 后台 5 步，不需要 CLI 也不需要 token。

最简方式：**打开 https://vercel.com/new → Import `EtheoBlank/hlm-wiki` → Deploy**
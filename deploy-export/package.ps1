#!/usr/bin/env pwsh
# 一键打包脚本：生成可移植的部署包
# Usage: .\package.ps1

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot

Write-Host "=== 红楼梦人物维基 · 部署包生成 ===" -ForegroundColor Cyan
Write-Host ""

# 1. 创建导出目录
$exportDir = Join-Path $root "deploy-export"
if (Test-Path $exportDir) {
    Remove-Item -Recurse -Force $exportDir
}
New-Item -ItemType Directory -Path $exportDir | Out-Null
Write-Host "[1/5] 创建导出目录: $exportDir" -ForegroundColor Yellow

# 2. 复制源文件（排除 node_modules、.next、out 等）
Write-Host "[2/5] 复制源文件..." -ForegroundColor Yellow
$excludeDirs = @('node_modules', '.next', 'out', '.git', 'site\out')
$excludeFiles = @('*.tsbuildinfo')

# 使用 robocopy 或自定义复制
$sourceDirs = @('content', 'assets', 'planning', '_meta', 'site', 'README.md', 'DEPLOYMENT.md', 'vercel.json', '.gitignore', 'deploy.ps1', 'package.ps1')

foreach ($item in $sourceDirs) {
    $src = Join-Path $root $item
    $dst = Join-Path $exportDir $item
    if (Test-Path $src) {
        if ((Get-Item $src) -is [System.IO.DirectoryInfo]) {
            robocopy $src $dst /E /XD node_modules .next out .git /XF *.tsbuildinfo 2>&1 | Out-Null
            Write-Host "  ✓ $item"
        } else {
            Copy-Item -Path $src -Destination $dst -Force
            Write-Host "  ✓ $item"
        }
    }
}

# 3. 生成 git bundle
Write-Host "[3/5] 生成 git bundle..." -ForegroundColor Yellow
Set-Location $root
git bundle create (Join-Path $exportDir "hlm-wiki.bundle") --all 2>&1 | Select-Object -First 3
if (Test-Path (Join-Path $exportDir "hlm-wiki.bundle")) {
    $bundleSize = [Math]::Round((Get-Item (Join-Path $exportDir "hlm-wiki.bundle")).Length / 1MB, 2)
    Write-Host "  ✓ hlm-wiki.bundle ($bundleSize MB)" -ForegroundColor Green
}

# 4. 生成 zip
Write-Host "[4/5] 生成 zip 包..." -ForegroundColor Yellow
$zipPath = Join-Path $root "hlm-wiki.zip"
if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}
Compress-Archive -Path (Join-Path $exportDir "*") -DestinationPath $zipPath -Force
$zipSize = [Math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host "  ✓ hlm-wiki.zip ($zipSize MB)" -ForegroundColor Green

# 5. 生成部署说明
Write-Host "[5/5] 生成 INSTRUCTIONS.md..." -ForegroundColor Yellow

$bundleRel = "deploy-export\hlm-wiki.bundle"
$zipRel = "hlm-wiki.zip"

$instructions = @"
# 红楼梦人物维基 · 部署说明

## 包内容

| 文件 | 大小 | 说明 |
|------|------|------|
| hlm-wiki.zip | ${zipSize} MB | 完整源码（不含 node_modules / out） |
| hlm-wiki.bundle | ${bundleSize} MB | Git bundle（包含 4 个 commit） |
| deploy-export/ | 源文件 | 包含完整源码 |

## 方式 1：Vercel CLI（推荐）

### 步骤 1：解压并进入目录
\`\`\`powershell
Expand-Archive hlm-wiki.zip -DestinationPath hlm-wiki-deploy
cd hlm-wiki-deploy
\`\`\`

### 步骤 2：登录 Vercel
\`\`\`powershell
vercel login
# 在浏览器中完成授权
\`\`\`

### 步骤 3：部署
\`\`\`powershell
cd site
npm install
npm run build
cd ..
vercel --prod
# 接受默认配置，Vercel 会读取 vercel.json
\`\`\`

## 方式 2：GitHub + Vercel 自动部署

### 步骤 1：创建 GitHub 仓库
1. 访问 https://github.com/new
2. 仓库名: hlm-wiki
3. 设置为 Public 或 Private
4. **不要**初始化 README

### 步骤 2：推送代码
\`\`\`bash
# 方式 A：使用 GitHub Token
git remote add origin https://<TOKEN>@github.com/<用户名>/hlm-wiki.git
git push -u origin main

# 方式 B：使用 SSH
git remote add origin git@github.com:<用户名>/hlm-wiki.git
git push -u origin main
\`\`\`

### 步骤 3：在 Vercel 后台连接
1. 访问 https://vercel.com/new
2. 选择 "Import Git Repository"
3. 选择 hlm-wiki 仓库
4. Vercel 自动识别 vercel.json 配置
5. 点击 "Deploy"

## 方式 3：手动上传 site/out

1. 在本地构建：\`cd site && npm install && npm run build\`
2. 访问 https://vercel.com/new
3. 拖拽 \`site/out\` 目录到上传区域
4. 点击 "Deploy"

## 验证部署

部署成功后，访问返回的 URL，应能看到：
- 首页：\`https://<你的域名>/zh/\` 或 \`/en/\`
- 人物列表：\`/zh/character/\`
- 角色详情：\`/zh/character/jia-family/jia-baoyu/\`

## 常见问题

### 部署失败
- 检查 \`vercel.json\` 中的 buildCommand: \`cd site && npm install && npm run build\`
- 检查 \`site/out\` 是否生成（\`npm run build\` 后）

### 404 错误
- 静态导出使用 \`trailingSlash: true\`
- URL 必须以 \`/\` 结尾（如 \`/zh/\` 而不是 \`/zh\`）

### 图片不显示
- 检查 \`site/lib/data.ts\` 中的 \`getPortraitUrl\` 路径
- \`assets/portraits/\` 目录需要包含在部署中

## 项目元信息

- **总文件**: 800+
- **静态页面**: 414 (zh + en × 204 角色 + 6 公共)
- **人物像**: 113 张
- **Git 提交**: 4 个
- **构建命令**: \`cd site && npm install && npm run build\`
- **输出目录**: \`site/out\`

最后更新: 2026-07-20
"@

$instructions | Out-File -FilePath (Join-Path $exportDir "INSTRUCTIONS.md") -Encoding UTF8
Write-Host "  ✓ INSTRUCTIONS.md" -ForegroundColor Green

Write-Host ""
Write-Host "=== 完成 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "生成文件:"
Write-Host "  - $exportDir/INSTRUCTIONS.md (部署说明)"
Write-Host "  - $exportDir/hlm-wiki.bundle (Git bundle, $bundleSize MB)"
Write-Host ""
Write-Host "  - $zipPath ($zipSize MB)"
Write-Host ""
Write-Host "请使用任一方式部署到 Vercel"
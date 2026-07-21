#!/usr/bin/env pwsh
# Vercel 部署脚本 / Vercel Deployment Script
# Usage: .\deploy.ps1

$ErrorActionPreference = "Stop"

Write-Host "=== 红楼梦人物维基 · Vercel 部署 ===" -ForegroundColor Cyan
Write-Host ""

# 1. 检查环境
Write-Host "[1/5] 检查环境..." -ForegroundColor Yellow
$nodeVer = node --version
$npmVer = npm --version
Write-Host "  Node: $nodeVer"
Write-Host "  npm:  $npmVer"

if (-not (Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "  Vercel CLI 未安装" -ForegroundColor Red
    Write-Host "  安装: npm install -g vercel" -ForegroundColor Yellow
    $install = Read-Host "  是否现在安装？[y/N]"
    if ($install -eq "y" -or $install -eq "Y") {
        npm install -g vercel
    } else {
        Write-Host "  请先安装 Vercel CLI"
        exit 1
    }
}

# 2. 检查登录
Write-Host ""
Write-Host "[2/5] 检查 Vercel 登录..." -ForegroundColor Yellow
$vercelWhoami = vercel whoami 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "  未登录" -ForegroundColor Red
    Write-Host "  请先运行: vercel login" -ForegroundColor Yellow
    $login = Read-Host "  是否现在登录？[y/N]"
    if ($login -eq "y" -or $login -eq "Y") {
        vercel login
    } else {
        exit 1
    }
} else {
    Write-Host "  已登录: $vercelWhoami"
}

# 3. 安装依赖
Write-Host ""
Write-Host "[3/5] 安装 Next.js 依赖..." -ForegroundColor Yellow
Push-Location "site"
if (-not (Test-Path "node_modules")) {
    npm install --no-audit --no-fund --loglevel=error
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  依赖安装失败" -ForegroundColor Red
        Pop-Location
        exit 1
    }
} else {
    Write-Host "  node_modules 已存在，跳过"
}
Pop-Location

# 4. 构建
Write-Host ""
Write-Host "[4/5] 构建 Next.js 静态站点..." -ForegroundColor Yellow
Push-Location "site"
npm run build 2>&1 | Select-Object -Last 5
if ($LASTEXITCODE -ne 0) {
    Write-Host "  构建失败" -ForegroundColor Red
    Pop-Location
    exit 1
}
$htmlCount = (Get-ChildItem -Path "out" -Recurse -Filter "*.html" | Measure-Object).Count
Write-Host "  生成 $htmlCount 个静态 HTML 页面" -ForegroundColor Green
Pop-Location

# 5. 部署
Write-Host ""
Write-Host "[5/5] 部署到 Vercel..." -ForegroundColor Yellow
$confirm = Read-Host "  确认部署到生产环境？[y/N]"
if ($confirm -eq "y" -or $confirm -eq "Y") {
    vercel --prod
} else {
    Write-Host "  取消部署" -ForegroundColor Yellow
    Write-Host "  你可以稍后运行: vercel --prod"
}

Write-Host ""
Write-Host "=== 完成 ===" -ForegroundColor Cyan
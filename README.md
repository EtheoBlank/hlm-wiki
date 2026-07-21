# 红楼梦人物维基 / Hong Lou Meng Character Wiki

> 中英对照的红楼梦人物维基，结构参照 ASOIAF Wiki，部署 Vercel。

## 项目目标

- 覆盖 498 个红楼梦有名有姓人物
- 底本：程乙本（俞平伯校注人文社本），脂批异文脚注
- 英译：Hawkes《The Story of the Stone》精校参照
- 设计语言：参照 ASOIAF Wiki（awoiaf.westeros.org）

## 内容完成度（截至 2026-07-20）

| 层级 | 完整 4 文件 + 图 | 极简 profile | 合计 |
|------|----------------|------------|------|
| **Tier A** 金陵十二钗 | 18 / 18 (100%) | 0 | 18 |
| **Tier B** 重要配角 | 95 / 95 (100%) | 0 | 95 |
| **Tier C** 次要人物 | 0 | 91 / 385 (24%) | 91 |
| **合计** | **113** | **91** | **204 / 498 = 41.0%** |

## 项目结构

```
hlm-wiki/
├── README.md                       ← 本文件
├── .gitignore
├── vercel.json                     ← Vercel 部署配置
├── _meta/                          ← 元数据与权威参考
│   ├── STATUS.md
│   ├── hawkes-volume-reference.md
│   ├── judgement-page-reference.md
│   └── stub-template.md
├── planning/                       ← 规划文档（9 份）
│   ├── 01-scope.md
│   ├── 02-sources.md
│   ├── 03-character-roster.md
│   ├── 04-timeline.md
│   ├── 05-relationships.md
│   ├── 06-card-template.md
│   ├── 07-glossary.md
│   ├── 08-style-guide.md
│   └── 09-site-research.md
├── content/                        ← 人物条目（204 角色）
│   ├── _metadata/                  [TODO]
│   └── <家族>/<人物>/
│       ├── profile.md
│       ├── story.md
│       ├── relationships.md
│       └── quotes.md
├── assets/portraits/               ← 古风人物像（113 张）
│   └── <家族>/<人物>/<变体>-v1-<场景>_001.jpg
└── site/                           ← Next.js 14 站点（待部署）
    ├── package.json
    ├── next.config.js
    ├── tsconfig.json
    ├── tailwind.config.ts
    ├── postcss.config.js
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── [lang]/
    │       ├── page.tsx
    │       ├── character/[id]/page.tsx
    │       ├── family/[family]/page.tsx
    │       ├── timeline/page.tsx
    │       └── glossary/page.tsx
    ├── components/
    │   └── TopNav.tsx
    └── lib/
        └── data.ts
```

## 资料源优先级

1. **程乙本**（俞平伯校注人文社本，1982）
2. **脂本系统**：庚辰本 / 甲戌本 / 戚序本 / 蒙府本
3. **Hawkes《The Story of the Stone》**（Penguin Classics，1973–1986）
4. **现代红学家**：俞平伯、周汝昌、冯其庸、欧丽娟、王蒙、白先勇、刘心武

## 关键技术决策

- **判词页码**：以 `_meta/judgement-page-reference.md` 为权威来源
- **Hawkes 卷号**：以 `_meta/hawkes-volume-reference.md` 为权威来源
- **脂批**：所有脂批引用均带版本来源（甲戌 / 庚辰 / 戚序 / 蒙府）
- **[待校]** 标记：所有存疑处必标，不滥用，不漏标

## 快速开始

```bash
cd site
npm install
npm run dev    # 开发
npm run build  # 构建 → site/out
```

## 部署

`vercel.json` 已配置：
- Framework: Next.js 14
- Build: `cd site && npm install && npm run build`
- Output: `site/out`（静态导出）

部署到 Vercel：
```bash
npx vercel --prod
```

或连接 GitHub 仓库 → Vercel 自动部署。

## 项目里程碑

- **Phase 0** 规划 ✅
- **Phase 1A** Tier A 18 人物完整 ✅
- **Phase 1B** Tier B 95 人物完整 ✅
- **Phase 1C** Tier C 91 人物极简 profile ✅
- **Phase 2** 红学家审查 + 修复 ✅（4 轮审查，100+ 修复，0 错误）
- **Phase 3** 站点搭建 ✅（Next.js + MDX 骨架）
- **Phase 4** Git 提交 + Vercel 部署（进行中）

最后更新：2026-07-20
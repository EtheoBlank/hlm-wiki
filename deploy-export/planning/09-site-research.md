# 09 · 网站交互案例研究

> **目标**：调研 ASOIAF Wiki / Wikipedia / 数字人文项目的优秀交互设计，为 Phase 4 网站选型提供决策依据。

---

## 1. 直接对标 · ASOIAF Wiki (awoiaf.westeros.org)

### 1.1 信息架构

- **首页**：导航 + 搜索 + 入门指南
- **人物页**：
  - Top：Infobox（图片 + 基本信息表 + 关键标签）
  - 左侧目录（Table of Contents）
  - 正文：分章节"Appearance"、"Recent Events"、"History"、"Family Tree"
  - 底部：References、Quotes、Behind the Scenes
- **章节页**：POV 视角切换、章末时间线
- **家谱**：可视化族谱
- **关系图**：网络图（点击人物进入条目）

### 1.2 可借鉴的设计

| 设计 | 借鉴点 | 红楼梦映射 |
|------|--------|-----------|
| **Infobox** | 标准化的角色卡（图片 + 元数据） | 人物档案表 |
| **POV 视角** | 每个章节按视角人物切换 | 红楼梦可按章回主要视角人物 |
| **章末时间线** | 每章底部加时间线 | 120 回每回加时间线 |
| **族谱** | 可视化点击展开 | 贾府五代族谱 |
| **关系网络** | 节点-边图 | 人物关系图谱 |
| **多版本并列** | "Book vs. Show" 双栏 | "程乙本 vs 脂本" 双栏 |
| **引用链接** | 每段加 wiki 链接 | 原文 → 判词 → 脂批三联 |

### 1.3 URL 模式

- `awoiaf.westeros.org/index.php/Jon_Snow`
- 静态 URL + 简洁
- 我们的设计：`hlm.wiki/character/lin-daiyu`

---

## 2. Wikipedia (zh.wikipedia.org / en.wikipedia.org)

### 2.1 红楼梦条目分析（zh.wikipedia.org/wiki/贾宝玉）

- **Infobox**：人名、生卒、籍贯、亲属、扮演者、配音
- **目录结构**：
  1. 简介
  2. 家世与生平
  3. 性格与形象
  4. 主要情节
  5. 文学评价
  6. 影视形象
  7. 参考文献
  8. 外部链接
- **脚注**：每段编号，文末"参考文献"
- **"参见"**：底部相关条目链接
- **多语言切换**：左侧栏（"其他语言"）

### 2.2 可借鉴

| 设计 | 借鉴 |
|------|------|
| **Infobox 模板** | 人物档案表 |
| **目录结构** | 固定章节模板 |
| **"参见"链接** | 底部相关人物跳转 |
| **多语言切换** | 中英切换器 |
| **脚注规范** | 学术引用格式 |
| **分类页** | "金陵十二钗"分类页 |

---

## 3. 关系图谱 · Wikidata + Reasonator

### 3.1 Wikidata 模式

- 每人一个 Q-ID（如 Q12345）
- 关系用属性："spouse"、"child"、"father"、"mother"
- SPARQL 查询

### 3.2 红楼梦适配

- 每个角色一个 `id`（如 `lin-daiyu`）
- 关系表（见 `05-relationships.md`）
- 数据存储为 JSON，可视化用 D3.js / Cytoscape.js

---

## 4. 时间线 · TimelineJS / Tiki-Toki

### 4.1 TimelineJS (timeline.knightlab.com)

- 横向时间轴
- 事件卡片（图片 + 文字）
- 多媒体支持（视频、图片、地图）
- 时间跨度支持

### 4.2 红楼梦适配

- 时间轴：女娲补天 → 故事开始 → 120 回
- 事件：每回关键事件
- 切换视角：宝玉线 / 黛玉线 / 凤姐线

---

## 5. 谱系图 · Family Echo / Gramps

### 5.1 familyecho.com

- 可视化族谱
- 点击节点展开
- 导出 GEDCOM

### 5.2 红楼梦适配

- 贾府五代族谱
- 王、史、薛、林、邢、尤、夏 等姻亲
- 主仆关系（次要）

---

## 6. 古籍数字化 · ctext.org

### 6.1 中国哲学书电子化计划

- 全文本检索
- 多版本异文对照
- 章句索引
- 现代注疏

### 6.2 红楼梦适配

- 程乙本全文检索
- 程乙本 vs 庚辰本异文并列
- 章回关键词索引

---

## 7. 多语言对照 · Chinese Text Project / Wikisource

### 7.1 模式

- 双栏对照（中英/中法/中德）
- 段落同步滚动
- 术语链接

### 7.2 红楼梦适配

- 中文原文 + Hawkes 译文双栏
- 同步滚动
- 术语标注

---

## 8. 推荐的技术栈

### 8.1 选型 1：Next.js + MDX + Tailwind CSS（**推荐**）

| 优势 | 劣势 |
|------|------|
| SSG（静态生成）+ ISR（增量更新） | 学习曲线 |
| MDX（Markdown + JSX）适合内容 | 配置多 |
| Vercel 原生支持 | — |
| i18n 原生支持 | — |
| 中文 + 英文 SEO 友好 | — |

**路由结构**：

```
/zh/character/lin-daiyu
/en/character/lin-daiyu
/zh/timeline
/en/timeline
/zh/glossary
/en/glossary
```

### 8.2 选型 2：Astro + Content Collections

| 优势 | 劣势 |
|------|------|
| 极快（默认零 JS） | 社区小 |
| Content Collections 适合 400+ 人物 | — |
| Vercel 适配 | — |
| 多语言 | 需手配 |

### 8.3 选型 3：纯 HTML + 静态生成器（11ty/Hugo）

| 优势 | 劣势 |
|------|------|
| 最简单 | 动态功能弱 |
| 性能最佳 | 交互受限 |

**建议**：先 Phase 5 用 Next.js + MDX，**主要是为了 i18n + ISR + MDX 的灵活性**。

---

## 9. 关键功能清单

### 9.1 必做

- [ ] 人物列表页（Tier A/B/C 分类）
- [ ] 人物详情页（4 个 markdown → 1 个页面）
- [ ] 家族分类页（贾氏/王氏/史氏/薛氏/林氏/外部）
- [ ] 中英切换
- [ ] 搜索（按名字、判词、回目、判词关键词）
- [ ] 时间线（120 回）
- [ ] 章回索引
- [ ] 术语表（Glossary）
- [ ] 判词 / 诗词全索引
- [ ] 引用规范 / 关于页

### 9.2 应做

- [ ] 关系图谱（可视化）
- [ ] 族谱（贾府五代）
- [ ] 每章末"主要事件时间线"
- [ ] Hawkes / Minford 译文章节检索
- [ ] 脂批检索
- [ ] 考据笔记
- [ ] 图片（古风人物像，由 minimax 生成）

### 9.3 可选

- [ ] 音频（诗词朗读）
- [ ] 视频（戏曲改编片段）
- [ ] 用户贡献
- [ ] 评论
- [ ] 多语言扩展（法、德、日）

---

## 10. 视觉设计

### 10.1 风格定位

- **古风 + 极简**：参考宋代画谱 / 文人画
- **米色/象牙色背景**：暗合宣纸
- **衬线中文 + 衬线英文**：宋体 + Garamond/Caslon
- **章节引文用楷体**

### 10.2 配色

| 用途 | 颜色 |
|------|------|
| 主色 | 黛色（深青） `#3A4A5C` |
| 辅色 | 朱砂红 `#A93226` |
| 背景 | 宣纸米 `#F4ECD8` |
| 链接 | 黛色 `#3A4A5C` 下划线 |
| 引文块 | 浅灰 `#F0EFE9` |

### 10.3 字体

- **中文**：
  - 正文：思源宋体（Source Han Serif）/ 霞鹜文楷
  - 引文：楷体（KaiTi）/ 霞鹜文楷
- **英文**：
  - 正文：Source Serif / EB Garamond / Crimson Text
  - 引文：同正文
- **代码（如有）**：JetBrains Mono / Fira Code

---

## 11. SEO 与可访问性

- **Open Graph**：每页有 og:image、og:title、og:description
- **JSON-LD**：人物页用 `schema.org/Person`
- **sitemap**：自动生成
- **a11y**：键盘导航、对比度、alt 文字

---

## 12. 部署与运维

### 12.1 Vercel

- 仓库：GitHub
- 自动部署：push to main
- 预览：每个 PR 一个 URL
- 自定义域名：`hlm.wiki`（待定）

### 12.2 备份

- 内容：Git 仓库即备份
- 图片：Vercel Blob 或 Cloudflare R2

---

最后更新：2026-07-20

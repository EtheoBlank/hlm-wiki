// 红楼梦人物维基 · Supabase 数据导入脚本
// 用法: node scripts/import-to-supabase.mjs
//
// 需要环境变量:
//   SUPABASE_URL=https://<project>.supabase.co
//   SUPABASE_SERVICE_KEY=<service_role key>
//
// 读取 content/ 下所有 profile.md / story.md / quotes.md / relationships.md
// 批量插入 Supabase

import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { createClient } from '@supabase/supabase-js'

const ROOT = path.join(process.cwd(), '..', 'content')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// 提取 name_zh / name_en from profile.md
function extractNames(content) {
  // 第一行: # 贾宝玉 / Jia Baoyu
  const m = content.match(/^#\s+([^\/\n]+?)\s*\/\s*([^\n]+)/m)
  if (m) {
    const zh = m[1].trim()
    const enMatch = m[2].trim().match(/^([A-Za-z\s\.\-]+)/)
    const en = enMatch ? enMatch[1].trim() : zh
    return { zh, en }
  }
  const h1 = content.match(/^#\s+([^\n]+)/m)
  if (h1) return { zh: h1[1].trim(), en: h1[1].trim() }
  return { zh: 'Unknown', en: 'Unknown' }
}

function extractAliases(content) {
  const m = content.match(/\*\*\[别称\]\*\*\s*([^\n]+)/)
  if (!m) return []
  return m[1].split(/[、，,]/).map((s) => s.trim()).filter(Boolean)
}

function extractFamily(slug) {
  // 从路径提取: jia-family/jia-baoyu → jia-family
  return slug.split(/[\\/]/)[0]
}

function extractTier(hasFullContent) {
  return hasFullContent ? 'B' : 'C' // 简化判断
}

function extractExcerpt(content, lang, max = 200) {
  const lines = content.split('\n').filter((l) => l.trim() && !l.startsWith('#') && !l.startsWith('|'))
  const target = lang === 'zh' ? /[\u4e00-\u9fff]/ : /[a-zA-Z]/
  const line = lines.find((l) => target.test(l))
  return line ? line.slice(0, max) : ''
}

async function getAllMarkdownFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    if (entry.name.startsWith('_')) continue
    if (entry.name === 'jia-temple') continue // 妙玉特殊处理
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...(await getAllMarkdownFiles(full)))
    }
  }
  return files
}

async function readFileOrNull(path) {
  try {
    return await fs.readFile(path, 'utf8')
  } catch {
    return null
  }
}

async function importCharacter(family, slug) {
  const profilePath = path.join(ROOT, family, slug, 'profile.md')
  const storyPath = path.join(ROOT, family, slug, 'story.md')
  const quotesPath = path.join(ROOT, family, slug, 'quotes.md')
  const relPath = path.join(ROOT, family, slug, 'relationships.md')

  const profileRaw = await readFileOrNull(profilePath)
  if (!profileRaw) return null

  const profile = matter(profileRaw).content
  const story = (await readFileOrNull(storyPath)) || null
  const quotes = (await readFileOrNull(quotesPath)) || null
  const relationships = (await readFileOrNull(relPath)) || null

  const { zh: name_zh, en: name_en } = extractNames(profileRaw)
  const aliases = extractAliases(profileRaw)
  const hasFullContent = !!story
  const tier = hasFullContent && family === 'jia-family' && aliases.length > 0
    ? 'A'
    : hasFullContent
      ? 'B'
      : 'C'

  const id = `${family}/${slug}`

  // 1. 插入 characters
  const { error: charErr } = await supabase.from('characters').upsert({
    id,
    family,
    slug,
    name_zh,
    name_en,
    aliases,
    tier,
    has_full_content: hasFullContent,
    excerpt_zh: extractExcerpt(profile, 'zh'),
    excerpt_en: extractExcerpt(profile, 'en'),
  })

  if (charErr) {
    console.error(`Character ${id} insert failed:`, charErr.message)
    return null
  }

  // 2. 插入 character_content（profile, story, quotes, relationships）
  const contents = [
    { type: 'profile', zh: profile, en: profile },
    { type: 'story', zh: story, en: story },
    { type: 'quotes', zh: quotes, en: quotes },
    { type: 'relationships', zh: relationships, en: relationships },
  ].filter((c) => c.zh)

  for (const c of contents) {
    if (!c.zh) continue
    const { error: cErr } = await supabase.from('character_content').upsert({
      character_id: id,
      content_type: c.type,
      content_zh: c.zh,
      content_en: c.en,
    })
    if (cErr) {
      console.error(`Content ${id}/${c.type} insert failed:`, cErr.message)
    }
  }

  return { id, name_zh, tier }
}

async function main() {
  console.log('🚀 Importing 红楼梦 wiki content to Supabase...')
  console.log(`Source: ${ROOT}`)
  console.log(`Target: ${SUPABASE_URL}`)

  const families = await fs.readdir(ROOT, { withFileTypes: true })
  const charDirs = []
  for (const fam of families) {
    if (!fam.isDirectory() || fam.name.startsWith('_')) continue
    const familyPath = path.join(ROOT, fam.name)
    const chars = await fs.readdir(familyPath, { withFileTypes: true })
    for (const ch of chars) {
      if (ch.isDirectory()) {
        charDirs.push({ family: fam.name, slug: ch.name })
      }
    }
  }

  console.log(`Found ${charDirs.length} characters`)

  let success = 0
  let fail = 0
  for (const { family, slug } of charDirs) {
    try {
      const r = await importCharacter(family, slug)
      if (r) {
        success++
        if (success % 20 === 0) {
          console.log(`  ✓ ${success}/${charDirs.length} (${r.tier}: ${r.name_zh})`)
        }
      } else {
        fail++
      }
    } catch (e) {
      console.error(`  ✗ ${family}/${slug}: ${e.message}`)
      fail++
    }
  }

  console.log(`\nDone: ${success} success, ${fail} fail`)
}

main().catch(console.error)
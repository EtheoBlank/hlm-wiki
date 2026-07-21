import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const CONTENT_DIR = path.join(process.cwd(), '..', 'content')

export interface CharacterProfile {
  id: string            // e.g. "jia-family/jia-baoyu"
  family: string        // e.g. "jia-family"
  slug: string          // e.g. "jia-baoyu"
  title: string
  title_en: string
  aliases: string[]
  tier: 'A' | 'B' | 'C'
  hasFullContent: boolean
  excerpt: string
  excerpt_en: string
}

export interface CharacterFull {
  meta: CharacterProfile
  profile: string        // markdown
  story: string | null
  relationships: string | null
  quotes: string | null
  hasFullContent: boolean
}

const FAMILY_MAP: Record<string, string> = {
  'jia-family': '贾府',
  'lin-family': '林家',
  'wang-family': '王家',
  'xue-family': '薛家',
  'shi-family': '史家',
  'jia-temple': '寺庙',
  'liu-family': '刘家',
  'outsiders': '外部',
}

const FAMILY_EN: Record<string, string> = {
  'jia-family': 'Jia Mansion',
  'lin-family': 'Lin Family',
  'wang-family': 'Wang Family',
  'xue-family': 'Xue Family',
  'shi-family': 'Shi Family',
  'jia-temple': 'Temple',
  'liu-family': 'Liu Family',
  'outsiders': 'Outsiders',
}

function getFamily(family: string): { zh: string; en: string } {
  return { zh: FAMILY_MAP[family] || family, en: FAMILY_EN[family] || family }
}

function extractTitle(content: string, fallback: string): { zh: string; en: string } {
  const zhMatch = content.match(/^#\s+([^/\n]+?)\s*\/\s*([^\n]+)/m)
  if (zhMatch) {
    const parts = zhMatch[2].trim().split(/\s+\/\s+/)
    return { zh: zhMatch[1].trim(), en: parts[1] || zhMatch[1].trim() }
  }
  const h1Match = content.match(/^#\s+([^\n]+)/m)
  if (h1Match) return { zh: h1Match[1].trim(), en: h1Match[1].trim() }
  return { zh: fallback, en: fallback }
}

function extractAliases(content: string): string[] {
  const aliasesMatch = content.match(/\*\*\[别称\]\*\*\s*([^\n]+)/)
  if (!aliasesMatch) return []
  return aliasesMatch[1].split(/[、，,]/).map((s) => s.trim()).filter(Boolean)
}

function extractExcerpt(content: string, max = 200): { zh: string; en: string } {
  const lines = content.split('\n').filter((l) => l.trim() && !l.startsWith('#') && !l.startsWith('|'))
  const zh = lines.find((l) => /[\u4e00-\u9fff]/.test(l))?.slice(0, max) || ''
  const en = lines.find((l) => /[a-zA-Z]/.test(l) && !/^#/.test(l))?.slice(0, max) || ''
  return { zh, en }
}

export function getAllCharacterPaths(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  const result: string[] = []
  const families = fs.readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
  for (const fam of families) {
    const famPath = path.join(CONTENT_DIR, fam.name)
    const chars = fs.readdirSync(famPath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
    for (const ch of chars) {
      const profilePath = path.join(famPath, ch.name, 'profile.md')
      if (fs.existsSync(profilePath)) {
        result.push(path.join(fam.name, ch.name))
      }
    }
  }
  return result
}

export function getAllCharacters(): CharacterProfile[] {
  const paths = getAllCharacterPaths()
  return paths.map((p) => {
    const [family, slug] = p.split(/[\\/]/)
    const profilePath = path.join(CONTENT_DIR, family, slug, 'profile.md')
    const storyPath = path.join(CONTENT_DIR, family, slug, 'story.md')
    const relPath = path.join(CONTENT_DIR, family, slug, 'relationships.md')
    const quotesPath = path.join(CONTENT_DIR, family, slug, 'quotes.md')

    const profileRaw = fs.readFileSync(profilePath, 'utf8')
    const hasFullContent = fs.existsSync(storyPath) && fs.existsSync(relPath) && fs.existsSync(quotesPath)

    const title = extractTitle(profileRaw, slug)
    const aliases = extractAliases(profileRaw)
    const excerpt = extractExcerpt(profileRaw)

    return {
      id: `${family}/${slug}`,
      family,
      slug,
      title: title.zh,
      title_en: title.en,
      aliases,
      tier: family === 'jia-family' && slug.includes('jia-') && hasFullContent && aliases.length > 0
        ? 'A'
        : hasFullContent
        ? 'B'
        : 'C',
      hasFullContent,
      excerpt: excerpt.zh,
      excerpt_en: excerpt.en,
    }
  })
}

export function getCharacter(id: string): CharacterFull | null {
  // Decode URL-encoded path (e.g. "jia-family%2Fjia-baoyu" → "jia-family/jia-baoyu")
  const decoded = decodeURIComponent(id)
  const parts = decoded.split('/')
  if (parts.length < 2) return null
  const family = parts[0]
  const slug = parts.slice(1).join('/')

  const profilePath = path.join(CONTENT_DIR, family, slug, 'profile.md')
  const storyPath = path.join(CONTENT_DIR, family, slug, 'story.md')
  const relPath = path.join(CONTENT_DIR, family, slug, 'relationships.md')
  const quotesPath = path.join(CONTENT_DIR, family, slug, 'quotes.md')

  if (!fs.existsSync(profilePath)) return null

  const profileRaw = fs.readFileSync(profilePath, 'utf8')
  const profile = matter(profileRaw).content
  const story = fs.existsSync(storyPath) ? fs.readFileSync(storyPath, 'utf8') : null
  const relationships = fs.existsSync(relPath) ? fs.readFileSync(relPath, 'utf8') : null
  const quotes = fs.existsSync(quotesPath) ? fs.readFileSync(quotesPath, 'utf8') : null

  const title = extractTitle(profileRaw, slug)
  const aliases = extractAliases(profileRaw)

  return {
    meta: {
      id: decoded,
      family,
      slug,
      title: title.zh,
      title_en: title.en,
      aliases,
      tier: 'B',
      hasFullContent: !!story,
      excerpt: extractExcerpt(profileRaw).zh,
      excerpt_en: extractExcerpt(profileRaw).en,
    },
    profile,
    story,
    relationships,
    quotes,
    hasFullContent: !!story,
  }
}

export function getCharactersByFamily(family: string): CharacterProfile[] {
  return getAllCharacters().filter((c) => c.family === family)
}

export function getFamilies(): { id: string; name_zh: string; name_en: string; count: number }[] {
  const paths = getAllCharacterPaths()
  const families = new Set<string>()
  for (const p of paths) families.add(p.split(/[\\/]/)[0])

  return Array.from(families).map((f) => ({
    id: f,
    name_zh: FAMILY_MAP[f] || f,
    name_en: FAMILY_EN[f] || f,
    count: getCharactersByFamily(f).length,
  })).sort((a, b) => b.count - a.count)
}

export function getFamilyLabel(family: string, lang: 'zh' | 'en'): string {
  return lang === 'zh'
    ? (FAMILY_MAP[family] || family)
    : (FAMILY_EN[family] || family)
}

export function getPortraitUrl(id: string): string | null {
  const decoded = decodeURIComponent(id)
  const parts = decoded.split('/')
  if (parts.length < 2) return null
  const family = parts[0]
  const slug = parts.slice(1).join('/')

  const portraitDir = path.join(process.cwd(), '..', 'assets', 'portraits', family, slug)
  if (!fs.existsSync(portraitDir)) return null

  const files = fs.readdirSync(portraitDir).filter((f) => f.endsWith('.jpg'))
  if (files.length === 0) return null

  return `../../assets/portraits/${family}/${slug}/${files[0]}`
}
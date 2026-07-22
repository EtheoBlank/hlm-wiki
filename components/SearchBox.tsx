'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

interface Result {
  result_type: string
  result_id: string
  result_title: string
  result_snippet: string
  result_rank: number
}

export interface LocalCharacter {
  id: string
  title: string
  title_en: string
  aliases: string[]
  excerpt: string
  excerpt_en: string
}

interface Props {
  lang: string
  placeholder?: string
  fallbackCharacters?: LocalCharacter[]
}

function localSearch(query: string, characters: LocalCharacter[], lang: string): Result[] {
  const normalized = query.trim().toLocaleLowerCase()
  return characters
    .filter((character) => {
      const values = [
        character.title,
        character.title_en,
        ...character.aliases,
        character.excerpt,
        character.excerpt_en,
      ]
      return values.some((value) => value.toLocaleLowerCase().includes(normalized))
    })
    .slice(0, 30)
    .map((character, index) => ({
      result_type: lang === 'zh' ? '人物' : 'Character',
      result_id: character.id,
      result_title: lang === 'zh' ? character.title : character.title_en,
      result_snippet: lang === 'zh' ? character.excerpt : character.excerpt_en,
      result_rank: 30 - index,
    }))
}

export function SearchBox(props: Props) {
  return (
    <Suspense fallback={<div className="w-full" />}>
      <SearchBoxInner {...props} />
    </Suspense>
  )
}

function SearchBoxInner({ lang, placeholder, fallbackCharacters = [] }: Props) {
  const searchParams = useSearchParams()
  const initialQ = searchParams.get('q') || ''
  const [q, setQ] = useState(initialQ)
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialQ) handleSearch(initialQ)
  }, [])

  async function handleSearch(query: string) {
    if (!query.trim()) {
      setResults([])
      setError(null)
      return
    }
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setResults(localSearch(query, fallbackCharacters, lang))
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/rpc/search_all_v2?q=${encodeURIComponent(query)}&lim=30`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        }
      )
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data: Result[] = await res.json()
      setResults(data)
    } catch {
      setResults(localSearch(query, fallbackCharacters, lang))
      setError(lang === 'zh' ? '在线搜索暂不可用，已切换到本地人物索引。' : 'Online search is unavailable; the local character index is shown.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') handleSearch(q)
  }

  return (
    <div className="w-full">
      <div className="flex gap-2">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            placeholder || (lang === 'zh' ? '搜索人物、判词、原文…' : 'Search characters, judgements…')
          }
          className="flex-1 px-4 py-3 rounded-lg border-2 border-ink/20 bg-rice-paper focus:border-vermilion outline-none"
        />
        <button
          onClick={() => handleSearch(q)}
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-vermilion text-rice-paper font-bold disabled:opacity-50"
        >
          {lang === 'zh' ? '搜索' : 'Search'}
        </button>
      </div>

      {loading && (
        <p className="mt-2 text-sm opacity-60">
          {lang === 'zh' ? '搜索中…' : 'Searching…'}
        </p>
      )}

      {error && (
        <p className="mt-2 text-sm text-vermilion">{error}</p>
      )}

      {results.length > 0 && (
        <ul className="mt-4 space-y-3">
          {results.map((result, index) => (
            <li
              key={`${result.result_type}-${result.result_id}-${index}`}
              className="bg-mist p-4 rounded-lg hover:shadow-md transition"
            >
              <div className="text-xs opacity-60 uppercase mb-1">
                {result.result_type}
              </div>
              <a
                href={`/${lang}/character/${result.result_id.split('/').slice(0, 2).join('/')}`}
                className="font-bold text-lg hover:underline"
              >
                {result.result_title}
              </a>
              <p className="text-sm opacity-80 mt-1 line-clamp-2">
                {result.result_snippet}
              </p>
            </li>
          ))}
        </ul>
      )}

      {q && !loading && results.length === 0 && !error && (
        <p className="mt-4 text-sm opacity-60">
          {lang === 'zh' ? '无结果' : 'No results'}
        </p>
      )}
    </div>
  )
}

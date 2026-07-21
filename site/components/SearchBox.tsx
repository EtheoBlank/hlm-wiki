'use client'
import { useState } from 'react'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

interface Result {
  result_type: string
  result_id: string
  result_title: string
  result_snippet: string
  result_rank: number
}

interface Props {
  lang: string
  placeholder?: string
}

export function SearchBox({ lang, placeholder }: Props) {
  const [q, setQ] = useState('')
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSearch(query: string) {
    if (!query.trim()) {
      setResults([])
      return
    }
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      setError('Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel env vars.')
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
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handleSearch(q)
    }
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
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {results.length > 0 && (
        <ul className="mt-4 space-y-3">
          {results.map((r, i) => (
            <li
              key={`${r.result_type}-${r.result_id}-${i}`}
              className="bg-mist p-4 rounded-lg hover:shadow-md transition"
            >
              <div className="text-xs opacity-60 uppercase mb-1">
                {r.result_type}
              </div>
              <a
                href={`/${lang}/character/${r.result_id.split('/').slice(0, 2).join('/')}`}
                className="font-bold text-lg hover:underline"
              >
                {r.result_title}
              </a>
              <p className="text-sm opacity-80 mt-1 line-clamp-2">
                {r.result_snippet}
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
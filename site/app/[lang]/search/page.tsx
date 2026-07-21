import { SearchBox } from '@/components/SearchBox'

interface Props {
  params: { lang: string }
}

export function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }]
}

export function generateMetadata() {
  return { title: '搜索 / Search' }
}

export default function SearchPage({ params }: Props) {
  const lang = params.lang
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-kai text-4xl font-bold mb-3">
          {lang === 'zh' ? '搜索' : 'Search'}
        </h1>
        <p className="opacity-70">
          {lang === 'zh'
            ? '全文搜索红楼梦人物、判词、原文、术语（需 Supabase 配置）。'
            : 'Full-text search across characters, judgements, original text, glossary (requires Supabase).'}
        </p>
      </header>

      <SearchBox lang={lang} />
    </div>
  )
}
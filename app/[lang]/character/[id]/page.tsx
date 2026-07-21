import { getCharacter, getAllCharacters, getPortraitUrl } from '@/lib/data'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { markdownToHtml } from '@/lib/markdown'

interface Props {
  params: { lang: string; id: string }
}

export function generateStaticParams() {
  const all = getAllCharacters()
  const params: { lang: string; id: string }[] = []
  for (const c of all) {
    params.push({ lang: 'zh', id: c.id })
    params.push({ lang: 'en', id: c.id })
  }
  return params
}

const familyNameZh: Record<string, string> = {
  'jia-family': '贾府',
  'lin-family': '林家',
  'wang-family': '王家',
  'xue-family': '薛家',
  'shi-family': '史家',
  'jia-temple': '寺庙',
  'liu-family': '刘家',
  'outsiders': '外部',
}

export async function generateMetadata({ params }: Props) {
  const c = getCharacter(params.id)
  if (!c) return { title: 'Not found' }
  return {
    title: params.lang === 'zh' ? c.meta.title : c.meta.title_en,
    description: c.meta.excerpt || c.meta.excerpt_en,
  }
}

export default async function CharacterPage({ params }: Props) {
  const c = getCharacter(params.id)
  if (!c) notFound()

  const lang = params.lang
  const profileHtml = await markdownToHtml(c.profile)

  const portrait = getPortraitUrl(params.id)

  return (
    <article className="space-y-8">
      {/* Header */}
      <header className="border-b border-ink/20 pb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {portrait && (
            <img
              src={portrait}
              alt={lang === 'zh' ? c.meta.title : c.meta.title_en}
              className="w-48 h-auto rounded-lg shadow-md"
            />
          )}
          <div className="flex-1">
            <p className="text-sm opacity-60 mb-1">
              <Link href={`/${lang}/character`} className="hover:underline">
                {lang === 'zh' ? '人物' : 'Characters'}
              </Link>
              {' · '}
              {familyNameZh[c.meta.family] || c.meta.family}
            </p>
            <h1 className="font-kai text-4xl font-bold mb-2">
              {lang === 'zh' ? c.meta.title : c.meta.title_en}
            </h1>
            {c.meta.aliases.length > 0 && (
              <p className="text-lg opacity-70 mb-3">
                {c.meta.aliases.join(' · ')}
              </p>
            )}
            {c.meta.excerpt && (
              <p className="prose-judgement text-sm italic">
                {lang === 'zh' ? c.meta.excerpt : c.meta.excerpt_en}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Profile */}
      <section
        className="prose-quote prose max-w-none"
        dangerouslySetInnerHTML={{ __html: profileHtml }}
      />

      {/* Story (if exists) */}
      {c.story && (
        <section>
          <h2 className="text-2xl font-bold mb-4 font-kai border-b border-ink/20 pb-2">
            {lang === 'zh' ? '故事时间线' : 'Story Timeline'}
          </h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: await markdownToHtml(c.story) }}
          />
        </section>
      )}

      {/* Quotes (if exists) */}
      {c.quotes && (
        <section>
          <h2 className="text-2xl font-bold mb-4 font-kai border-b border-ink/20 pb-2">
            {lang === 'zh' ? '原文与译文' : 'Original & Translation'}
          </h2>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: await markdownToHtml(c.quotes) }}
          />
        </section>
      )}

      {!c.hasFullContent && (
        <div className="bg-mist p-6 rounded-lg text-center text-sm opacity-70">
          {lang === 'zh'
            ? '此人物仅有极简 profile（基本信息）。'
            : 'Brief profile only (basic information).'}
        </div>
      )}

      <footer className="text-center text-sm opacity-60 pt-8 border-t border-ink/20">
        <Link href={`/${lang}/character`} className="hover:underline">
          ← {lang === 'zh' ? '返回人物列表' : 'Back to Characters'}
        </Link>
      </footer>
    </article>
  )
}
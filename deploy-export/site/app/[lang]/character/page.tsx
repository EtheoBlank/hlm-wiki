import { getAllCharacters, getFamilies } from '@/lib/data'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: { lang: string }
}

export function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }]
}

export const metadata: Metadata = {
  title: '人物 · Characters',
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

const familyNameEn: Record<string, string> = {
  'jia-family': 'Jia Mansion',
  'lin-family': 'Lin Family',
  'wang-family': 'Wang Family',
  'xue-family': 'Xue Family',
  'shi-family': 'Shi Family',
  'jia-temple': 'Temple',
  'liu-family': 'Liu Family',
  'outsiders': 'Outsiders',
}

const tierColors: Record<string, string> = {
  A: 'bg-vermilion text-rice-paper',
  B: 'bg-ink text-rice-paper',
  C: 'bg-mist text-ink border border-ink/30',
}

export default function CharacterListPage({ params }: Props) {
  const lang = params.lang
  const all = getAllCharacters()
  const families = getFamilies()

  const grouped = families.map((f) => ({
    ...f,
    members: all
      .filter((c) => c.family === f.id)
      .sort((a, b) => a.title.localeCompare(b.title)),
  }))

  return (
    <div className="space-y-10">
      <header className="text-center">
        <h1 className="font-kai text-4xl font-bold mb-3">
          {lang === 'zh' ? '人物' : 'Characters'}
        </h1>
        <p className="opacity-70">
          {lang === 'zh' ? `共 ${all.length} 个有名有姓人物` : `${all.length} named characters`}
        </p>
      </header>

      {grouped.map((family) => (
        <section key={family.id}>
          <h2 className="text-2xl font-bold mb-4 border-b border-ink/20 pb-2 font-kai">
            {lang === 'zh' ? familyNameZh[family.id] || family.name_zh : familyNameEn[family.id] || family.name_en}
            <span className="ml-3 text-base font-normal opacity-60">
              ({family.count})
            </span>
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {family.members.map((c) => (
              <Link
                key={c.id}
                href={`/${lang}/character/${c.id}`}
                className={`p-3 rounded-lg hover:shadow-lg transition flex flex-col gap-1 ${tierColors[c.tier] || tierColors.C}`}
              >
                <span className="font-bold">
                  {lang === 'zh' ? c.title : c.title_en}
                </span>
                {c.aliases.length > 0 && (
                  <span className="text-xs opacity-70">
                    {c.aliases.slice(0, 2).join(' · ')}
                  </span>
                )}
                {!c.hasFullContent && (
                  <span className="text-xs opacity-60 italic">
                    {lang === 'zh' ? '极简' : 'brief'}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
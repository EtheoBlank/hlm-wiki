import { TopNav } from '@/components/TopNav'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: { lang: string }
}

// Required for static export of dynamic segment
export function generateStaticParams() {
  return [{ lang: 'zh' }, { lang: 'en' }]
}

// D.3 Open Graph metadata
export function generateMetadata({ params }: Props): Metadata {
  const lang = params.lang
  const titleZh = '红楼梦人物维基 · Dream of the Red Chamber Wiki'
  const titleEn = 'Hong Lou Meng Wiki · Dream of the Red Chamber'
  return {
    title: isZh(lang) ? titleZh : titleEn,
    openGraph: {
      title: isZh(lang) ? titleZh : titleEn,
      description: isZh(lang)
        ? '全书人物中英对照维基，忠于程乙本与脂批异文'
        : 'Full character index (zh/en) based on the Cheng–Yu edition + Zhiyanzhai commentary',
      url: `https://hlm-wiki.vercel.app/${lang}/`,
      type: 'website',
    }
  }
}

const isZh = (lang: string) => lang === 'zh'

const translations = {
  zh: {
    title: '红楼梦人物维基',
    subtitle: '中英对照 · 严格忠于程乙本与脂批异文',
    intro: '本维基覆盖 498 个有名有姓的红楼梦人物，按家族、身份、戏份分级整理。',
    stats: {
      characters: '已收录人物',
      tierA: '金陵十二钗（完整）',
      tierB: '重要配角（完整）',
      tierC: '次要人物（极简）',
    },
    explore: {
      characters: '浏览人物',
      timeline: '时间线',
      glossary: '术语表',
      families: '按家族浏览',
    },
    tierABook: {
      title: 'Tier A — 金陵十二钗正册（18 完整）',
      desc: '含完整 4 文件 + 古风人物像 + 判词原文 + Hawkes 英译',
    },
    tierBBook: {
      title: 'Tier B — 重要配角（95 完整）',
      desc: '贾府长辈、丫鬟婆子、外部人物等，含完整 4 文件 + 古风人物像',
    },
    tierCBook: {
      title: 'Tier C — 次要人物（91 极简）',
      desc: '极简 profile（仅有基本信息表 + [待校] 标注）',
    },
  },
  en: {
    title: 'Hong Lou Meng Wiki',
    subtitle: 'A bilingual character encyclopedia of Dream of the Red Chamber',
    intro: 'This wiki covers 498 named characters from the novel, organized by family, role, and significance.',
    stats: {
      characters: 'Characters',
      tierA: 'Jia Lin 12 Beauties (Full)',
      tierB: 'Major Roles (Full)',
      tierC: 'Minor Roles (Brief)',
    },
    explore: {
      characters: 'Browse Characters',
      timeline: 'Timeline',
      glossary: 'Glossary',
      families: 'Browse by Family',
    },
    tierABook: {
      title: 'Tier A — The Twelve Beauties of Jinling (18 complete)',
      desc: 'Full 4 files + AI-generated period portraits + Hawkes translations',
    },
    tierBBook: {
      title: 'Tier B — Major Supporting Cast (95 complete)',
      desc: 'Family elders, maids, and outside figures. Full 4 files + portraits.',
    },
    tierCBook: {
      title: 'Tier C — Minor Characters (91 brief)',
      desc: 'Brief profiles (basic info only, marked [待校])',
    },
  },
}

export default function HomePage({ params }: Props) {
  const lang = params.lang || 'zh'
  const t = translations[lang as keyof typeof translations] || translations.zh

  return (
    <div className="space-y-12">
      <section className="text-center py-12">
        <h1 className="font-kai text-5xl font-bold mb-4 text-ink">{t.title}</h1>
        <p className="text-xl opacity-80 mb-2">{t.subtitle}</p>
        <p className="text-base opacity-70 max-w-2xl mx-auto">{t.intro}</p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-mist p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-vermilion">204</div>
          <div className="text-sm opacity-70 mt-2">{t.stats.characters}</div>
        </div>
        <div className="bg-mist p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-vermilion">18</div>
          <div className="text-sm opacity-70 mt-2">{t.stats.tierA}</div>
        </div>
        <div className="bg-mist p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-vermilion">95</div>
          <div className="text-sm opacity-70 mt-2">{t.stats.tierB}</div>
        </div>
        <div className="bg-mist p-6 rounded-lg text-center">
          <div className="text-3xl font-bold text-vermilion">91</div>
          <div className="text-sm opacity-70 mt-2">{t.stats.tierC}</div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6 font-kai">{t.explore.characters}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href={`/${lang}/character`} className="block bg-mist p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="font-bold text-lg mb-2">{t.tierABook.title}</h3>
            <p className="text-sm opacity-80">{t.tierABook.desc}</p>
          </Link>
          <Link href={`/${lang}/character`} className="block bg-mist p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="font-bold text-lg mb-2">{t.tierBBook.title}</h3>
            <p className="text-sm opacity-80">{t.tierBBook.desc}</p>
          </Link>
          <Link href={`/${lang}/character`} className="block bg-mist p-6 rounded-lg hover:shadow-lg transition">
            <h3 className="font-bold text-lg mb-2">{t.tierCBook.title}</h3>
            <p className="text-sm opacity-80">{t.tierCBook.desc}</p>
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <Link href={`/${lang}/timeline`} className="block bg-mist p-6 rounded-lg hover:shadow-lg transition text-center">
          <div className="text-2xl mb-2">📅</div>
          <h3 className="font-bold text-lg">{t.explore.timeline}</h3>
        </Link>
        <Link href={`/${lang}/glossary`} className="block bg-mist p-6 rounded-lg hover:shadow-lg transition text-center">
          <div className="text-2xl mb-2">📖</div>
          <h3 className="font-bold text-lg">{t.explore.glossary}</h3>
        </Link>
      </section>

      <section className="bg-mist p-8 rounded-lg text-center">
        <h2 className="font-bold text-lg mb-2">
          {isZh(lang) ? '资料源' : 'Source Materials'}
        </h2>
        <p className="text-sm opacity-80">
          {isZh(lang)
            ? '程乙本（俞平伯校注人文社本）· 庚辰本 · 甲戌本 · 戚序本 · Hawkes《The Story of the Stone》（Penguin, 1973–1986）· 欧丽娟 / 王蒙 / 白先勇'
            : 'Chengyi edition (Yuan-Pingbo annotated) · Gengjin / Jiaxu / Qixu · Hawkes \'The Story of the Stone\' (Penguin, 1973–1986) · Ou Lijuan / Wang Meng / Bai Xianyong'}
        </p>
      </section>
    </div>
  )
}
'use client'
import Link from 'next/link'
import { useState } from 'react'

interface Props {
  lang: string
}

export function TopNav({ lang }: Props) {
  const [open, setOpen] = useState(false)
  const isZh = lang === 'zh'

  const navItems = [
    { href: `/${lang}`, label: isZh ? '首页' : 'Home' },
    { href: `/${lang}/character`, label: isZh ? '人物' : 'Characters' },
    { href: `/${lang}/search`, label: isZh ? '搜索' : 'Search' },
    { href: `/${lang}/family/jia-family`, label: isZh ? '家族' : 'Families' },
    { href: `/${lang}/timeline`, label: isZh ? '时间线' : 'Timeline' },
    { href: `/${lang}/glossary`, label: isZh ? '术语表' : 'Glossary' },
  ]

  const otherLang = isZh ? 'en' : 'zh'

  return (
    <nav className="border-b border-ink/20 bg-rice-paper sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={`/${lang}`} className="font-kai text-xl font-bold">
          {isZh ? '红楼梦人物维基' : 'Hong Lou Meng Wiki'}
        </Link>

        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-2xl"
          aria-label="Toggle menu"
        >
          ☰
        </button>

        <div className={`${open ? 'block' : 'hidden'} md:flex md:gap-6 absolute md:static top-full left-0 right-0 bg-rice-paper md:bg-transparent shadow-md md:shadow-none p-4 md:p-0`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block md:inline-block py-1 md:py-0"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={navItems[0].href.replace(`/${lang}`, `/${otherLang}`)}
            className="block md:inline-block py-1 md:py-0 ml-0 md:ml-4 opacity-70 hover:opacity-100"
            title={isZh ? 'Switch to English' : '切换到中文'}
          >
            {isZh ? 'EN' : '中'}
          </Link>
        </div>
      </div>
    </nav>
  )
}
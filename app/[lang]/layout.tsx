import { TopNav } from '@/components/TopNav'

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang: string }
}) {
  const lang = params.lang
  return (
    <html lang={lang}>
      <body className="min-h-screen">
        <TopNav lang={lang} />
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
        <footer className="mt-16 py-8 border-t border-ink/20 text-center text-sm opacity-70">
          {lang === 'zh' ? (
            <>
              红楼梦人物维基 · 基于程乙本（俞平伯校注人文社本）+ 脂批异文 · Hawkes 精修英译 ·{' '}
              <a href="https://github.com/EtheoBlank/hlm-wiki" target="_blank" rel="noreferrer">
                GitHub
              </a>{' · '}
              <a className="back-hub" href="https://learning-hub-seven-red.vercel.app" title="回到学习总站">← 总站</a>
            </>
          ) : (
            <>
              Hong Lou Meng Wiki · based on the Cheng–Yu edition (Yu Pingbo, People&apos;s Literature) + Zhiyanzhai commentary · Hawkes&apos; polished English translation ·{' '}
              <a href="https://github.com/EtheoBlank/hlm-wiki" target="_blank" rel="noreferrer">
                GitHub
              </a>{' · '}
              <a className="back-hub" href="https://learning-hub-seven-red.vercel.app" title="Back to hub">← Hub</a>
            </>
          )}
        </footer>
      </body>
    </html>
  )
}
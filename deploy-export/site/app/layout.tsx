import './globals.css'
import type { Metadata } from 'next'
import { TopNav } from '@/components/TopNav'

export const metadata: Metadata = {
  title: '红楼梦人物维基 · Dream of the Red Chamber Wiki',
  description: '红楼梦全书人物维基 · 中英对照 · 严格忠于程乙本与脂批异文',
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { lang?: string }
}) {
  const lang = params?.lang || 'zh'
  return (
    <html lang={lang}>
      <body className="min-h-screen">
        <TopNav lang={lang} />
        <main className="max-w-5xl mx-auto px-4 py-8">
          {children}
        </main>
        <footer className="mt-16 py-8 border-t border-ink/20 text-center text-sm opacity-70">
          红楼梦人物维基 · 基于程乙本（俞平伯校注人文社本）+ 脂批异文 · Hawkes 精修英译 ·{' '}
          <a href="https://github.com/anomalyco/hlm-wiki" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </footer>
      </body>
    </html>
  )
}
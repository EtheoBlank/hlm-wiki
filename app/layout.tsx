import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '红楼梦人物维基 · Dream of the Red Chamber Wiki',
  description: '红楼梦全书人物维基 · 中英对照 · 严格忠于程乙本与脂批异文',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className="min-h-screen">{children}</body>
    </html>
  )
}
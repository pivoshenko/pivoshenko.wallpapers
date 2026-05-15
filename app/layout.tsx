import { Footer } from '@/components/footer'
import { Nav } from '@/components/nav'
import { Analytics } from '@vercel/analytics/next'
import { JetBrains_Mono } from 'next/font/google'
import { ScrollToTop } from 'pivoshenko.ui'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s — Wallpapers',
    default: 'Wallpapers',
  },
  description: 'Personal wallpaper collection by Volodymyr Pivoshenko.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={jetbrainsMono.variable}
    >
      <body className="bg-stone-50 text-stone-900 dark:bg-black dark:text-stone-100 font-mono antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen flex flex-col">
            <Nav />
            <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6">
              {children}
            </main>
            <Footer />
          </div>
          <ScrollToTop />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

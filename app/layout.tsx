import { Analytics } from '@vercel/analytics/next'
import { JetBrains_Mono } from 'next/font/google'
import { PageShell } from 'pivoshenko.ui'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})
import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://wallpapers.pivoshenko.dev'),
  title: {
    template: '%s — Wallpapers',
    default: 'Wallpapers — pivoshenko.dev',
  },
  description: 'Personal wallpaper collection by Volodymyr Pivoshenko.',
  openGraph: {
    type: 'website',
    url: 'https://wallpapers.pivoshenko.dev',
    siteName: 'pivoshenko.wallpapers',
    title: 'Wallpapers — pivoshenko.dev',
    description: 'Personal wallpaper collection by Volodymyr Pivoshenko.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wallpapers — pivoshenko.dev',
    description: 'Personal wallpaper collection by Volodymyr Pivoshenko.',
  },
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
          <PageShell brand="pivoshenko.wallpapers">{children}</PageShell>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}

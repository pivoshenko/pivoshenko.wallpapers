import { SpeedInsights } from '@vercel/speed-insights/next'
import {
  SiteLayout,
  siteMetadata,
  siteViewport,
} from 'pivoshenko.ui/next/site-layout'
import './globals.css'

export const metadata = {
  ...siteMetadata({
    url: 'https://wallpapers.pivoshenko.dev',
    brand: 'pivoshenko.wallpapers',
    title: 'Wallpapers — pivoshenko.dev',
    titleTemplate: '%s — Wallpapers',
    description: 'Curated collection of wallpapers',
    ogTitle: 'Wallpapers',
  }),
}

export const viewport = siteViewport

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SiteLayout brand="pivoshenko.wallpapers" afterShell={<SpeedInsights />}>
      {children}
    </SiteLayout>
  )
}

import { createOgImage } from 'pivoshenko.ui/next/opengraph-image'

export const alt = 'pivoshenko.wallpapers'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const runtime = 'edge'

export default createOgImage({
  brand: 'pivoshenko.wallpapers',
  title: 'Wallpapers',
  subtitle: 'Curated collection of wallpapers',
  domain: 'wallpapers.pivoshenko.dev',
})

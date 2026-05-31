import {
  createOgImage,
  ogContentType,
  ogRuntime,
  ogSize,
} from 'pivoshenko.ui/next/opengraph-image'

export const alt = 'pivoshenko.wallpapers'
export const size = ogSize
export const contentType = ogContentType
export const runtime = ogRuntime

export default createOgImage({
  brand: 'pivoshenko.wallpapers',
  title: 'Wallpapers',
  subtitle: 'Curated collection of wallpapers',
  domain: 'wallpapers.pivoshenko.dev',
})

import type { MetadataRoute } from 'next'

const url = 'https://wallpapers.pivoshenko.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: url,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}

import type { MetadataRoute } from 'next'

const url = 'https://wallpapers.pivoshenko.dev'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    {
      url: url,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]
}

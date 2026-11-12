import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { imageSizeFromFile } from 'image-size/fromFile'

export type Wallpaper = {
  filename: string
  path: string
  size: string
  width: number
  height: number
  name: string
  tags: string[]
}

const wallpapersDir = join(process.cwd(), 'public/wallpapers')

export function parseFilename(filename: string) {
  const [namePart = '', ...tagsArray] = filename.split('.')[0].split('_')
  const tags = tagsArray.filter(Boolean)
  const name = namePart
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

  return { name, tags }
}

export async function getWallpapers(): Promise<Wallpaper[]> {
  const filenames = readdirSync(wallpapersDir)
    .filter((item) => !item.startsWith('.'))
    .sort((a, b) => a.localeCompare(b))

  return Promise.all(
    filenames.map(async (filename) => {
      const filePath = join(wallpapersDir, filename)
      const bytes = statSync(filePath).size

      // a file with an unreadable header still lists, just without dimensions
      const { width = 0, height = 0 } = await imageSizeFromFile(filePath).catch(
        () => ({ width: 0, height: 0 }),
      )

      return {
        filename,
        path: filename,
        size: (bytes / (1024 * 1024)).toFixed(2),
        width,
        height,
        ...parseFilename(filename),
      }
    }),
  )
}

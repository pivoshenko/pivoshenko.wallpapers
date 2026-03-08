const {
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} = require('node:fs')
const { extname, join, relative } = require('node:path')
const { imageSize } = require('image-size')

const wallpapersDir = './public/wallpapers'
const outputFile = './public/files.json'
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp'])

function getFiles(dir, baseDir = dir) {
  let allFiles = []

  const items = readdirSync(dir)
    .filter((item) => !item.startsWith('.'))
    .sort((a, b) => a.localeCompare(b))

  for (const item of items) {
    const itemPath = join(dir, item)
    const stats = statSync(itemPath)

    if (stats.isDirectory()) {
      allFiles = allFiles.concat(getFiles(itemPath, baseDir))
      continue
    }

    const fileSizeMb = (stats.size / (1024 * 1024)).toFixed(2)
    const fileExt = extname(item).toLowerCase()
    const relativePath = relative(baseDir, itemPath).replaceAll('\\', '/')

    let dimensions = { width: 0, height: 0 }
    if (imageExtensions.has(fileExt)) {
      try {
        dimensions = imageSize(readFileSync(itemPath))
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'unknown dimension error'
        console.warn(
          `Could not read dimensions for ${relativePath}: ${message}`,
        )
      }
    }

    allFiles.push({
      filename: item,
      path: relativePath,
      size: fileSizeMb,
      width: dimensions.width ?? 0,
      height: dimensions.height ?? 0,
    })
  }

  return allFiles
}

const files = getFiles(wallpapersDir)
writeFileSync(outputFile, JSON.stringify(files, null, 2))
console.log(`Generated ${files.length} entries in ${outputFile}`)

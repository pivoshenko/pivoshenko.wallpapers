'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

type FileRecord = {
  filename: string
  path: string
  size: string
  width: number
  height: number
}

type Wallpaper = FileRecord & {
  name: string
  tags: string[]
}

const owner = 'pivoshenko'
const repository = 'wallpapers'
const repositoryPath = 'public/wallpapers'

function parseFilename(filename: string) {
  const [namePart = '', ...tagsArray] = filename.split('.')[0].split('_')
  const tags = tagsArray.filter(Boolean)
  const name = namePart
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

  return { name, tags }
}

function toRawDownloadUrl(filePath: string) {
  return `https://raw.githubusercontent.com/${owner}/${repository}/main/${repositoryPath}/${filePath}`
}

function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 12 }, (_, item) => item + 1).map((item) => (
        <div
          key={`loading-${item}`}
          className="overflow-hidden rounded-xl border border-faint bg-white dark:bg-stone-900"
        >
          <div className="aspect-[16/9] animate-pulse bg-stone-200 dark:bg-stone-800" />
          <div className="space-y-2 p-4">
            <div className="h-4 w-2/3 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
            <div className="h-3 w-1/3 animate-pulse rounded bg-stone-200 dark:bg-stone-800" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function WallpaperBrowser() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [active, setActive] = useState<Wallpaper | null>(null)
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>(
    'idle',
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch('/files.json')
        const files: FileRecord[] = await response.json()
        setWallpapers(
          files.map((file) => {
            const parsed = parseFilename(file.filename)
            return {
              ...file,
              name: parsed.name,
              tags: parsed.tags,
            }
          }),
        )
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [])

  const tags = useMemo(
    () =>
      [...new Set(wallpapers.flatMap((wallpaper) => wallpaper.tags))].sort(
        (a, b) => a.localeCompare(b),
      ),
    [wallpapers],
  )

  const filtered = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase()

    return wallpapers.filter((wallpaper) => {
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => wallpaper.tags.includes(tag))
      const matchesSearch =
        normalizedSearch.length === 0 ||
        wallpaper.name.toLowerCase().includes(normalizedSearch)

      return matchesTags && matchesSearch
    })
  }, [search, selectedTags, wallpapers])

  const hasFilters = search.trim().length > 0 || selectedTags.length > 0

  const onToggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter((value) => value !== tag)
        : [...current, tag],
    )
  }

  const onClearFilters = () => {
    setSearch('')
    setSelectedTags([])
  }

  const onCopyNix = async (wallpaper: Wallpaper) => {
    const snippet = `image = pkgs.fetchurl {\n  url = "${toRawDownloadUrl(wallpaper.path)}";\n  sha256 = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";\n};`

    try {
      await navigator.clipboard.writeText(snippet)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }

    setTimeout(() => setCopyState('idle'), 1800)
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4 border-b border-ui pb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search wallpapers..."
              className="w-full rounded-md border border-ui bg-white px-3 py-2 type-ui fg-primary placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-400 dark:bg-stone-900"
            />
          </div>
          <p className="type-meta fg-muted">
            {filtered.length} / {wallpapers.length} wallpapers
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const activeTag = selectedTags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                onClick={() => onToggleTag(tag)}
                className={`type-meta px-2 py-1 rounded border transition-colors ${
                  activeTag
                    ? 'border-stone-400 text-stone-800 dark:text-stone-200 bg-stone-200 dark:bg-stone-800'
                    : 'border-ui fg-muted hover-secondary'
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="type-meta fg-muted hover-secondary transition-colors"
          >
            Clear filters
          </button>
        )}
      </section>

      {isLoading ? (
        <LoadingGrid />
      ) : (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((wallpaper) => (
            <article
              key={wallpaper.path}
              className="group overflow-hidden rounded-xl border border-faint bg-white dark:bg-stone-900"
            >
              <div className="relative aspect-[16/9] overflow-hidden border-b border-faint">
                <Image
                  src={`/wallpapers/${wallpaper.path}`}
                  alt={`${wallpaper.name} wallpaper`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="type-ui fg-title">{wallpaper.name}</h2>
                  <button
                    type="button"
                    className="type-meta fg-muted hover-secondary"
                    onClick={() => {
                      setActive(wallpaper)
                      setCopyState('idle')
                    }}
                  >
                    details
                  </button>
                </div>

                <div className="flex flex-wrap gap-1">
                  {wallpaper.tags.slice(0, 3).map((tag) => (
                    <span
                      key={`${wallpaper.path}-${tag}`}
                      className="type-meta px-2 py-0.5 rounded border border-ui fg-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between type-meta fg-muted">
                  <span>
                    {wallpaper.width}×{wallpaper.height}
                  </span>
                  <span>{wallpaper.size} MB</span>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) {
              setActive(null)
            }
          }}
        >
          <div
            className="mx-auto mt-8 max-w-3xl rounded-xl border border-ui bg-stone-50 p-6 dark:bg-stone-950"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="type-heading fg-primary">{active.name}</h3>
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="type-meta fg-muted hover-secondary"
                >
                  close
                </button>
              </div>

              <div className="relative aspect-[16/9] overflow-hidden rounded-lg border border-faint">
                <Image
                  src={`/wallpapers/${active.path}`}
                  alt={`${active.name} wallpaper preview`}
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 type-ui fg-body">
                <p>
                  <span className="fg-muted">Filename:</span> {active.filename}
                </p>
                <p>
                  <span className="fg-muted">Size:</span> {active.size} MB
                </p>
                <p>
                  <span className="fg-muted">Resolution:</span> {active.width}×
                  {active.height}
                </p>
                <p>
                  <span className="fg-muted">Aspect:</span>{' '}
                  {(active.width / active.height).toFixed(2)}:1
                </p>
              </div>

              <div className="flex flex-wrap gap-1">
                {active.tags.map((tag) => (
                  <span
                    key={`${active.path}-tag-${tag}`}
                    className="type-meta px-2 py-1 rounded border border-ui fg-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="rounded-md border border-ui bg-white p-3 dark:bg-stone-900">
                <pre className="overflow-x-auto type-meta fg-body">{`image = pkgs.fetchurl {
  url = "${toRawDownloadUrl(active.path)}";
  sha256 = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
};`}</pre>
              </div>

              <div className="flex flex-wrap gap-2">
                <a
                  href={toRawDownloadUrl(active.path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md border border-ui px-3 py-2 type-ui fg-primary hover:bg-stone-100 dark:hover:bg-stone-900"
                >
                  Download original
                </a>
                <button
                  type="button"
                  onClick={() => onCopyNix(active)}
                  className="rounded-md border border-ui px-3 py-2 type-ui fg-primary hover:bg-stone-100 dark:hover:bg-stone-900"
                >
                  Copy nix snippet
                </button>
                {copyState === 'copied' && (
                  <span className="type-meta text-green-600 dark:text-green-400">
                    copied
                  </span>
                )}
                {copyState === 'error' && (
                  <span className="type-meta text-red-600 dark:text-red-400">
                    clipboard failed
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

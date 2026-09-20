'use client'

import { ArrowRight, FilterX, ImageOff } from 'lucide-react'
import {
  ArrowLink,
  BarButton,
  CardGrid,
  Dialog,
  EmptyState,
  SearchBar,
  Tag,
  TagFilter,
  Tags,
} from 'pivoshenko.ui'
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
const repository = 'pivoshenko.wallpapers'
const repositoryPath = 'site/public/wallpapers'

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

// the collection numbers its files, so a purely numeric name is the tile's
// index chip rather than its heading
function toIndexChip(name: string) {
  return /^\d+$/.test(name) ? name : undefined
}

function LoadingGrid() {
  return (
    <CardGrid>
      {Array.from({ length: 12 }, (_, item) => item).map((item) => (
        <div
          key={`loading-${item}`}
          className="surface-card aspect-[16/10] animate-pulse bg-bg-raised"
        />
      ))}
    </CardGrid>
  )
}

export function WallpaperBrowser() {
  const [wallpapers, setWallpapers] = useState<Wallpaper[]>([])
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [active, setActive] = useState<Wallpaper | null>(null)
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

  const tags = useMemo(() => {
    const counts = new Map<string, number>()
    for (const wallpaper of wallpapers) {
      for (const tag of wallpaper.tags) {
        counts.set(tag, (counts.get(tag) ?? 0) + 1)
      }
    }

    return [...counts]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => a.tag.localeCompare(b.tag))
  }, [wallpapers])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return wallpapers.filter(
      (wallpaper) =>
        (needle === '' || wallpaper.name.toLowerCase().includes(needle)) &&
        (selectedTags.size === 0 ||
          wallpaper.tags.some((tag) => selectedTags.has(tag))),
    )
  }, [query, selectedTags, wallpapers])

  const hasFilters = selectedTags.size > 0 || query !== ''

  const onToggleTag = (tag: string) => {
    setSelectedTags((current) => {
      const next = new Set(current)
      if (!next.delete(tag)) next.add(tag)
      return next
    })
  }

  const onClearFilters = () => {
    setSelectedTags(new Set())
    setQuery('')
  }

  const onOpen = (wallpaper: Wallpaper) => {
    setActive(wallpaper)
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4 border-b border-ui pb-6">
        <SearchBar
          value={query}
          onValueChange={setQuery}
          placeholder="Search wallpapers"
        />

        <div className="flex flex-wrap items-center gap-3">
          <TagFilter
            tags={tags}
            active={selectedTags}
            onToggle={onToggleTag}
            className="flex-1"
          />
          {hasFilters && (
            <BarButton
              onClick={onClearFilters}
              icon={<FilterX size={14} strokeWidth={2} aria-hidden="true" />}
            >
              clear filters
            </BarButton>
          )}
        </div>
      </section>

      {isLoading && <LoadingGrid />}

      {!isLoading && filtered.length === 0 && (
        <EmptyState
          icon={<ImageOff size={20} strokeWidth={2} aria-hidden="true" />}
          title="No wallpapers match"
          description="Nothing in the collection carries this combination of search term and tags."
          action={
            <BarButton
              onClick={onClearFilters}
              icon={<FilterX size={14} strokeWidth={2} aria-hidden="true" />}
            >
              clear filters
            </BarButton>
          }
        />
      )}

      {!isLoading && filtered.length > 0 && (
        <CardGrid>
          {filtered.map((wallpaper) => {
            const index = toIndexChip(wallpaper.name)

            return (
              <article
                key={wallpaper.path}
                className="group surface-card flex flex-col overflow-hidden transition-[border-color,transform,box-shadow] duration-base ease-out hover:-translate-y-0.5 hover:border-overlay1 hover:shadow-lifted motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {/* the card is a plain container rather than a link: its tags
                    are buttons, and interactive content cannot nest */}
                <button
                  type="button"
                  onClick={() => onOpen(wallpaper)}
                  aria-label={`Open ${wallpaper.name}`}
                  className="focus-ring relative block aspect-[16/10] w-full overflow-hidden bg-crust"
                >
                  <img
                    src={`/wallpapers/${wallpaper.path}`}
                    alt=""
                    loading="lazy"
                    className="block h-full w-full object-cover transition-transform duration-slow ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                  {index && (
                    <span className="fg-primary absolute left-3 top-3 rounded-sm bg-crust/[0.72] px-1.5 py-0.5 text-[11px] leading-4 backdrop-blur-[8px]">
                      {index}
                    </span>
                  )}
                </button>

                <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
                  {!index && (
                    <span className="type-ui fg-title">{wallpaper.name}</span>
                  )}

                  <TagFilter
                    tags={wallpaper.tags.map((tag) => ({ tag }))}
                    active={selectedTags}
                    onToggle={onToggleTag}
                    label={`Filter by the tags on ${wallpaper.name}`}
                  />

                  <div className="type-meta fg-subtle mt-auto flex items-center justify-between gap-3 pt-1">
                    <span>{`${wallpaper.width}\u00d7${wallpaper.height}`}</span>

                    {/* the card carries no border of its own to mark it
                        actionable, so this is the affordance: it tints with the
                        accent whenever the cursor is anywhere over the card */}
                    <button
                      type="button"
                      onClick={() => onOpen(wallpaper)}
                      className="focus-ring inline-flex items-center gap-1 whitespace-nowrap transition-colors duration-fast hover:text-accent group-hover:text-accent"
                    >
                      details
                      <ArrowRight
                        size={14}
                        strokeWidth={2}
                        aria-hidden="true"
                        className="transition-transform duration-base ease-out group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                      />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </CardGrid>
      )}

      {active && (
        <Dialog
          open
          onClose={() => setActive(null)}
          title={active.name}
          eyebrow={active.filename}
        >
          <img
            src={`/wallpapers/${active.path}`}
            alt={`${active.name} wallpaper preview`}
            className="block aspect-[16/10] w-full rounded border border-faint object-cover"
          />

          <dl className="m-0 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['Filename', active.filename],
              ['Size', `${active.size} MB`],
              ['Resolution', `${active.width}\u00d7${active.height}`],
              ['Aspect', `${(active.width / active.height).toFixed(2)}:1`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="type-meta fg-muted">{label}</dt>
                <dd className="type-ui fg-body m-0">{value}</dd>
              </div>
            ))}
          </dl>

          <Tags>
            {active.tags.map((tag) => (
              <Tag key={`${active.path}-tag-${tag}`}>{tag}</Tag>
            ))}
          </Tags>

          <div>
            <ArrowLink
              href={toRawDownloadUrl(active.path)}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              Download original
            </ArrowLink>
          </div>
        </Dialog>
      )}
    </div>
  )
}

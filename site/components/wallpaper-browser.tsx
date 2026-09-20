'use client'

import {
  ClipboardCheck,
  ClipboardCopy,
  FilterX,
  ImageOff,
  TriangleAlert,
} from 'lucide-react'
import {
  ArrowLink,
  BarButton,
  CardGrid,
  CodeBlock,
  CopyPill,
  Dialog,
  EmptyState,
  MediaTile,
  SearchBar,
  Tag,
  TagFilter,
  Tags,
  Toast,
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

function toNixSnippet(filePath: string) {
  return `image = pkgs.fetchurl {
  url = "${toRawDownloadUrl(filePath)}";
  sha256 = "sha256-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";
};`
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
    setCopyState('idle')
  }

  const onCopyNix = async (wallpaper: Wallpaper) => {
    try {
      await navigator.clipboard.writeText(toNixSnippet(wallpaper.path))
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }

    setTimeout(() => setCopyState('idle'), 1800)
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
          {filtered.map((wallpaper) => (
            <div key={wallpaper.path} className="flex flex-col gap-2">
              <MediaTile
                href={`/wallpapers/${wallpaper.path}`}
                onClick={(event) => {
                  event.preventDefault()
                  onOpen(wallpaper)
                }}
                src={`/wallpapers/${wallpaper.path}`}
                alt={`${wallpaper.name} wallpaper`}
                index={toIndexChip(wallpaper.name)}
                meta={[
                  `${wallpaper.width}\u00d7${wallpaper.height}`,
                  `${wallpaper.size} MB`,
                ]}
              >
                {toIndexChip(wallpaper.name) ? null : (
                  <span className="type-ui fg-title">{wallpaper.name}</span>
                )}
              </MediaTile>

              <TagFilter
                tags={wallpaper.tags.map((tag) => ({ tag }))}
                active={selectedTags}
                onToggle={onToggleTag}
                label={`Filter by the tags on ${wallpaper.name}`}
              />
            </div>
          ))}
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

          <CodeBlock
            label="nix"
            code={toNixSnippet(active.path)}
            copyable={false}
          />

          <div className="flex flex-wrap items-center gap-3">
            <ArrowLink
              href={toRawDownloadUrl(active.path)}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
            >
              Download original
            </ArrowLink>

            <CopyPill
              copied={copyState === 'copied'}
              onClick={() => onCopyNix(active)}
            >
              {copyState === 'copied' ? (
                <ClipboardCheck size={14} strokeWidth={2} aria-hidden="true" />
              ) : (
                <ClipboardCopy size={14} strokeWidth={2} aria-hidden="true" />
              )}
              {copyState === 'copied' ? 'copied' : 'copy nix snippet'}
            </CopyPill>
          </div>

          {copyState === 'error' && (
            <Toast
              icon={
                <TriangleAlert size={14} strokeWidth={2} aria-hidden="true" />
              }
            >
              clipboard failed
            </Toast>
          )}
        </Dialog>
      )}
    </div>
  )
}

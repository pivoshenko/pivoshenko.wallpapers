'use client'

import type { Wallpaper } from '@/lib/wallpapers'
import { FilterX, ImageOff } from 'lucide-react'
import Image from 'next/image'
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
import { useMemo, useState } from 'react'

const owner = 'pivoshenko'
const repository = 'pivoshenko.wallpapers'
const repositoryPath = 'site/public/wallpapers'

function toRawDownloadUrl(filePath: string) {
  return `https://raw.githubusercontent.com/${owner}/${repository}/main/${repositoryPath}/${filePath}`
}

// the collection numbers its files, so a purely numeric name is the tile's
// index chip rather than its heading
function toIndexChip(name: string) {
  return /^\d+$/.test(name) ? name : undefined
}

// a card's chips filter on click but never mirror the selection: every card
// carrying the tag would light at once, which reads as noise rather than state
const noSelection = new Set<string>()

export function WallpaperBrowser({ wallpapers }: { wallpapers: Wallpaper[] }) {
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [active, setActive] = useState<Wallpaper | null>(null)

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
              Reset
            </BarButton>
          )}
        </div>
      </section>

      {filtered.length === 0 && (
        <EmptyState
          icon={<ImageOff size={20} strokeWidth={2} aria-hidden="true" />}
          title="No wallpapers match"
          description="Nothing in the collection carries this combination of search term and tags."
          action={
            <BarButton
              onClick={onClearFilters}
              icon={<FilterX size={14} strokeWidth={2} aria-hidden="true" />}
            >
              Reset
            </BarButton>
          }
        />
      )}

      {filtered.length > 0 && (
        <CardGrid>
          {filtered.map((wallpaper) => {
            const index = toIndexChip(wallpaper.name)

            return (
              <article
                key={wallpaper.path}
                className="group surface-card flex flex-col overflow-hidden transition-[border-color,transform,box-shadow] duration-base ease-out hover:-translate-y-0.5 hover:border-accent hover:shadow-lifted focus-within:border-accent motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {/* the eyebrow the Card component paints, so the row under
                    the image is free for the tags */}
                <div className="fg-subtle flex items-center gap-2 border-b border-faint bg-bg-sunken px-4 py-2 text-[11px] leading-4">
                  {index && <span className="fg-primary">{index}</span>}
                  <span className="ml-auto truncate">
                    {`${wallpaper.width}\u00d7${wallpaper.height}`}
                  </span>
                </div>

                {/* the card is a plain container rather than a link: its tags
                    are buttons, and interactive content cannot nest */}
                <button
                  type="button"
                  onClick={() => onOpen(wallpaper)}
                  aria-label={`Open ${wallpaper.name}`}
                  className="focus-ring relative block aspect-[16/10] w-full overflow-hidden bg-crust"
                >
                  <Image
                    src={`/wallpapers/${wallpaper.path}`}
                    alt=""
                    fill
                    // tiles are auto-fill minmax(280px, 1fr), so above the
                    // phone breakpoint they sit between 280px and about 400px
                    sizes="(max-width: 640px) 100vw, 400px"
                    loading="lazy"
                    className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  />
                </button>

                <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
                  {!index && (
                    <span className="type-ui fg-title">{wallpaper.name}</span>
                  )}

                  <TagFilter
                    tags={wallpaper.tags.map((tag) => ({ tag }))}
                    active={noSelection}
                    onToggle={onToggleTag}
                    label={`Filter by the tags on ${wallpaper.name}`}
                    className="mt-auto"
                  />
                </div>
              </article>
            )
          })}
        </CardGrid>
      )}

      {active && (
        // wider than the default dialog, and capped by the viewport height too:
        // the 16/10 frame plus about 17rem of header, details, footer and the
        // dialog's own margin has to fit without scrolling. The 3rem gives back
        // the padding the frame sits inside
        <Dialog
          open
          onClose={() => setActive(null)}
          title={active.filename}
          className="!w-[min(72rem,calc(100vw-2rem),calc((100dvh-17rem)*1.6+3rem))]"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded border border-faint">
            <Image
              src={`/wallpapers/${active.path}`}
              alt={`${active.filename} preview`}
              fill
              sizes="(max-width: 74rem) 100vw, 1104px"
              className="object-cover"
            />
          </div>

          <dl className="m-0 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              ['Size', `${active.size} MB`],
              ['Resolution', `${active.width}\u00d7${active.height}`],
              ['Aspect', `${(active.width / active.height).toFixed(2)}:1`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="type-ui fg-title">
                  <span aria-hidden="true" className="text-accent">
                    {'//'}
                  </span>{' '}
                  {label}
                </dt>
                <dd className="type-ui fg-body m-0">{value}</dd>
              </div>
            ))}
          </dl>

          {/* the tags and the action share the footer row: alone under them
              the button reads as stranded rather than as the dialog's close
              move */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Tags>
              {active.tags.map((tag) => (
                <Tag key={`${active.path}-tag-${tag}`}>{tag}</Tag>
              ))}
            </Tags>

            <ArrowLink
              href={toRawDownloadUrl(active.path)}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              external
            >
              Download original
            </ArrowLink>
          </div>
        </Dialog>
      )}
    </div>
  )
}

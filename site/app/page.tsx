import { WallpaperBrowser } from '@/components/wallpaper-browser'
import { HeroBand, PageBody } from 'pivoshenko.ui'

export default function Home() {
  return (
    <>
      <HeroBand
        field="chunks"
        title={
          <>
            <span className="fg-title">pivoshenko</span>
            <span className="fg-muted">.</span>
            <span className="text-accent">wallpapers</span>
          </>
        }
        lead="Curated collection of wallpapers."
      >
        <p className="type-meta fg-muted mt-3 max-w-2xl">
          Wallpapers are collected from various artists and remain the property
          of their creators. See the repository for attribution and takedown
          requests.
        </p>
      </HeroBand>

      <PageBody>
        <WallpaperBrowser />
      </PageBody>
    </>
  )
}

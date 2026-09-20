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
      />

      <PageBody>
        <WallpaperBrowser />
      </PageBody>
    </>
  )
}

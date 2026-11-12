import { WallpaperBrowser } from '@/components/wallpaper-browser'
import { getWallpapers } from '@/lib/wallpapers'
import { HeroBand, PageBody } from 'pivoshenko.ui'

export default async function Home() {
  const wallpapers = await getWallpapers()

  return (
    <>
      <HeroBand
        title={
          <>
            <span className="fg-title">Wallpapers </span>
            <span className="text-accent">Hub</span>
          </>
        }
        lead="Curated collection of wallpapers focused on minimalism and aesthetic consistency."
      />

      <PageBody>
        <WallpaperBrowser wallpapers={wallpapers} />
      </PageBody>
    </>
  )
}

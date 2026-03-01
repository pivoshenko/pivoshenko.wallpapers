import { WallpaperBrowser } from '@/components/wallpaper-browser'

export default function Home() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="type-heading fg-primary">Wallpapers</h1>
        <p className="type-body fg-body max-w-3xl">
          Curated wallpapers from my personal collection. Filter by tag, search
          by name, inspect metadata, and download originals.
        </p>
      </section>

      <WallpaperBrowser />
    </div>
  )
}

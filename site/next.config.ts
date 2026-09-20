import type { NextConfig } from 'next'
import { baseNextConfig } from 'pivoshenko.ui/next/config'

const config: NextConfig = {
  ...baseNextConfig,
  images: {
    // the wallpapers are build-time static, so the optimizer's output never
    // goes stale - and "Download original" links straight to the repository,
    // so serving optimized previews costs no fidelity
    minimumCacheTTL: 31536000,
  },
}

export default config

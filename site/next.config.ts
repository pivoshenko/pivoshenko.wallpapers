import type { NextConfig } from 'next'
import { baseNextConfig } from 'pivoshenko.ui/next/config'

const config: NextConfig = {
  ...baseNextConfig,
  images: {
    unoptimized: true,
  },
}

export default config

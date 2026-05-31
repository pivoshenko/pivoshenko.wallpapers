import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['pivoshenko.ui'],
  images: {
    unoptimized: true,
  },
}

export default nextConfig

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }
export const contentType = 'image/png'
export const runtime = 'nodejs'

export default function Icon() {
  const font = readFileSync(
    join(
      process.cwd(),
      'node_modules/geist/dist/fonts/geist-mono/GeistMono-Bold.ttf',
    ),
  )

  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          color: '#fff',
          fontFamily: 'GeistMono',
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: '-0.5px',
          lineHeight: 1,
        }}
      >
        VP
      </span>
    </div>,
    {
      ...size,
      fonts: [{ name: 'GeistMono', data: font, weight: 700 }],
    },
  )
}

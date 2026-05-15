# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 16 wallpaper gallery site for browsing, filtering, and downloading wallpapers from Volodymyr Pivoshenko's personal collection. Deployed on Vercel. Uses JetBrains Mono font (via `next/font/google`), Tailwind CSS with a stone-based color palette, and dark/light theme support via `next-themes`.

## Commands

- **Dev server:** `pnpm dev` (runs wallpaper manifest generation then Next.js with Turbopack)
- **Build:** `pnpm build`
- **Lint:** `pnpm lint` (Biome)
- **Format:** `pnpm format` (Biome, writes changes)
- **Lint + format:** `pnpm check` (Biome, writes changes)
- **Full lint check:** `just lint` (runs `pnpm check` then `pnpm build`)
- **Regenerate wallpaper manifest:** `pnpm generate:wallpapers`

Package manager is **pnpm** (10.x). No test suite exists.

## Architecture

### Wallpaper pipeline

`generateFileList.js` scans `public/wallpapers/` recursively, reads image dimensions via `image-size`, and writes `public/files.json`. This manifest is fetched at runtime by the client-side `WallpaperBrowser` component. Both `dev` and `build` scripts run this generation step first.

### Wallpaper naming convention

Filenames encode metadata: `name_tag1_tag2.ext`. The name segment uses hyphens for spaces (title-cased at display time). Everything after the first underscore is parsed as tags. Tags drive the filter UI.

### Component design tokens

`app/globals.css` defines a local copy of the Tailwind `@layer components` design tokens (`type-*`, `fg-*`, `hover-*`, `bg-tag*`, `border-*`). The canonical source is `pivoshenko.ui/ui/globals.css` — this site has not yet migrated to import the shared file. Use the token classes instead of raw Tailwind utilities for consistency.

### Key files

- `components/wallpaper-browser.tsx` — client component (`'use client'`); the main gallery with search, tag filtering, detail modal, and Nix snippet copy. Uses `SearchInput`, `Tag`, `TagButton` from `pivoshenko.ui`.
- `app/layout.tsx` — root layout: ThemeProvider, JetBrains Mono font, Vercel Analytics, and `<PageShell brand="pivoshenko.wallpapers">` from `pivoshenko.ui` (composes shared `Nav` + `Footer` + `ThemeToggle` + `ScrollToTop`). No local nav/footer/theme-toggle components.
- `app/globals.css` — design token definitions (local; see note above)

### Shared package consumption

This site pins `pivoshenko.ui` via git tag in `package.json`. See parent `me/CLAUDE.md` for the cross-cutting pattern.

- `biome.json` extends `./node_modules/pivoshenko.ui/config/biome.json`
- `tsconfig.json` extends `pivoshenko.ui/tsconfig.base.json`
- `tailwind.config.ts` uses `pivoshenko.ui/tailwind-preset` + content glob pointing at the package source
- `next.config.ts` needs `transpilePackages: ['pivoshenko.ui']`

### Required env vars

None. `@vercel/analytics` is wired via the Vercel integration. If a future build needs a secret, add it here as: name · purpose · scope (build/runtime) · visibility (`NEXT_PUBLIC_` public vs secret).

### Formatting rules (Biome)

- Indent: 2 spaces
- Single quotes for JS/TS, double quotes for JSX
- Trailing commas, no semicolons (ASI)
- Line width: 80
- CSS linting is disabled

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 16 wallpaper gallery site for browsing, filtering, and downloading wallpapers from Volodymyr Pivoshenko's personal collection. Deployed on Vercel. Uses JetBrains Mono font (via `next/font/google`), Tailwind CSS with a stone-based color palette, and dark/light theme support via `next-themes`.

## Layout

The Next.js app lives under [`site/`](./site/) (mirrors [`pivoshenko.ai`](../pivoshenko.ai/CLAUDE.md) and [`pivoshenko.dev`](../pivoshenko.dev/CLAUDE.md)). The repo root holds only `justfile`, `README.md`, `CLAUDE.md`, `LICENSE`, `.editorconfig`, `.gitignore`, `.github/`. All paths in this doc (`app/`, `components/`, `public/`, `package.json`, `next.config.ts`, `tailwind.config.ts`, `biome.json`, `vercel.json`, `generateFileList.js`, …) are relative to `site/`.

The Vercel project's **Root Directory** is set to `site/` in the dashboard.

## Commands

Run everything through the root `justfile` — it shells out to `pnpm -C site …`:

```bash
just install          # pnpm install
just dev              # Dev server with Turbopack (regenerates wallpaper manifest first)
just build            # Production build (regenerates wallpaper manifest first)
just lint             # Biome lint
just format           # Biome format (auto-fix)
just audit            # pnpm audit (CI gate alongside lint + build)
just check            # Full gate: biome check + next build
just update           # Bump dependencies
```

Package manager is **pnpm** (10.x). No test suite exists. CI (`.github/workflows/ci.yaml`) runs `install` → `lint` → `audit` → `build` on push to `main` and on PRs.

## Architecture

### Wallpaper pipeline

`site/generateFileList.js` scans `site/public/wallpapers/` recursively, reads image dimensions via `image-size`, and writes `site/public/files.json`. This manifest is fetched at runtime by the client-side `WallpaperBrowser` component. Both `dev` and `build` scripts run this generation step first.

### Wallpaper naming convention

Filenames encode metadata: `name_tag1_tag2.ext`. The name segment uses hyphens for spaces (title-cased at display time). Everything after the first underscore is parsed as tags. Tags drive the filter UI.

### Component design tokens

`site/app/globals.css` is a single `@import "pivoshenko.ui/ui/globals.css"` — all design tokens (`type-*`, `fg-*`, `hover-*`, `bg-tag*`, `border-*`) come from the shared package. Use the token classes instead of raw Tailwind utilities for consistency.

### Key files

- `site/components/wallpaper-browser.tsx` — client component (`'use client'`); the main gallery with search, tag filtering, detail modal, and Nix snippet copy. Uses `Tag`, `TagButton` from `pivoshenko.ui`.
- `site/app/layout.tsx` — root layout: ThemeProvider, JetBrains Mono font, Vercel Analytics, and `<PageShell brand="pivoshenko.wallpapers">` from `pivoshenko.ui` (composes shared `Nav` + `Footer` + `ThemeToggle` + `ScrollToTop`). No local nav/footer/theme-toggle components.
- `site/app/globals.css` — single `@import "pivoshenko.ui/ui/globals.css"` (see note above)

### Shared package consumption

This site pins `pivoshenko.ui` via git tag in `site/package.json`. See parent `CLAUDE.md` for the cross-cutting pattern.

- `site/biome.json` extends `./node_modules/pivoshenko.ui/config/biome.json`
- `site/tsconfig.json` extends `pivoshenko.ui/tsconfig.base.json`
- `site/tailwind.config.ts` uses `pivoshenko.ui/tailwind-preset` + content glob pointing at the package source
- `site/next.config.ts` needs `transpilePackages: ['pivoshenko.ui']`

### Required env vars

None. `@vercel/analytics` is wired via the Vercel integration. If a future build needs a secret, add it here as: name · purpose · scope (build/runtime) · visibility (`NEXT_PUBLIC_` public vs secret).

### Formatting rules (Biome)

- Indent: 2 spaces
- Single quotes for JS/TS, double quotes for JSX
- Trailing commas, no semicolons (ASI)
- Line width: 80
- CSS linting is disabled

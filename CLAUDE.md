# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Next.js 16 wallpaper gallery site for browsing, filtering, and downloading wallpapers from Volodymyr Pivoshenko's personal collection. Deployed on Vercel. Uses Geist font family, Tailwind CSS with a stone-based color palette, and dark/light theme support via `next-themes`.

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

`app/globals.css` defines a custom Tailwind `@layer components` system for typography (`type-heading`, `type-body`, `type-ui`, `type-label`, `type-meta`, `type-logo`), foreground colors (`fg-primary` through `fg-muted`), hover states (`hover-primary`, `hover-secondary`), and borders (`border-ui`, `border-faint`). Use these utility classes instead of raw Tailwind color/text classes.

### Key files

- `components/wallpaper-browser.tsx` — client component (`'use client'`); the main gallery with search, tag filtering, detail modal, and Nix snippet copy
- `app/layout.tsx` — root layout with ThemeProvider, Geist fonts, Vercel Analytics
- `app/globals.css` — design token definitions

### Formatting rules (Biome)

- Indent: 2 spaces
- Single quotes for JS/TS, double quotes for JSX
- Trailing commas, no semicolons (ASI)
- Line width: 80
- CSS linting is disabled

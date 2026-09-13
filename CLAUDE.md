# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`AGENTS.md` is a symlink to this file, so both agents read the same guidance.

## Overview

`pivoshenko.wallpapers` is a Next.js site that browses a curated wallpaper collection with tag
filtering, per-image metadata, and direct downloads, deployed to Vercel at
`wallpapers.pivoshenko.dev`. The repository root is a thin shell - task runner, CI, project docs -
and all application code lives in `site/`.

## Expensive to get wrong

- **Download URLs are built from three hardcoded constants.** `toRawDownloadUrl` in
  `site/components/wallpaper-browser.tsx` assembles a `raw.githubusercontent.com` URL from the
  `owner`, `repository`, and `repositoryPath` constants at the top of that file. Renaming the
  repository, the default branch, or the wallpapers directory silently breaks every "Download
  original" link and the copyable Nix `pkgs.fetchurl` snippet unless those constants change too
- **`site/public/files.json` is a generated file that happens to be tracked.** Editing it by hand
  is always wrong - the next `dev` or `build` overwrites the change
- **The images are not ours.** The MIT license covers the source code only; `README.md` holds the
  known sources and the takedown policy. Do not present them as original work, strip that section
  from `README.md`, or add an image without recording where it came from

## Architecture

### Wallpapers are the data model

There is no database, CMS, or API. The wallpaper collection is a directory of image files, and
their filenames carry the metadata.

1. Image files live in `site/public/wallpapers/`
2. `site/generateFileList.js` walks that directory at build time, reads each file's byte size and
   pixel dimensions (via `image-size`), and writes `site/public/files.json`
3. `WallpaperBrowser` fetches `/files.json` in the browser at runtime and derives everything else

To add or remove a wallpaper, change the files in `site/public/wallpapers/` and then run
`just build` (or `pnpm -C site generate:wallpapers`) so the regenerated `files.json` is committed
alongside them.

### Filenames encode tags

`parseFilename` in `site/components/wallpaper-browser.tsx` splits a filename as
`<name>_<tag>[_<tag>...].<ext>`: everything before the extension is split on `_`, the first
segment becomes the display name (hyphens to spaces, title-cased), and every remaining segment
becomes a tag verbatim - a hyphen inside a tag segment stays in the tag. The existing collection
uses a numeric prefix plus one tag, e.g. `039_concept.jpg`.

The tag filter list is not configured anywhere - it is the sorted set of tags discovered across
all filenames, so renaming a file changes both its display name and its facets.

### `pivoshenko.ui` owns the configuration

`pivoshenko.ui` is a shared design system pinned as a GitHub dependency at a tag in
`site/package.json`. Nearly every config file in `site/` is a one-line re-export of it, and the
components (`Tag`, `TagButton`, `Card`, `Nav`, `Footer`, `Toast`, and more) come from the package
root - import one from there before writing a local equivalent.

- Lint rules, formatting, TypeScript strictness, the Tailwind theme, and the site chrome are
  upstream concerns - fix them in `pivoshenko.ui` and bump the pinned tag, never by diverging
  locally
- `just update` will not move that pin, because it is a git ref rather than a version range
- `withUiContent` wraps the Tailwind content globs so Tailwind also scans the UI package's own
  sources for class names
- For the semantic utility classes and the surface color scale, see `pivoshenko.ui`'s own
  `CLAUDE.md` - use them rather than raw Tailwind color and font utilities

### Rendering notes

`next.config.ts` sets `images.unoptimized: true`, so Vercel image optimization is off and
`next/image` serves the files from `public/` directly. `WallpaperBrowser` is the only client
component (`'use client'`); the `app/` files around it are server components rendering the shell.

## Commands and conventions

`just --list` from the repository root is the entry point for everything, and `just check` is the
pre-PR gate. `.no-tests` at the root is a deliberate sentinel: `just test` skips while it exists
and fails loudly once it is removed, so delete it and replace the `test` recipe in the same change.
Biome owns formatting and linting - run `just format` rather than hand-formatting.
`CONTRIBUTING.md` holds the rest: local development, CI, branch naming, commits, and PRs.

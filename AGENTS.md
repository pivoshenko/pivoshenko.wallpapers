# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`pivoshenko.wallpapers` is an images-only repository: the curated wallpaper collection in
`wallpapers/`, plus project docs and one deploy workflow. The gallery site that renders it,
`wallpapers.pivoshenko.dev`, lives in the private `pivoshenko.sites` monorepo under
`sites/wallpapers`. At build time that site reads this repository (locally by copying the sibling
checkout, on Vercel by shallow-cloning this public repo) and copies the images out of it.

## Expensive to Get Wrong

- **Download links are raw GitHub URLs.** The site links to `wallpapers/<file>` on the `main`
  branch of this repository via `raw.githubusercontent.com`. Renaming the repository, the default
  branch, the `wallpapers/` directory, or any file silently breaks those links and the site's
  build-time read - fix `pivoshenko.sites` in the same change
- **The images are not ours.** The MIT license covers the source code only; `README.md` holds the
  known sources and the takedown policy. Do not present them as original work, strip that section
  from `README.md`, or add an image without recording where it came from

## Wallpapers

Image files live in `wallpapers/`, and their filenames carry the metadata the site derives.

The filename convention is `<name>_<tag>[_<tag>...].<ext>`: everything before the extension is
split on `_`, the first segment becomes the display name (hyphens to spaces, title-cased), and every
remaining segment becomes a tag verbatim. The existing collection uses a numeric prefix plus one
tag, e.g. `039_concept.jpg`. The site's tag filter is the set of tags found across all filenames,
so renaming a file changes both its display name and its facets.

To add a wallpaper, put the file in `wallpapers/` following that convention and push to `main`. To
remove one, delete it the same way.

## Deploy

`.github/workflows/deploy.yaml` runs on pushes to `main` that touch `wallpapers/**` (and on manual
dispatch). It POSTs to the Vercel deploy hook stored in the repo secret `VERCEL_DEPLOY_HOOK`, which
rebuilds `wallpapers.pivoshenko.dev`. The Vercel project is not connected to this repository.

## Commands and Conventions

`just --list` from the repository root lists the available recipes. `.no-tests` at the root is a
deliberate sentinel: `just test` skips while it exists and fails loudly once it is removed.
`CONTRIBUTING.md` holds the rest: contributing, workflows, branch naming, commits, and PRs.

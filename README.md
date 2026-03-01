# pivoshenko.wallpapers

Personal wallpapers app, rebuilt with Next.js App Router and Biome.

## Stack

- Next.js 15
- React 19
- Tailwind CSS
- Biome (formatting + linting)

## Development

```bash
pnpm install
pnpm dev
```

The wallpapers index is generated from `public/wallpapers` into
`public/files.json` via:

```bash
pnpm generate:wallpapers
```

This runs automatically for `pnpm dev` and `pnpm build`.

## Naming convention

Wallpaper files should follow:

```text
<name>_<tag0>_<tag1>.<ext>
```

Example:

```text
042_synthwave_neon.png
```

The app derives display title and tags from the filename.

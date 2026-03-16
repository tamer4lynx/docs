# Tamer4Lynx Docs

Rspress documentation site for Tamer4Lynx. Lives at `packages/docs` in the monorepo.

## Setup

```bash
bun install
```

## Commands

- `bun run dev` — Start dev server
- `bun run build` — Build for production
- `bun run preview` — Preview production build

## Submodule setup

To use this as a git submodule: create `tamer4lynx/tamer4lynx-docs` on GitHub, push this directory, then from the monorepo root:

```bash
rm -rf packages/docs
git submodule add https://github.com/tamer4lynx/tamer4lynx-docs.git packages/docs
```

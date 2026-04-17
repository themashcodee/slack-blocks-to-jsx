# Playground

A tiny Vite + React app that imports `slack-blocks-to-jsx` from the library's
source (`../src/index.ts`) via a Vite alias, so every edit in the library
hot-reloads instantly in the preview pane.

This folder is committed to git but **is not published to npm** (see the
root `.npmignore`).

## Usage

```bash
# one-time, from the library root
pnpm playground:install

# start the playground
pnpm playground
```

Then open <http://localhost:5173>. The left sidebar has a few fixtures, the
middle pane is a live JSON editor, and the right pane renders the blocks
through `<Message>`. A light/dark theme toggle sits in the sidebar footer.

## Layout

```
playground/
  package.json          # isolated deps (react, vite, tailwind…)
  vite.config.ts        # aliases "slack-blocks-to-jsx" → ../src/index.ts
  tailwind.config.cjs   # re-exports ../tailwind.config.js
  postcss.config.js     # mirrors the library's pipeline (no cssnano)
  tsconfig.json         # with paths → ../src/index.ts for editor jumps
  index.html
  src/
    main.tsx
    App.tsx             # sidebar + editor + preview
    fixtures.ts         # inline sample blocks (self-contained)
    index.css           # @imports ../../src/style.css + plain-CSS chrome
```

## Adding a new block to the library

1. Create the React component in `../src/components/blocks/your-block.tsx`.
2. Register it in `../src/components/index.tsx` and `../src/components/blocks/index.ts`.
3. Extend the types in `../src/types/layout.ts`.
4. Drop a fixture into `playground/src/fixtures.ts` so contributors and
   reviewers can see it render without leaving the browser.

## Why not include the fixtures from `../test-blocks/`?

The library's `test-blocks/` folder is gitignored and therefore not available
to anyone who clones the repo. The playground keeps its own inline fixtures
(same format, smaller set) so it works out of the box.

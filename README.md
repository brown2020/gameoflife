# Game of Life

An interactive, client-only implementation of Conway's Game of Life. Draw on a canvas grid, load classic patterns, and watch cellular automata evolve in the browser. No accounts, backends, or API keys.

**Live demo:** [https://ignitegameoflife.vercel.app](https://ignitegameoflife.vercel.app)

## Features

- Canvas grid with pointer, draw, and eraser tools. Draw and eraser strokes fill the cells between pointer samples and work with mouse and touch.
- Play, pause, and single-step. The speed slider stays between 10 ms and 500 ms per generation (right is faster).
- Zoom from 5 px to 30 px. The grid is sized to the visible frame.
- Built-in patterns, centered on the current grid: spaceships (Glider, LWSS), oscillators (Pulsar, Pentadecathlon, Toad, Beacon), a gun (Gosper glider gun), and methuselahs (Diehard, R-pentomino). If a pattern is larger than the board, the info panel says how many cells were clipped.
- Random fill, clear, and a generation counter with reset.
- Keyboard: Space (play/pause), C (clear), R (random), S (step), +/− (zoom). Those shortcuts pause while a dialog is open. Focus the grid and use the arrow keys plus Enter or Space to edit cells.
- Tutorial and rules dialogs, plus a pattern info panel.

## Tech stack

| Technology | Version range in package.json |
| --- | --- |
| Next.js (App Router) | ^16.4.3 |
| React / React DOM | ^19.3.1 |
| TypeScript compiler (`tsc`) | 7.0.2, installed as `@typescript/native` (`npm:typescript@^7.0.2`) |
| TypeScript API for ESLint and Next | `@typescript/typescript6` ^6.0.2, aliased as `typescript` |
| typescript-eslint | ^8.72.1 |
| Tailwind CSS | ^4.3.3 |
| Vitest | ^5.0.5 |
| Vite | ^8.3.5 |
| ESLint | ^10.13.0 |

`typescript-eslint` 8 does not support the TypeScript 7 API. The `typescript` dependency stays on the TypeScript 6 compatibility package so lint and Next's programmatic check keep working. `npm run typecheck` runs the TypeScript 7 `tsc` binary.

This app is fully client-side: no Firebase, Stripe, server actions, or API routes.

## Project structure

```
src/
  app/                 # Next.js App Router (layout, page, globals.css)
  components/          # GameComponent, GridCanvas, Controls, modals, UI
  constants/           # Grid size, speed, colors, tools
  hooks/               # useGameOfLife, useKeyboardShortcuts
  types/               # Grid / CellState / Tool types
  utils/               # Simulation, grid fit, patterns, speed mapping
tests/                 # Vitest: simulation, patterns, headers, route check
.github/workflows/     # CI (lint, typecheck, test, build)
docs/                  # Architecture and budget notes
security-headers.mjs   # Response header policy used by next.config.mjs
spec.md                # Behavior as built
roadmap.md             # Next steps and known limits
```

## Getting started

### Prerequisites

- Node.js 22 or newer (CI uses Node 22)
- npm

### Install and run

```bash
git clone https://github.com/brown2020/gameoflife.git
cd gameoflife
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment variables

None. The app does not read a project `.env` file. `next.config.mjs` checks `NODE_ENV`, which Next.js sets itself, and adds `'unsafe-eval'` to the content security policy only when that value is not `production`. No secret or `NEXT_PUBLIC_*` variable is required to build or run.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript 7 (`tsc --noEmit`) |
| `npm test` | Vitest (single run) |
| `npm run test:watch` | Vitest watch mode |

## Testing and CI

- Unit tests cover the Conway step (including a grid smaller than the requested bounds), pattern centering, stroke lines, speed-slider bounds, the keyboard-shortcut guard, response headers, and the absence of API routes or `"use server"` actions.
- GitHub Actions (`.github/workflows/ci.yml`) runs on pushes and pull requests to `dev` and `main`: install, lint, typecheck, test, build. The workflow does not inject secrets.

## Deployment

Suitable for any Next.js host, including Vercel. The production build succeeds with no secrets.

## Contributing

1. Work on the `dev` branch. Promotion to `main` happens after QA.
2. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` before pushing.
3. Keep simulation rules in `src/utils/` so they stay testable without the UI.

## License

GNU Affero General Public License v3.0. See [LICENSE.md](LICENSE.md).

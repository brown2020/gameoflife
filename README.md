# Game of Life

An interactive, client-only implementation of Conway's Game of Life. Draw on a canvas grid, load classic patterns, and watch cellular automata evolve in the browser. No accounts, backends, or API keys required.

**Live demo:** [https://ignitegameoflife.vercel.app](https://ignitegameoflife.vercel.app)

## Features

- Canvas-based grid with pointer, draw, and eraser tools
- Play / pause / single-step simulation with adjustable speed
- Zoom in and out; responsive grid sizing
- Built-in patterns: spaceships (Glider, LWSS), oscillators (Pulsar, Pentadecathlon, Toad, Beacon), guns (Gosper Glider Gun), and methuselahs (Diehard, R-pentomino)
- Random fill and clear
- Keyboard shortcuts: Space (play/pause), C (clear), R (random), S (step), +/- (zoom)
- Tutorial and rules modals
- Generation counter and pattern info panel

## Tech stack

| Technology | Version (range in package.json) |
| --- | --- |
| Next.js (App Router) | ^16.3.6 |
| React / React DOM | ^19.3.0 |
| TypeScript | ^6.0.3 |
| Tailwind CSS | ^4.3.3 |
| Vitest | ^3.2.4 |
| ESLint | ^10.11.0 |

This is a fully client-side app: no Firebase, Stripe, or server API routes.

## Project structure

```
src/
  app/                 # Next.js App Router (layout, page, globals.css)
  components/          # GameComponent, GridCanvas, Controls, modals, UI
  constants/           # Grid size, speed, colors, tools
  hooks/               # useGameOfLife, useKeyboardShortcuts
  types/               # Grid / CellState / Tool types
  utils/               # Pure simulation, grid helpers, patterns
tests/                 # Vitest: simulation + client-only route check
.github/workflows/     # CI (lint, typecheck, test, build)
docs/                  # Architecture notes
```

## Getting started

### Prerequisites

- Node.js 22+ (CI uses Node 22)
- npm

### Install and run

```bash
git clone https://github.com/brown2020/gameoflife.git
cd gameoflife
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

No environment variables are required. The app does not read `process.env` for runtime config.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm test` | Vitest (single run) |
| `npm run test:watch` | Vitest watch mode |

## Testing and CI

- Unit tests cover pure simulation logic and assert there are no API route handlers or `"use server"` actions under `src/app`.
- GitHub Actions (`.github/workflows/ci.yml`) runs on pushes and PRs to `dev` and `main`: install → lint → typecheck → test → build.

## Deployment

Suitable for any Next.js host (e.g. Vercel). No secrets or server env vars are needed for the current client-only build.

## Contributing

1. Work on the `dev` branch.
2. Keep changes focused; run `npm run lint`, `npm run typecheck`, and `npm test` before opening a PR.
3. Prefer pure simulation utilities in `src/utils/` over mixing logic into UI components.

## License

GNU Affero General Public License v3.0 — see [LICENSE.md](LICENSE.md).

# Agent notes — Game of Life

## Product
Client-only Conway's Game of Life on Next.js App Router. No auth, no server
actions, no API routes, no `NEXT_PUBLIC_*` secrets. Grid state lives in
`useGameOfLife` (React state); durable server state is intentionally empty —
reload returns the static prerendered empty board.

## Architecture
- `src/app/page.tsx` → `GameComponent` (client)
- `useGameOfLife` owns grid, generation, run loop
- `src/utils/simulation.ts` — pure `stepSimulation` / `resizeGrid`
- `GridCanvas` — canvas render + pointer/draw/eraser
- `Controls` / modals — UI chrome

## Critical paths
paint_toggle_cell, draw_drag, run_simulation, load_pattern, clear_grid

## Commands
`npm run lint` · `npm run typecheck` · `npm test` · `npm run build`

## CI
`.github/workflows/ci.yml` — lint, typecheck, test, build. No client secrets.
If env is added later, use `${{ secrets.* }}` only in workflows.

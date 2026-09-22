# Architecture

## Map
```
Browser
  └─ Next.js App Router (static /)
       └─ GameComponent (client)
            ├─ Controls (tools, pattern, start/stop, zoom)
            ├─ GridCanvas (canvas mutation surface)
            ├─ InfoPanel / TutorialModal / RulesModal
            └─ useGameOfLife
                 ├─ React state: grid, generation, isRunning, sizes
                 └─ utils/simulation.stepSimulation (pure)
```

## Authority per write
| Path | Fact | Writer | Cache / durability |
| --- | --- | --- | --- |
| paint_toggle_cell | cell alive/dead | toggleCell → setGrid | React state only |
| draw_drag | painted cells | setCell while dragging | React state only |
| run_simulation | next generation grid | stepSimulation → setGrid | React state only |
| load_pattern | pattern cells | setPattern | React state only |
| clear_grid | empty grid | clearGrid | React state only |

No server cache. Reload discards client state (product contract).

## Server / client
All interactive code is client (`"use client"`). No route handlers. Unauthorized
`/api/*` returns Next 404 — there is no privileged mutation surface.

## Change exercises
1. **Data:** change `NEIGHBOR_OFFSETS` / birth rule in `simulation.ts` — only
   simulation + its tests change.
2. **Access:** adding a future `/api/save` would require a new route file and
   explicit auth; today access is "everyone can mutate local state; nobody can
   mutate server state" proven by absent routes + 404.

# Game of Life — spec

Client-only Conway's Game of Life on the Next.js App Router. This document describes the behavior that is implemented on `dev`.

## Product

A visitor opens `/` and gets a dark, static page with a toolbar, a pattern note, and a canvas grid. All interaction runs in the browser. Reloading the page returns the prerendered empty board. Nothing is saved on a server.

There is no account system, no API route, no server action, and no database.

## Simulation

- A cell is alive (`1`) or dead (`0`).
- Each generation uses the eight surrounding cells.
- A live cell with fewer than 2 or more than 3 neighbors dies.
- A live cell with 2 or 3 neighbors stays alive.
- A dead cell with exactly 3 neighbors becomes alive.
- Edges are hard. Cells outside the grid are not neighbors. There is no wraparound.
- `stepSimulation` only reads indexes that exist on the grid it was given. A stale row or column count cannot throw.
- The run loop steps from the grid stored in a ref, on `requestAnimationFrame`, when the elapsed time reaches the current delay.
- An empty board or a still life stops the run. The stop flag is written before the next frame is scheduled.
- Delay is an integer from 10 ms through 500 ms. The default is 100 ms. The slider's right end is the 10 ms delay. Moving the slider does not reset the frame clock.

## Board

- Default size before the first measure is 50 by 50. Minimum size is 5 by 5.
- After layout, rows and columns are `floor(content box / cell size)`, and never below the minimum.
- Cell size is 5 px to 30 px, stepping by 2. The default is 20 px.
- Alive cells are green (`#22c55e`), dead cells are `#111827`, grid lines are `#374151`.
- Resizing copies the overlapping top-left cells into the new grid.

## Editing

- Pointer toggles the cell under the cursor.
- Draw paints alive cells. Eraser paints dead cells.
- A stroke paints every cell on the line from the previous sample to the current one.
- Pointer capture follows the gesture, including touch. The canvas sets `touch-action: none`.
- The canvas is focusable (`role="application"`). Arrow keys move a cursor. Enter or Space edits that cell with the active tool and does not start the simulation.

## Patterns

Patterns are stored as absolute coordinates and centered by their bounding box when loaded.

| Name | Kind |
| --- | --- |
| Glider, LWSS | Spaceships |
| Pulsar, Pentadecathlon, Toad, Beacon | Oscillators |
| GosperGliderGun | Gun |
| Diehard, RPentomino | Methuselahs |

Loading a pattern stops the simulation and resets the generation counter. Cells that still fall outside the board are omitted, and the info panel states how many were clipped. Random fill uses about 30% alive cells and labels the panel "Random". Clear empties the current grid and clears the label and notice.

## Chrome

- Sticky toolbar: brand, tool, pattern select, start/stop, step, clear, random, generation, speed, zoom, tutorial, rules. The rows wrap on a narrow viewport.
- Step is disabled while the simulation is running.
- Keyboard shortcuts, when focus is not in a field, the canvas, or an open dialog: Space play/pause, C clear, R random, S step (only while paused), +/= zoom in, -/_ zoom out.
- Tutorial is a five-step dialog. Rules lists the four Conway rules and how to use the board. Escape or the backdrop closes the dialog.
- The info panel shows the active pattern's description, or a short intro when nothing is selected.

## Security and delivery

- Responses disable `X-Powered-By` and send `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, a locked-down `Permissions-Policy`, and a Content-Security-Policy limited to `'self'` plus the inline script and style Next.js emits. `frame-ancestors` is `'none'`.
- In non-production, the script policy also allows `'unsafe-eval'` so the dev server can run. Production does not.
- The build does not read secrets. The only `process.env` read is `NODE_ENV` inside `next.config.mjs`.
- CI installs with `npm ci` and runs lint, typecheck, test, and build on Node 22. The workflow token is read-only.

## Tests that lock this in

- Blinker, block still life, lone-cell death, and a step whose requested size is larger than the array.
- Resize keeps the overlapping cells.
- `fitGridDimensions` stays inside a measured content box.
- A straight stroke includes every cell between the endpoints.
- A pattern whose stored coordinates sit outside a small grid is centered with no clip; a pattern wider than the grid reports the clipped cells.
- Every slider position maps to a delay inside 10–500 ms, and the fast end is 10 ms.
- Shortcut guard: open dialog, canvas, and inputs are ignored; a plain button is not.
- Header policy and `.gitignore` coverage for `.env`.
- `src/app` has no route handlers and the page is not a server action.

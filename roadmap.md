# Roadmap

Punchlist after the October 28, 2026 maintenance pass. The GitHub issue list and open pull requests were empty when this was written. Nothing below is assigned.

## Next

1. Fit large patterns instead of clipping them. The Gosper glider gun is wider than a phone-width board, so the centered copy drops cells and the gun does not run. Offer zoom-to-fit, a scrollable board, or a scaled-down placement, and keep the clip notice until the whole pattern is visible.
2. Make the info-panel generation counts honest on a finite board. Diehard is described as dying at generation 130 and the R-pentomino as running 1103 generations. Those figures are for an open grid. On this board they hit the edge sooner. Say that in the copy, or run them only when the margin is large enough.
3. Add undo for paint, clear, and pattern load. A mistaken C or Random currently throws the drawing away.
4. Persist the board in `localStorage` so a reload keeps the grid, tool, and delay. The current contract is that reload shows the empty prerender. Do this only if that contract should change.
5. Optional torus edges, behind an explicit control, so spaceships are not deleted by the border.
6. Import and export a plain-text pattern (RLE or a coordinate list) without adding a backend.
7. Replace `'unsafe-inline'` in the content security policy with per-request nonces once Next.js can emit them for this app without a secret.

## Known limits

- The minimum board is 5 by 5. A content box smaller than `5 * cellSize` can still scroll or clip, because the floor size is not allowed to go below that minimum.
- The fastest delay is 10 ms, but a frame only runs once per animation frame, so the board cannot actually step faster than the display.
- Pentadecathlon is stored as two oscillators side by side. On a large board they do not interfere. On a short board the lower copy can hit the edge.
- Pattern text is static. There is no editor for the description strings.
- There is no automated browser test. Unit tests cover the pure helpers and the header policy. Resize-while-running, touch strokes, and the modal shortcut guard were checked by hand against a production build.
- `typescript-eslint` 8.72.1 rejects TypeScript 7. Lint and Next's programmatic check use `@typescript/typescript6` (6.0.2). `npm run typecheck` uses the TypeScript 7.0.2 `tsc`. Drop the alias when typescript-eslint supports TypeScript 7.

## Not in this repo

- No open GitHub issues.
- No Firebase, Stripe, or AI provider. No model IDs to rotate.
- No environment variables to provision. Do not add a secret to the build unless a later feature reads it at runtime and the production build still succeeds when it is unset.

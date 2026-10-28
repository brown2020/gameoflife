import React, { useRef, useEffect, useCallback, useState, memo } from "react";
import { Grid, Tool, CellState } from "@/types/game";
import { COLORS } from "@/constants/game";
import { cellsAlongLine, isInBounds } from "@/utils/grid";

/** Cursor styles mapped by tool type (defined outside component to avoid recreation) */
const CURSOR_BY_TOOL: Record<Tool, string> = {
  pointer: "cursor-pointer",
  draw: "cursor-crosshair",
  eraser: "cursor-cell",
};

const CURSOR_COLOR = "#fbbf24";

interface GridCanvasProps {
  grid: Grid;
  cellSize: number;
  numRows: number;
  numCols: number;
  onToggleCell: (row: number, col: number) => void;
  onSetCell: (row: number, col: number, value: CellState) => void;
  tool: Tool;
}

type CellCoord = { r: number; c: number };

export const GridCanvas = memo<GridCanvasProps>(
  ({ grid, cellSize, numRows, numCols, onToggleCell, onSetCell, tool }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const draggingRef = useRef(false);
    const lastPaintedRef = useRef<CellCoord | null>(null);
    const cursorRef = useRef<CellCoord>({ r: 0, c: 0 });
    const [cursor, setCursor] = useState<CellCoord>({ r: 0, c: 0 });
    const [isGridFocused, setIsGridFocused] = useState(false);

    const paintValueRef = useRef<CellState>(tool === "draw" ? 1 : 0);
    useEffect(() => {
      paintValueRef.current = tool === "draw" ? 1 : 0;
    }, [tool]);

    useEffect(() => {
      ctxRef.current = canvasRef.current?.getContext("2d") ?? null;
    }, []);

    useEffect(() => {
      const next = {
        r: Math.min(cursorRef.current.r, Math.max(0, numRows - 1)),
        c: Math.min(cursorRef.current.c, Math.max(0, numCols - 1)),
      };
      if (next.r === cursorRef.current.r && next.c === cursorRef.current.c) {
        return;
      }
      cursorRef.current = next;
      setCursor(next);
    }, [numRows, numCols]);

    const renderGrid = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const width = numCols * cellSize;
      const height = numRows * cellSize;

      ctx.fillStyle = COLORS.CELL_DEAD;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = COLORS.CELL_ALIVE;
      ctx.beginPath();
      for (let i = 0; i < numRows; i++) {
        const row = grid[i];
        if (!row) continue;
        for (let j = 0; j < numCols; j++) {
          if (row[j]) {
            ctx.rect(j * cellSize, i * cellSize, cellSize, cellSize);
          }
        }
      }
      ctx.fill();

      ctx.strokeStyle = COLORS.GRID_LINE;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= width; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      if (isGridFocused) {
        ctx.strokeStyle = CURSOR_COLOR;
        ctx.lineWidth = 2;
        ctx.strokeRect(
          cursor.c * cellSize + 1,
          cursor.r * cellSize + 1,
          Math.max(1, cellSize - 2),
          Math.max(1, cellSize - 2)
        );
      }
    }, [grid, cellSize, numRows, numCols, cursor, isGridFocused]);

    useEffect(() => {
      renderGrid();
    }, [renderGrid]);

    const getGridCoordinates = useCallback(
      (event: { clientX: number; clientY: number }): CellCoord | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return null;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        const r = Math.floor(y / cellSize);
        const c = Math.floor(x / cellSize);

        if (isInBounds(r, c, numRows, numCols)) {
          return { r, c };
        }
        return null;
      },
      [cellSize, numRows, numCols]
    );

    const paintLine = useCallback(
      (from: CellCoord | null, to: CellCoord) => {
        const cells = from
          ? cellsAlongLine(from.r, from.c, to.r, to.c)
          : [to];
        const value = paintValueRef.current;
        for (const cell of cells) {
          onSetCell(cell.r, cell.c, value);
        }
        lastPaintedRef.current = to;
      },
      [onSetCell]
    );

    const handlePointerDown = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (event.button !== 0) return;
        const coords = getGridCoordinates(event);
        if (!coords) return;

        event.currentTarget.focus({ preventScroll: true });
        cursorRef.current = coords;
        setCursor(coords);

        if (tool === "pointer") {
          onToggleCell(coords.r, coords.c);
          return;
        }

        event.currentTarget.setPointerCapture(event.pointerId);
        draggingRef.current = true;
        paintLine(null, coords);
      },
      [tool, getGridCoordinates, onToggleCell, paintLine]
    );

    const handlePointerMove = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        if (tool === "pointer" || !draggingRef.current) return;

        const coords = getGridCoordinates(event);
        if (!coords) return;
        if (
          lastPaintedRef.current?.r === coords.r &&
          lastPaintedRef.current?.c === coords.c
        ) {
          return;
        }

        paintLine(lastPaintedRef.current, coords);
      },
      [tool, getGridCoordinates, paintLine]
    );

    const handlePointerEnd = useCallback(
      (event: React.PointerEvent<HTMLCanvasElement>) => {
        draggingRef.current = false;
        lastPaintedRef.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
          event.currentTarget.releasePointerCapture(event.pointerId);
        }
      },
      []
    );

    const editCursorCell = useCallback(() => {
      const { r, c } = cursorRef.current;
      if (!isInBounds(r, c, numRows, numCols)) return;
      if (tool === "pointer") {
        onToggleCell(r, c);
        return;
      }
      onSetCell(r, c, paintValueRef.current);
    }, [numRows, numCols, tool, onToggleCell, onSetCell]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLCanvasElement>) => {
        const key = event.key;
        if (
          key !== "ArrowUp" &&
          key !== "ArrowDown" &&
          key !== "ArrowLeft" &&
          key !== "ArrowRight" &&
          key !== "Enter" &&
          key !== " "
        ) {
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (key === "Enter" || key === " ") {
          editCursorCell();
          return;
        }

        const delta =
          key === "ArrowUp"
            ? { r: -1, c: 0 }
            : key === "ArrowDown"
              ? { r: 1, c: 0 }
              : key === "ArrowLeft"
                ? { r: 0, c: -1 }
                : { r: 0, c: 1 };
        const next = {
          r: Math.min(numRows - 1, Math.max(0, cursorRef.current.r + delta.r)),
          c: Math.min(numCols - 1, Math.max(0, cursorRef.current.c + delta.c)),
        };
        cursorRef.current = next;
        setCursor(next);
      },
      [editCursorCell, numRows, numCols]
    );

    return (
      <canvas
        ref={canvasRef}
        width={numCols * cellSize}
        height={numRows * cellSize}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsGridFocused(true)}
        onBlur={() => setIsGridFocused(false)}
        className={`${CURSOR_BY_TOOL[tool]} touch-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400`}
        role="application"
        aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight Enter Space"
        aria-label={`Game of Life grid, ${numRows} by ${numCols} cells, ${tool} tool. Arrow keys move the cursor. Enter or Space edits the focused cell.`}
      />
    );
  }
);

GridCanvas.displayName = "GridCanvas";

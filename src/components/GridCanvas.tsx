import React, { useRef, useEffect, useCallback, useState, memo } from "react";
import { Grid, Tool, CellState } from "@/types/game";
import { COLORS } from "@/constants/game";
import { isInBounds } from "@/utils/grid";

/** Cursor styles mapped by tool type (defined outside component to avoid recreation) */
const CURSOR_BY_TOOL: Record<Tool, string> = {
  pointer: "cursor-pointer",
  draw: "cursor-crosshair",
  eraser: "cursor-cell",
};

interface GridCanvasProps {
  grid: Grid;
  cellSize: number;
  numRows: number;
  numCols: number;
  onToggleCell: (row: number, col: number) => void;
  onSetCell: (row: number, col: number, value: CellState) => void;
  tool: Tool;
}

export const GridCanvas = memo<GridCanvasProps>(
  ({ grid, cellSize, numRows, numCols, onToggleCell, onSetCell, tool }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const lastPaintedRef = useRef<{ r: number; c: number } | null>(null);

    // Derive paint value from tool (stable reference via ref)
    const paintValueRef = useRef<CellState>(tool === "draw" ? 1 : 0);
    paintValueRef.current = tool === "draw" ? 1 : 0;

    // Cache 2D context on mount and when canvas changes
    useEffect(() => {
      ctxRef.current = canvasRef.current?.getContext("2d") ?? null;
    }, []);

    // Optimized batched rendering
    const renderGrid = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      const width = numCols * cellSize;
      const height = numRows * cellSize;

      // Fill background (dead cells) in one call
      ctx.fillStyle = COLORS.CELL_DEAD;
      ctx.fillRect(0, 0, width, height);

      // Batch all alive cells into a single path
      ctx.fillStyle = COLORS.CELL_ALIVE;
      ctx.beginPath();
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          if (grid[i][j]) {
            ctx.rect(j * cellSize, i * cellSize, cellSize, cellSize);
          }
        }
      }
      ctx.fill();

      // Draw grid lines in two batched operations
      ctx.strokeStyle = COLORS.GRID_LINE;
      ctx.beginPath();
      // Vertical lines
      for (let x = 0; x <= width; x += cellSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      // Horizontal lines
      for (let y = 0; y <= height; y += cellSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    }, [grid, cellSize, numRows, numCols]);

    useEffect(() => {
      renderGrid();
    }, [renderGrid]);

    const getGridCoordinates = useCallback(
      (
        event: React.MouseEvent<HTMLCanvasElement>
      ): { r: number; c: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;

        const rect = canvas.getBoundingClientRect();
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

    const handleMouseDown = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement>) => {
        const coords = getGridCoordinates(event);
        if (!coords) return;

        const { r, c } = coords;

        if (tool === "pointer") {
          onToggleCell(r, c);
          return;
        }

        // Draw or Eraser mode
        setIsDragging(true);
        onSetCell(r, c, paintValueRef.current);
        lastPaintedRef.current = { r, c };
      },
      [tool, getGridCoordinates, onToggleCell, onSetCell]
    );

    const handleMouseMove = useCallback(
      (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (tool === "pointer" || !isDragging) return;

        const coords = getGridCoordinates(event);
        if (!coords) return;

        const { r, c } = coords;

        // Skip if same cell as last painted
        if (
          lastPaintedRef.current?.r === r &&
          lastPaintedRef.current?.c === c
        ) {
          return;
        }

        onSetCell(r, c, paintValueRef.current);
        lastPaintedRef.current = { r, c };
      },
      [tool, isDragging, getGridCoordinates, onSetCell]
    );

    // Combined handler for mouse up and leave (identical behavior)
    const handleMouseEnd = useCallback(() => {
      setIsDragging(false);
      lastPaintedRef.current = null;
    }, []);

    return (
      <canvas
        ref={canvasRef}
        width={numCols * cellSize}
        height={numRows * cellSize}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseEnd}
        onMouseLeave={handleMouseEnd}
        className={CURSOR_BY_TOOL[tool]}
      />
    );
  }
);

GridCanvas.displayName = "GridCanvas";

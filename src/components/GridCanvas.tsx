import React, { useRef, useEffect, useCallback, useState, memo } from "react";
import { Grid, Tool } from "@/types/game";
import { COLORS } from "@/constants/game";

interface GridCanvasProps {
  grid: Grid;
  cellSize: number;
  numRows: number;
  numCols: number;
  onToggleCell: (row: number, col: number) => void;
  onSetCell: (row: number, col: number, value: number) => void;
  tool: Tool;
}

export const GridCanvas = memo<GridCanvasProps>(
  ({ grid, cellSize, numRows, numCols, onToggleCell, onSetCell, tool }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [paintValue, setPaintValue] = useState(1);
    const lastPaintedRef = useRef<{ r: number; c: number } | null>(null);

    // Cache 2D context on mount and when canvas changes
    useEffect(() => {
      ctxRef.current = canvasRef.current?.getContext("2d") ?? null;
    }, []);

    const renderGrid = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = ctxRef.current;
      if (!canvas || !ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Pre-set styles for better performance
      const aliveColor = COLORS.CELL_ALIVE;
      const deadColor = COLORS.CELL_DEAD;
      const gridColor = COLORS.GRID_LINE;

      // Draw cells
      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          const x = j * cellSize;
          const y = i * cellSize;

          // Fill cell (solid color for performance)
          ctx.fillStyle = grid[i][j] ? aliveColor : deadColor;
          ctx.fillRect(x, y, cellSize, cellSize);

          // Draw border
          ctx.strokeStyle = gridColor;
          ctx.strokeRect(x, y, cellSize, cellSize);
        }
      }
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

        if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
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
        const valueToSet = tool === "draw" ? 1 : 0;
        setIsDragging(true);
        setPaintValue(valueToSet);
        onSetCell(r, c, valueToSet);
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

        onSetCell(r, c, paintValue);
        lastPaintedRef.current = { r, c };
      },
      [tool, isDragging, getGridCoordinates, onSetCell, paintValue]
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
        className="cursor-pointer"
      />
    );
  }
);

GridCanvas.displayName = "GridCanvas";

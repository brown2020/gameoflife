import React, { useRef, useEffect, useCallback, useState } from "react";
import { Grid } from "@/hooks/useGameOfLife";

interface GridCanvasProps {
    grid: Grid;
    cellSize: number;
    numRows: number;
    numCols: number;
    onToggleCell: (row: number, col: number) => void;
    onSetCell: (row: number, col: number, value: number) => void;
    tool: "pointer" | "draw" | "eraser";
}

export const GridCanvas: React.FC<GridCanvasProps> = ({
    grid,
    cellSize,
    numRows,
    numCols,
    onToggleCell,
    onSetCell,
    tool,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [paintValue, setPaintValue] = useState<number>(1); // 1 for alive, 0 for dead
    const lastPaintedRef = useRef<{ r: number; c: number } | null>(null);

    const renderGrid = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw the grid
        for (let i = 0; i < numRows; i++) {
            for (let j = 0; j < numCols; j++) {
                // Fill cell with gradient for live cells
                if (grid[i][j]) {
                    const gradient = ctx.createRadialGradient(
                        j * cellSize + cellSize / 2,
                        i * cellSize + cellSize / 2,
                        0,
                        j * cellSize + cellSize / 2,
                        i * cellSize + cellSize / 2,
                        cellSize / 1.5
                    );
                    gradient.addColorStop(0, "#4ade80");
                    gradient.addColorStop(1, "#22c55e");
                    ctx.fillStyle = gradient;
                } else {
                    ctx.fillStyle = "#111827";
                }
                ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);

                // Draw cell border
                ctx.strokeStyle = "#374151";
                ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
            }
        }
    }, [grid, cellSize, numRows, numCols]);

    useEffect(() => {
        renderGrid();
    }, [renderGrid]);

    const getGridCoordinates = (
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
    };

    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const coords = getGridCoordinates(event);
        if (!coords) return;

        const { r, c } = coords;

        if (tool === "pointer") {
            // Pointer mode: just toggle on click, no drag painting
            onToggleCell(r, c);
            return;
        }

        // Draw or Eraser mode
        const valueToSet = tool === "draw" ? 1 : 0;

        setIsDragging(true);
        setPaintValue(valueToSet);
        onSetCell(r, c, valueToSet);
        lastPaintedRef.current = { r, c };
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        // Pointer mode doesn't drag-paint
        if (tool === "pointer") return;

        if (!isDragging) return;

        const coords = getGridCoordinates(event);
        if (!coords) return;

        const { r, c } = coords;

        // Avoid repainting the same cell repeatedly in one move
        if (
            lastPaintedRef.current &&
            lastPaintedRef.current.r === r &&
            lastPaintedRef.current.c === c
        ) {
            return;
        }

        onSetCell(r, c, paintValue);
        lastPaintedRef.current = { r, c };
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        lastPaintedRef.current = null;
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        lastPaintedRef.current = null;
    };

    return (
        <canvas
            ref={canvasRef}
            width={numCols * cellSize}
            height={numRows * cellSize}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="cursor-pointer"
        />
    );
};

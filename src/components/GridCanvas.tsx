import React, { useRef, useEffect, useCallback } from "react";
import { Grid } from "@/hooks/useGameOfLife";

interface GridCanvasProps {
    grid: Grid;
    cellSize: number;
    numRows: number;
    numCols: number;
    onToggleCell: (row: number, col: number) => void;
}

export const GridCanvas: React.FC<GridCanvasProps> = ({
    grid,
    cellSize,
    numRows,
    numCols,
    onToggleCell,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;

        const i = Math.floor(y / cellSize);
        const j = Math.floor(x / cellSize);

        onToggleCell(i, j);
    };

    return (
        <canvas
            ref={canvasRef}
            width={numCols * cellSize}
            height={numRows * cellSize}
            onClick={handleCanvasClick}
            className="cursor-pointer"
        />
    );
};

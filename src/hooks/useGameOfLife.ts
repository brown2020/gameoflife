import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { patterns, Pattern } from "@/utils/patterns";

const DEFAULT_ROWS = 50;
const DEFAULT_COLS = 50;
const DEFAULT_CELL_SIZE = 20;

// Type for the grid: a 2D array of numbers
export type Grid = number[][];

// Helper to create an empty grid with given dimensions
const createEmptyGrid = (rows: number, cols: number): Grid => {
    return Array.from({ length: rows }, () => Array(cols).fill(0));
};

export const useGameOfLife = () => {
    const [grid, setGrid] = useState<Grid>(() =>
        createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS)
    );
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [generation, setGeneration] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(100);
    const [cellSize, setCellSize] = useState<number>(DEFAULT_CELL_SIZE);
    const [numRows, setNumRows] = useState<number>(DEFAULT_ROWS);
    const [numCols, setNumCols] = useState<number>(DEFAULT_COLS);
    const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
    const [activeLabel, setActiveLabel] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);

    // Memoize the operations array
    const operations = useMemo(
        () => [
            [0, 1],
            [0, -1],
            [1, -1],
            [-1, 1],
            [1, 1],
            [-1, -1],
            [1, 0],
            [-1, 0],
        ],
        []
    );

    // Define the runSimulation function
    const runSimulation = useCallback(() => {
        setGrid((currentGrid) => {
            // Find the boundaries of live cells
            let minRow = numRows,
                maxRow = 0,
                minCol = numCols,
                maxCol = 0;
            let hasLiveCells = false;

            for (let i = 0; i < numRows; i++) {
                for (let j = 0; j < numCols; j++) {
                    if (currentGrid[i][j]) {
                        hasLiveCells = true;
                        minRow = Math.min(minRow, i);
                        maxRow = Math.max(maxRow, i);
                        minCol = Math.min(minCol, j);
                        maxCol = Math.max(maxCol, j);
                    }
                }
            }

            if (!hasLiveCells) {
                setIsRunning(false);
                return currentGrid;
            }

            // Add a buffer around the active area
            minRow = Math.max(0, minRow - 1);
            maxRow = Math.min(numRows - 1, maxRow + 1);
            minCol = Math.max(0, minCol - 1);
            maxCol = Math.min(numCols - 1, maxCol + 1);

            // Create a new grid by copying the current one
            const newGrid = currentGrid.map((row) => [...row]);

            // Only process cells within the active area
            for (let i = minRow; i <= maxRow; i++) {
                for (let j = minCol; j <= maxCol; j++) {
                    let neighbors = 0;
                    operations.forEach(([x, y]) => {
                        const newI = i + x;
                        const newJ = j + y;
                        if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                            neighbors += currentGrid[newI][newJ];
                        }
                    });

                    if (neighbors < 2 || neighbors > 3) {
                        newGrid[i][j] = 0;
                    } else if (currentGrid[i][j] === 0 && neighbors === 3) {
                        newGrid[i][j] = 1;
                    }
                }
            }

            // Check if the grid has changed
            let isGridSame = true;
            for (let i = minRow; i <= maxRow && isGridSame; i++) {
                for (let j = minCol; j <= maxCol && isGridSame; j++) {
                    if (currentGrid[i][j] !== newGrid[i][j]) {
                        isGridSame = false;
                        break;
                    }
                }
            }

            if (isGridSame) {
                setIsRunning(false);
            } else {
                setGeneration((prev) => prev + 1);
            }

            return newGrid;
        });
    }, [operations, numRows, numCols]);

    // Step simulation
    const stepSimulation = useCallback(() => {
        runSimulation();
    }, [runSimulation]);

    // Clear the grid
    const clearGrid = useCallback((): void => {
        setGrid(createEmptyGrid(numRows, numCols));
        setIsRunning(false);
        setGeneration(0);
        setSelectedPattern(null);
        setActiveLabel(null);
    }, [numRows, numCols]);

    // Random grid generation
    const generateRandomGrid = useCallback(() => {
        const newGrid = createEmptyGrid(numRows, numCols).map((row) =>
            row.map(() => (Math.random() > 0.7 ? 1 : 0))
        );
        setGrid(newGrid);
        setGeneration(0);
        setSelectedPattern(null);
        setActiveLabel("Random");
    }, [numRows, numCols]);

    // Set pattern
    const setPattern = useCallback(
        (patternName: string) => {
            const source: Pattern = patterns[patternName];
            if (!source) return;

            const newGrid = createEmptyGrid(numRows, numCols);

            // For coordinate-based patterns
            source.forEach(([r, c]) => {
                if (r >= 0 && r < numRows && c >= 0 && c < numCols) {
                    newGrid[r][c] = 1;
                }
            });

            setGrid(newGrid);
            setIsRunning(false);
            setSelectedPattern(patternName);
            setActiveLabel(patternName);
            setGeneration(0);
        },
        [numRows, numCols]
    );

    // Toggle cell
    const toggleCell = useCallback(
        (i: number, j: number) => {
            if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
                setGrid((prev) => {
                    const newGrid = prev.map((row, rowIndex) =>
                        row.map((cell, colIndex) =>
                            rowIndex === i && colIndex === j ? (cell ? 0 : 1) : cell
                        )
                    );
                    return newGrid;
                });
            }
        },
        [numRows, numCols]
    );

    // Set cell to specific value
    const setCell = useCallback(
        (i: number, j: number, value: number) => {
            if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
                setGrid((prev) => {
                    // Optimization: don't update if value is same
                    if (prev[i][j] === value) return prev;

                    const newGrid = prev.map((row, rowIndex) =>
                        row.map((cell, colIndex) =>
                            rowIndex === i && colIndex === j ? value : cell
                        )
                    );
                    return newGrid;
                });
            }
        },
        [numRows, numCols]
    );

    // Zoom
    const handleZoom = useCallback((zoomIn: boolean) => {
        setCellSize((prev) => {
            const newSize = zoomIn ? prev + 2 : prev - 2;
            return Math.max(5, Math.min(30, newSize));
        });
    }, []);

    // Resize grid to container
    const resizeGridToContainer = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        const { width, height } = container.getBoundingClientRect();
        const nextCols = Math.max(5, Math.ceil(width / cellSize));
        const nextRows = Math.max(5, Math.ceil(height / cellSize));
        if (nextCols === numCols && nextRows === numRows) return;

        setNumCols(nextCols);
        setNumRows(nextRows);

        setGrid((prev) => {
            const newGrid = createEmptyGrid(nextRows, nextCols);
            const copyRows = Math.min(prev.length, nextRows);
            const copyCols = Math.min(prev[0]?.length ?? 0, nextCols);
            for (let i = 0; i < copyRows; i++) {
                for (let j = 0; j < copyCols; j++) {
                    newGrid[i][j] = prev[i][j];
                }
            }
            return newGrid;
        });
    }, [cellSize, numCols, numRows]);

    // Simulation loop
    useEffect(() => {
        if (isRunning) {
            const id = setInterval(runSimulation, speed);
            return () => clearInterval(id);
        }
    }, [isRunning, runSimulation, speed]);

    // Resize observer
    useEffect(() => {
        resizeGridToContainer();
        const handleResize = () => resizeGridToContainer();
        window.addEventListener("resize", handleResize);

        let observer: ResizeObserver | null = null;
        const el = containerRef.current;

        if (el && typeof ResizeObserver !== "undefined") {
            observer = new ResizeObserver(() => resizeGridToContainer());
            observer.observe(el);
        }

        return () => {
            window.removeEventListener("resize", handleResize);
            if (observer && el) observer.disconnect();
        };
    }, [resizeGridToContainer]);

    return {
        grid,
        isRunning,
        setIsRunning,
        generation,
        setGeneration,
        speed,
        setSpeed,
        cellSize,
        handleZoom,
        selectedPattern,
        activeLabel,
        setPattern,
        stepSimulation,
        clearGrid,
        generateRandomGrid,
        toggleCell,
        setCell,
        containerRef,
        numRows,
        numCols,
    };
};

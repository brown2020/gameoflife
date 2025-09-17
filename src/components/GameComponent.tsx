"use client";

import { patterns } from "@/utils/patterns";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

const cellSize = 20; // Size of each cell in pixels
const DEFAULT_ROWS = 50;
const DEFAULT_COLS = 50;

// Type for the grid: a 2D array of numbers
type Grid = number[][];

// Helper to create an empty grid with given dimensions
const createEmptyGrid = (rows: number, cols: number): Grid => {
  return Array.from({ length: rows }, () => Array(cols).fill(0));
};

const GameComponent: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(() =>
    createEmptyGrid(DEFAULT_ROWS, DEFAULT_COLS)
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [tutorialStep, setTutorialStep] = useState<number>(1);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [generation, setGeneration] = useState<number>(0);
  const [activeLabel, setActiveLabel] = useState<string | null>(null);
  const [numRows, setNumRows] = useState<number>(DEFAULT_ROWS);
  const [numCols, setNumCols] = useState<number>(DEFAULT_COLS);

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

  // Add pattern information dictionary
  const patternInfo: { [key: string]: string } = {
    Glider:
      "A small pattern that moves diagonally across the grid. One of the first spaceships discovered.",
    LWSS: "Lightweight Spaceship - moves horizontally across the grid. Discovered by John Conway in 1970.",
    Pulsar:
      "A period-3 oscillator that creates a symmetric pattern. One of the most common oscillators.",
    GosperGliderGun:
      "Created by Bill Gosper in 1970, it produces a continuous stream of gliders. The first known pattern with unbounded growth.",
    Diehard:
      "A methuselah pattern that disappears after 130 generations. Created by Dean Hickerson in 1991.",
    Pentadecathlon:
      "A period-15 oscillator discovered by John Conway. One of the most natural oscillators.",
    Toad: "A simple period-2 oscillator that alternates between two states. One of the first oscillators discovered.",
    Beacon:
      "A period-2 oscillator that switches between two phases. Resembles a lighthouse.",
    RPentomino:
      "One of the most active small patterns, this R-pentomino evolves for 1103 generations and produces many gliders.",
    Random:
      "Randomly generated starting grid. Each click produces a new configuration.",
  };

  // Organize patterns into categories for a cleaner navigation
  const patternCategories: Record<string, string[]> = useMemo(
    () => ({
      Spaceships: ["Glider", "LWSS"],
      Oscillators: ["Pulsar", "Pentadecathlon", "Toad", "Beacon"],
      Guns: ["GosperGliderGun"],
      Methuselahs: ["Diehard", "RPentomino"],
    }),
    []
  );

  const defaultInfoText =
    "Explore Conway's Game of Life. Select a pattern or generate a random configuration to begin.";

  // Add simulation speed control
  const [speed, setSpeed] = useState<number>(100);
  // Add grid size control
  const [cellSizeState, setCellSize] = useState<number>(cellSize);

  // Function to render the grid on canvas with improved colors
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
            j * cellSizeState + cellSizeState / 2,
            i * cellSizeState + cellSizeState / 2,
            0,
            j * cellSizeState + cellSizeState / 2,
            i * cellSizeState + cellSizeState / 2,
            cellSizeState / 1.5
          );
          gradient.addColorStop(0, "#4ade80");
          gradient.addColorStop(1, "#22c55e");
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = "#111827";
        }
        ctx.fillRect(
          j * cellSizeState,
          i * cellSizeState,
          cellSizeState,
          cellSizeState
        );

        // Draw cell border
        ctx.strokeStyle = "#374151";
        ctx.strokeRect(
          j * cellSizeState,
          i * cellSizeState,
          cellSizeState,
          cellSizeState
        );
      }
    }
  }, [grid, cellSizeState, numRows, numCols]);

  // Handle clicking on a cell to toggle its state
  const handleCanvasClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      const x = (event.clientX - rect.left) * scaleX;
      const y = (event.clientY - rect.top) * scaleY;

      const i = Math.floor(y / cellSizeState);
      const j = Math.floor(x / cellSizeState);

      if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
        const newGrid = grid.map((row, rowIndex) =>
          row.map((cell, colIndex) =>
            rowIndex === i && colIndex === j ? (cell ? 0 : 1) : cell
          )
        );
        setGrid(newGrid);
      }
    },
    [grid, cellSizeState, numRows, numCols]
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

  // Now define stepSimulation after runSimulation is defined
  const stepSimulation = useCallback(() => {
    runSimulation();
  }, [runSimulation]);

  // Add random grid generation
  const generateRandomGrid = useCallback(() => {
    const newGrid = createEmptyGrid(numRows, numCols).map((row) =>
      row.map(() => (Math.random() > 0.7 ? 1 : 0))
    );
    setGrid(newGrid);
    setGeneration(0);
    setSelectedPattern(null);
    setActiveLabel("Random");
  }, [numRows, numCols]);

  // Add zoom functionality
  const handleZoom = useCallback((zoomIn: boolean) => {
    setCellSize((prev) => {
      const newSize = zoomIn ? prev + 2 : prev - 2;
      return Math.max(5, Math.min(30, newSize));
    });
  }, []);

  // Use effect to render the grid whenever it changes
  useEffect(() => {
    renderGrid();
  }, [grid, renderGrid]);

  // Resize grid to fill available space based on container size and cell size
  const resizeGridToContainer = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { width, height } = container.getBoundingClientRect();
    const nextCols = Math.max(5, Math.ceil(width / cellSizeState));
    const nextRows = Math.max(5, Math.ceil(height / cellSizeState));
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
  }, [cellSizeState, numCols, numRows]);

  // Observe container size and window resizes
  useEffect(() => {
    resizeGridToContainer();
  }, [resizeGridToContainer]);

  useEffect(() => {
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

  // Function to handle setting a predefined pattern (fit into current grid)
  const setPattern = (patternName: string) => {
    const source = patterns[patternName];
    const newGrid = createEmptyGrid(numRows, numCols);
    const copyRows = Math.min(source.length, numRows);
    const copyCols = Math.min(source[0]?.length ?? 0, numCols);
    for (let i = 0; i < copyRows; i++) {
      for (let j = 0; j < copyCols; j++) {
        newGrid[i][j] = source[i][j];
      }
    }
    setGrid(newGrid);
    setIsRunning(false);
    setSelectedPattern(patternName);
    setActiveLabel(patternName);
    setGeneration(0);
  };

  const handlePatternChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (!value) return;
    setPattern(value);
  };

  // Clear the grid
  const clearGrid = useCallback((): void => {
    setGrid(createEmptyGrid(numRows, numCols));
    setIsRunning(false);
    setGeneration(0);
    setSelectedPattern(null);
    setActiveLabel(null);
  }, [numRows, numCols]);

  // Then update the keyboard shortcuts useEffect
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ": // Space to toggle running
          setIsRunning((prev) => !prev);
          break;
        case "c": // C to clear
          clearGrid();
          break;
        case "r": // R to random
          generateRandomGrid();
          break;
        case "s": // S to step
          if (!isRunning) stepSimulation();
          break;
        case "+": // + to zoom in
          handleZoom(true);
          break;
        case "-": // - to zoom out
          handleZoom(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRunning, stepSimulation, clearGrid, generateRandomGrid, handleZoom]);

  // Update the useEffect for the simulation interval
  useEffect(() => {
    if (isRunning) {
      const id = setInterval(runSimulation, speed);
      return () => clearInterval(id);
    }
  }, [isRunning, runSimulation, speed]);

  const infoLabel = activeLabel ?? "About";
  const infoText = activeLabel
    ? patternInfo[activeLabel] ?? defaultInfoText
    : defaultInfoText;

  return (
    <div className="min-h-screen w-screen bg-gray-900">
      <header className="sticky top-0 z-20 w-full border-b border-gray-700 bg-gray-800/80 backdrop-blur supports-[backdrop-filter]:bg-gray-800/60">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex flex-col gap-3">
            {/* Row 1: Brand/Pattern + Primary Controls */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="text-sm font-semibold tracking-wide text-white">
                  Game of Life
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="pattern" className="text-xs text-gray-300">
                    Pattern
                  </label>
                  <select
                    id="pattern"
                    value={selectedPattern ?? ""}
                    onChange={handlePatternChange}
                    className="bg-gray-700 text-white text-xs rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                    aria-label="Select pattern"
                  >
                    <option value="" disabled>
                      Choose…
                    </option>
                    {Object.entries(patternCategories).map(([group, items]) => (
                      <optgroup key={group} label={group}>
                        {items.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsRunning(!isRunning)}
                  className={`px-3 py-1.5 text-xs font-medium text-white rounded w-20 text-center ${
                    isRunning ? "bg-red-500" : "bg-green-600"
                  } hover:opacity-90`}
                  aria-label={
                    isRunning ? "Stop simulation" : "Start simulation"
                  }
                >
                  {isRunning ? "Stop" : "Start"}
                </button>
                <button
                  onClick={stepSimulation}
                  disabled={isRunning}
                  className={`px-3 py-1.5 text-xs font-medium text-white rounded ${
                    isRunning
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  }`}
                  title="Advance one generation"
                >
                  Step
                </button>
                <button
                  onClick={clearGrid}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-gray-600 rounded hover:bg-gray-500"
                >
                  Clear
                </button>
                <button
                  onClick={generateRandomGrid}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 rounded hover:bg-amber-500"
                >
                  Random
                </button>
              </div>
            </div>

            {/* Row 2: Readouts/Tuners + Help */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-200">
                  Gen: <span className="font-mono">{generation}</span>
                  {generation > 0 && (
                    <button
                      onClick={() => setGeneration(0)}
                      className="ml-2 px-1 py-0.5 text-[10px] bg-gray-600 rounded hover:bg-gray-500"
                      title="Reset generation counter"
                    >
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-300">Speed</span>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={500 - speed}
                    onChange={(e) => setSpeed(500 - parseInt(e.target.value))}
                    className="w-24 accent-blue-500"
                    aria-label="Simulation speed"
                  />
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-300">Zoom</span>
                  <button
                    onClick={() => handleZoom(false)}
                    className="px-2 py-1 text-xs font-medium text-white bg-gray-600 rounded hover:bg-gray-500"
                    title="Zoom out"
                    aria-label="Zoom out"
                  >
                    -
                  </button>
                  <span className="text-xs text-gray-300 w-10 text-center">
                    {cellSizeState}px
                  </span>
                  <button
                    onClick={() => handleZoom(true)}
                    className="px-2 py-1 text-xs font-medium text-white bg-gray-600 rounded hover:bg-gray-500"
                    title="Zoom in"
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowTutorial(true);
                    setTutorialStep(1);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-500"
                >
                  Tutorial
                </button>
                <button
                  onClick={() => setShowRules(!showRules)}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-gray-600 rounded hover:bg-gray-500"
                >
                  {showRules ? "Hide Rules" : "Show Rules"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Pattern Information Panel (always visible) */}
      <div className="mx-auto max-w-6xl px-4">
        <div className="bg-gray-800/70 border border-gray-700 p-3 rounded-md mt-4">
          <h3 className="text-white text-base font-medium mb-1">{infoLabel}</h3>
          <p className="text-gray-300 text-xs">{infoText}</p>
        </div>
      </div>

      <main className="mx-auto max-w-6xl p-4">
        <div
          ref={containerRef}
          className="overflow-hidden max-w-full max-h-[78vh] h-[78vh] border border-gray-700 rounded-md bg-gray-900"
        >
          <canvas
            ref={canvasRef}
            width={numCols * cellSizeState}
            height={numRows * cellSizeState}
            onClick={handleCanvasClick}
            className="cursor-pointer"
          />
        </div>
        <div className="text-gray-400 text-xs mt-2 text-center">
          Keyboard: Space (Start/Stop), C (Clear), R (Random), S (Step), +/−
          (Zoom)
        </div>
      </main>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md">
            <h2 className="text-white text-xl mb-4">
              Conway&apos;s Game of Life Rules
            </h2>
            <div className="text-white mb-4">
              <p className="mb-2">
                Conway&apos;s Game of Life is a cellular automaton where cells
                live or die based on their neighbors:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Any live cell with fewer than two live neighbors dies
                  (underpopulation)
                </li>
                <li>Any live cell with two or three live neighbors lives on</li>
                <li>
                  Any live cell with more than three live neighbors dies
                  (overpopulation)
                </li>
                <li>
                  Any dead cell with exactly three live neighbors becomes a live
                  cell (reproduction)
                </li>
              </ul>
            </div>
            <div className="text-white mb-4">
              <h3 className="text-lg font-medium mb-2">How to Use:</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>Click on cells to toggle them between alive and dead</li>
                <li>Use the Start/Stop button to control the simulation</li>
                <li>Select predefined patterns to see interesting behaviors</li>
                <li>Use the Step button to advance one generation at a time</li>
                <li>Adjust the speed slider to control simulation speed</li>
                <li>Use the zoom controls to adjust the view</li>
                <li>Try the Random button to generate random patterns</li>
              </ul>
            </div>
            <button
              onClick={() => setShowRules(false)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md">
            <h2 className="text-white text-xl mb-4">Game of Life Tutorial</h2>

            {tutorialStep === 1 && (
              <div className="text-white mb-4">
                <p className="mb-2">Welcome to Conway&apos;s Game of Life!</p>
                <p>
                  This simulation demonstrates how complex patterns can emerge
                  from simple rules.
                </p>
              </div>
            )}

            {tutorialStep === 2 && (
              <div className="text-white mb-4">
                <p className="mb-2">
                  The grid consists of cells that can be either alive (green) or
                  dead (black).
                </p>
                <p>Click on any cell to toggle its state.</p>
              </div>
            )}

            {tutorialStep === 3 && (
              <div className="text-white mb-4">
                <p className="mb-2">
                  Try selecting a predefined pattern like &quot;Glider&quot; or
                  &quot;Pulsar&quot;.
                </p>
                <p>These are famous patterns with interesting behaviors.</p>
              </div>
            )}

            {tutorialStep === 4 && (
              <div className="text-white mb-4">
                <p className="mb-2">
                  Press the &quot;Start&quot; button to begin the simulation.
                </p>
                <p>
                  Watch how the cells evolve according to Conway&apos;s rules!
                </p>
              </div>
            )}

            {tutorialStep === 5 && (
              <div className="text-white mb-4">
                <p className="mb-2">
                  You&apos;re all set to explore the Game of Life!
                </p>
                <p>
                  Check out the &quot;Rules&quot; button if you want to learn
                  more about how it works.
                </p>
              </div>
            )}

            <div className="flex justify-between mt-4">
              {tutorialStep > 1 && (
                <button
                  onClick={() => setTutorialStep((prev) => prev - 1)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
                >
                  Previous
                </button>
              )}

              {tutorialStep < 5 ? (
                <button
                  onClick={() => setTutorialStep((prev) => prev + 1)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={() => setShowTutorial(false)}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameComponent;

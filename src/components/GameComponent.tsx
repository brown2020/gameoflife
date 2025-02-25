"use client";

import { patterns } from "@/utils/patterns";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";

const numRows = 50; // Number of rows for the grid
const numCols = 50; // Number of columns for the grid
const cellSize = 20; // Size of each cell in pixels

// Type for the grid: a 2D array of numbers
type Grid = number[][];

// Helper function to create an empty grid
const createEmptyGrid = (): Grid => {
  return Array.from({ length: numRows }, () => Array(numCols).fill(0));
};

const GameComponent: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid());
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [tutorialStep, setTutorialStep] = useState<number>(1);
  const [showRules, setShowRules] = useState<boolean>(false);
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);
  const [generation, setGeneration] = useState<number>(0);

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
    Acorn:
      "A methuselah pattern that evolves for 5206 generations before stabilizing. Discovered by Charles Corderman.",
    RPentomino:
      "One of the most active small patterns, this R-pentomino evolves for 1103 generations and produces many gliders.",
    InfiniteGrowth:
      "A pattern that demonstrates unbounded growth in one direction, creating a trail of stable objects.",
    GliderGun2:
      "An alternative glider gun design that also produces a stream of gliders.",
    Spacefiller:
      "A pattern that rapidly expands to fill available space. It creates complex structures as it grows.",
    GardenOfEden:
      "A pattern that cannot be created through normal evolution - it can only exist as an initial state.",
    Clock:
      "A simple period-2 oscillator that resembles the hands of a clock as it alternates between two states.",
  };

  // Function to render the grid on canvas
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
        // Fill cell
        ctx.fillStyle = grid[i][j] ? "#4ade80" : "#000000";
        ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);

        // Draw cell border
        ctx.strokeStyle = "#374151";
        ctx.strokeRect(j * cellSize, i * cellSize, cellSize, cellSize);
      }
    }
  }, [grid]);

  // Use effect to render the grid whenever it changes
  useEffect(() => {
    renderGrid();
  }, [grid, renderGrid]);

  // Function to handle setting a predefined pattern
  const setPattern = (patternName: string) => {
    setGrid(patterns[patternName]);
    setIsRunning(false);
    setSelectedPattern(patternName);
    setGeneration(0);
  };

  // The optimized simulation function
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
  }, [operations]);

  // useEffect to handle starting and stopping the simulation
  useEffect(() => {
    if (isRunning) {
      const id = setInterval(runSimulation, 100);
      return () => clearInterval(id);
    }
  }, [isRunning, runSimulation]);

  // Handle clicking on a cell to toggle its state
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

    if (i >= 0 && i < numRows && j >= 0 && j < numCols) {
      const newGrid = grid.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          rowIndex === i && colIndex === j ? (cell ? 0 : 1) : cell
        )
      );
      setGrid(newGrid);
    }
  };

  // Handle the start/stop button click
  const toggleRunning = (): void => {
    setIsRunning(!isRunning);
  };

  // Clear the grid
  const clearGrid = (): void => {
    setGrid(createEmptyGrid());
    setIsRunning(false);
    setGeneration(0);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-gray-800 p-4 overflow-hidden">
      <div className="flex mb-4 space-x-2 flex-wrap justify-center">
        {Object.keys(patterns).map((pattern) => (
          <button
            key={pattern}
            onClick={() => setPattern(pattern)}
            className={`px-2 py-1 text-sm font-medium text-white rounded-sm m-1 ${
              selectedPattern === pattern
                ? "bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            title={patternInfo[pattern]}
          >
            {pattern}
          </button>
        ))}
        <button
          onClick={toggleRunning}
          className={`px-2 py-1 text-sm font-medium text-white rounded m-1 ${
            isRunning ? "bg-red-500" : "bg-green-500"
          } hover:opacity-80`}
        >
          {isRunning ? "Stop" : "Start"}
        </button>
        <button
          onClick={clearGrid}
          className="px-2 py-1 text-sm font-medium text-white bg-gray-500 rounded-sm hover:bg-gray-600 m-1"
        >
          Clear
        </button>
        <button
          onClick={() => {
            setShowTutorial(true);
            setTutorialStep(1);
          }}
          className="px-2 py-1 text-sm font-medium text-white bg-purple-500 rounded-sm hover:bg-purple-600 m-1"
        >
          Tutorial
        </button>
        <button
          onClick={() => setShowRules(!showRules)}
          className="px-2 py-1 text-sm font-medium text-white bg-gray-500 rounded-sm hover:bg-gray-600 m-1"
        >
          {showRules ? "Hide Rules" : "Show Rules"}
        </button>
      </div>

      {/* Generation Counter */}
      <div className="text-white mb-2 text-center">
        Generation: <span className="font-mono">{generation}</span>
        {generation > 0 && (
          <button
            onClick={() => setGeneration(0)}
            className="ml-2 px-1 text-xs bg-gray-600 rounded hover:bg-gray-500"
            title="Reset generation counter"
          >
            Reset
          </button>
        )}
      </div>

      {/* Pattern Information Panel */}
      {selectedPattern && (
        <div className="bg-gray-700 p-3 rounded-md mb-4 max-w-2xl mx-auto">
          <h3 className="text-white text-lg font-medium mb-1">
            {selectedPattern}
          </h3>
          <p className="text-gray-200 text-sm">
            {patternInfo[selectedPattern]}
          </p>
        </div>
      )}

      <div className="overflow-auto max-w-full max-h-[80vh] border border-gray-700">
        <canvas
          ref={canvasRef}
          width={numCols * cellSize}
          height={numRows * cellSize}
          onClick={handleCanvasClick}
          className="cursor-pointer"
        />
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg max-w-md">
            <h2 className="text-white text-xl mb-4">
              Conway's Game of Life Rules
            </h2>
            <div className="text-white mb-4">
              <p className="mb-2">
                Conway's Game of Life is a cellular automaton where cells live
                or die based on their neighbors:
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
                <li>Clear the grid to start over</li>
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
                <p className="mb-2">Welcome to Conway's Game of Life!</p>
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
                  Try selecting a predefined pattern like "Glider" or "Pulsar".
                </p>
                <p>These are famous patterns with interesting behaviors.</p>
              </div>
            )}

            {tutorialStep === 4 && (
              <div className="text-white mb-4">
                <p className="mb-2">
                  Press the "Start" button to begin the simulation.
                </p>
                <p>Watch how the cells evolve according to Conway's rules!</p>
              </div>
            )}

            {tutorialStep === 5 && (
              <div className="text-white mb-4">
                <p className="mb-2">
                  You're all set to explore the Game of Life!
                </p>
                <p>
                  Check out the "Rules" button if you want to learn more about
                  how it works.
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

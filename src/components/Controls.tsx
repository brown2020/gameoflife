import React, { memo, useCallback } from "react";
import { patternCategories } from "@/utils/patterns";
import { Button } from "./ui/Button";
import { Tool } from "@/types/game";
import { SPEED, TOOL_CONFIG } from "@/constants/game";

interface ControlsProps {
  isRunning: boolean;
  toggleRunning: () => void;
  stepSimulation: () => void;
  clearGrid: () => void;
  generateRandomGrid: () => void;
  selectedPattern: string | null;
  onPatternChange: (pattern: string) => void;
  generation: number;
  setGeneration: (gen: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  cellSize: number;
  zoomIn: () => void;
  zoomOut: () => void;
  onShowTutorial: () => void;
  onToggleRules: () => void;
  showRules: boolean;
  tool: Tool;
  setTool: (tool: Tool) => void;
}

export const Controls = memo<ControlsProps>(
  ({
    isRunning,
    toggleRunning,
    stepSimulation,
    clearGrid,
    generateRandomGrid,
    selectedPattern,
    onPatternChange,
    generation,
    setGeneration,
    speed,
    setSpeed,
    cellSize,
    zoomIn,
    zoomOut,
    onShowTutorial,
    onToggleRules,
    showRules,
    tool,
    setTool,
  }) => {
    const handleSpeedChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setSpeed(SPEED.MAX - parseInt(e.target.value, 10));
      },
      [setSpeed]
    );

    const handleResetGeneration = useCallback(
      () => setGeneration(0),
      [setGeneration]
    );

    return (
      <header className="sticky top-0 z-20 w-full border-b border-gray-700 bg-gray-800/80 backdrop-blur supports-[backdrop-filter]:bg-gray-800/60">
        <div className="mx-auto max-w-6xl px-4 py-3">
          <div className="flex flex-col gap-3">
            {/* Row 1: Brand/Pattern + Primary Controls */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="text-sm font-semibold tracking-wide text-white">
                  Game of Life
                </div>

                {/* Tool Selection */}
                <div className="flex items-center bg-gray-700 rounded-md p-0.5 border border-gray-600">
                  {TOOL_CONFIG.map(({ id, label, activeClass, title }) => (
                    <button
                      key={id}
                      onClick={() => setTool(id)}
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        tool === id
                          ? `${activeClass} text-white shadow-sm`
                          : "text-gray-300 hover:text-white"
                      }`}
                      title={title}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="pattern" className="text-xs text-gray-300">
                    Pattern
                  </label>
                  <select
                    id="pattern"
                    value={selectedPattern ?? ""}
                    onChange={(e) => onPatternChange(e.target.value)}
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
                <Button
                  onClick={toggleRunning}
                  variant={isRunning ? "danger" : "primary"}
                  fixedWidth="w-20"
                  className="text-center"
                  aria-label={
                    isRunning ? "Stop simulation" : "Start simulation"
                  }
                >
                  {isRunning ? "Stop" : "Start"}
                </Button>
                <Button
                  onClick={stepSimulation}
                  disabled={isRunning}
                  variant="info"
                  className={isRunning ? "opacity-50 cursor-not-allowed" : ""}
                  title="Advance one generation"
                >
                  Step
                </Button>
                <Button onClick={clearGrid}>Clear</Button>
                <Button onClick={generateRandomGrid} variant="accent">
                  Random
                </Button>
              </div>
            </div>

            {/* Row 2: Readouts/Tuners + Help */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="text-xs text-gray-200">
                  Gen: <span className="font-mono">{generation}</span>
                  {generation > 0 && (
                    <button
                      onClick={handleResetGeneration}
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
                    min={SPEED.MIN}
                    max={SPEED.MAX}
                    step={SPEED.STEP}
                    value={SPEED.MAX - speed}
                    onChange={handleSpeedChange}
                    className="w-24 accent-blue-500"
                    aria-label="Simulation speed"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-300">Zoom</span>
                  <Button
                    onClick={zoomOut}
                    title="Zoom out"
                    aria-label="Zoom out"
                  >
                    -
                  </Button>
                  <span className="text-xs text-gray-300 w-10 text-center">
                    {cellSize}px
                  </span>
                  <Button onClick={zoomIn} title="Zoom in" aria-label="Zoom in">
                    +
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button onClick={onShowTutorial} variant="purple">
                  Tutorial
                </Button>
                <Button onClick={onToggleRules}>
                  {showRules ? "Hide Rules" : "Show Rules"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
);

Controls.displayName = "Controls";

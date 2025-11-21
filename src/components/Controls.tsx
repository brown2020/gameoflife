import React from "react";
import { patternCategories } from "@/utils/patterns";

interface ControlsProps {
    isRunning: boolean;
    setIsRunning: (isRunning: boolean) => void;
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
    handleZoom: (zoomIn: boolean) => void;
    onShowTutorial: () => void;
    onToggleRules: () => void;
    showRules: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
    isRunning,
    setIsRunning,
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
    handleZoom,
    onShowTutorial,
    onToggleRules,
    showRules,
}) => {
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
                            <button
                                onClick={() => setIsRunning(!isRunning)}
                                className={`px-3 py-1.5 text-xs font-medium text-white rounded w-20 text-center ${isRunning ? "bg-red-500" : "bg-green-600"
                                    } hover:opacity-90`}
                                aria-label={isRunning ? "Stop simulation" : "Start simulation"}
                            >
                                {isRunning ? "Stop" : "Start"}
                            </button>
                            <button
                                onClick={stepSimulation}
                                disabled={isRunning}
                                className={`px-3 py-1.5 text-xs font-medium text-white rounded ${isRunning
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
                                    {cellSize}px
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
                                onClick={onShowTutorial}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded hover:bg-purple-500"
                            >
                                Tutorial
                            </button>
                            <button
                                onClick={onToggleRules}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-gray-600 rounded hover:bg-gray-500"
                            >
                                {showRules ? "Hide Rules" : "Show Rules"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

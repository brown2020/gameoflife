import { useEffect, useCallback } from "react";

interface KeyboardShortcutActions {
  toggleRunning: () => void;
  clear: () => void;
  random: () => void;
  step: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  isRunning: boolean;
}

/**
 * Hook to handle keyboard shortcuts for the game
 * - Space: Start/Stop simulation
 * - C: Clear grid
 * - R: Random grid
 * - S: Step simulation (when paused)
 * - +: Zoom in
 * - -: Zoom out
 */
export const useKeyboardShortcuts = ({
  toggleRunning,
  clear,
  random,
  step,
  zoomIn,
  zoomOut,
  isRunning,
}: KeyboardShortcutActions): void => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (e.key) {
        case " ":
          e.preventDefault();
          toggleRunning();
          break;
        case "c":
        case "C":
          clear();
          break;
        case "r":
        case "R":
          random();
          break;
        case "s":
        case "S":
          if (!isRunning) step();
          break;
        case "+":
        case "=":
          zoomIn();
          break;
        case "-":
        case "_":
          zoomOut();
          break;
      }
    },
    [toggleRunning, clear, random, step, zoomIn, zoomOut, isRunning]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
};

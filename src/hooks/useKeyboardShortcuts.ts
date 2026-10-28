import { useEffect, useCallback } from "react";

const EDITING_TARGETS = new Set(["INPUT", "TEXTAREA", "SELECT", "CANVAS"]);

/** Skip global shortcuts while a modal is open or focus is in a field or the grid. */
export const shouldIgnoreGameShortcut = (
  target: unknown,
  dialogOpen: boolean
): boolean => {
  if (dialogOpen) return true;
  if (!target || typeof target !== "object") return false;
  const nodeName = (target as { nodeName?: string }).nodeName;
  return typeof nodeName === "string" && EDITING_TARGETS.has(nodeName);
};

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
      const dialogOpen =
        typeof document !== "undefined" &&
        document.querySelector("dialog[open]") !== null;
      if (shouldIgnoreGameShortcut(e.target, dialogOpen)) {
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

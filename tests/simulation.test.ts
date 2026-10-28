import { describe, expect, it } from "vitest";
import { stepSimulation, resizeGrid } from "@/utils/simulation";
import { cellsAlongLine, createEmptyGrid, fitGridDimensions } from "@/utils/grid";
import { placePattern } from "@/utils/patterns";
import { sliderFromSpeed, speedFromSlider } from "@/utils/speed";
import { SPEED } from "@/constants/game";
import { shouldIgnoreGameShortcut } from "@/hooks/useKeyboardShortcuts";
import { CellState, Grid } from "@/types/game";

function countLive(grid: Grid): number {
  let live = 0;
  for (const row of grid) {
    for (const cell of row) live += cell;
  }
  return live;
}

function gridFrom(rows: string[]): Grid {
  return rows.map((row) =>
    row.split("").map((c) => (c === "1" ? 1 : 0) as CellState)
  );
}

describe("stepSimulation", () => {
  it("blinker oscillator advances correctly", () => {
    // vertical blinker in 5x5
    const start = gridFrom([
      "00000",
      "00100",
      "00100",
      "00100",
      "00000",
    ]);
    const mid = stepSimulation(start, 5, 5);
    expect(mid.changed).toBe(true);
    expect(mid.shouldStop).toBe(false);
    expect(mid.grid).toEqual(
      gridFrom(["00000", "00000", "01110", "00000", "00000"])
    );
    const back = stepSimulation(mid.grid, 5, 5);
    expect(back.grid).toEqual(start);
  });

  it("stops when grid is empty", () => {
    const empty = createEmptyGrid(3, 3);
    const result = stepSimulation(empty, 3, 3);
    expect(result.changed).toBe(false);
    expect(result.shouldStop).toBe(true);
    expect(result.grid).toBe(empty);
  });

  it("stops on still life block", () => {
    const block = gridFrom(["0000", "0110", "0110", "0000"]);
    const result = stepSimulation(block, 4, 4);
    expect(result.changed).toBe(false);
    expect(result.shouldStop).toBe(true);
  });

  it("regression: underpopulation kills lone cell", () => {
    const lone = gridFrom(["000", "010", "000"]);
    const result = stepSimulation(lone, 3, 3);
    expect(result.changed).toBe(true);
    expect(result.grid).toEqual(createEmptyGrid(3, 3));
  });

  it("does not throw when the requested size is larger than the grid", () => {
    const small = createEmptyGrid(5, 5);
    small[4][4] = 1;
    expect(() => stepSimulation(small, 50, 50)).not.toThrow();
    const result = stepSimulation(small, 50, 50);
    expect(result.grid).toHaveLength(5);
    expect(result.grid[4]).toHaveLength(5);
    expect(result.grid[4][4]).toBe(0);
    expect(result.changed).toBe(true);
  });
});

describe("resizeGrid", () => {
  it("preserves overlapping cells when expanding", () => {
    const prev = gridFrom(["10", "01"]);
    const next = resizeGrid(prev, 3, 3);
    expect(next).toEqual(gridFrom(["100", "010", "000"]));
  });
});

describe("fitGridDimensions", () => {
  it("floors to the content box so the canvas is not clipped", () => {
    const cellSize = 20;
    const { rows, cols } = fitGridDimensions(1118, 622, cellSize);
    expect(cols * cellSize).toBeLessThanOrEqual(1118);
    expect(rows * cellSize).toBeLessThanOrEqual(622);
    expect(cols).toBe(55);
    expect(rows).toBe(31);
  });
});

describe("cellsAlongLine", () => {
  it("fills every cell between the endpoints of a straight stroke", () => {
    const cells = cellsAlongLine(2, 2, 2, 12);
    expect(cells).toHaveLength(11);
    expect(cells[0]).toEqual({ r: 2, c: 2 });
    expect(cells[10]).toEqual({ r: 2, c: 12 });
    expect(cells.map((cell) => cell.c)).toEqual([
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
    ]);
  });
});

describe("placePattern", () => {
  it("centers a pattern whose absolute coordinates sit outside a small grid", () => {
    const placed = placePattern(
      [
        [20, 21],
        [20, 22],
        [21, 20],
        [21, 21],
        [22, 21],
      ],
      18,
      30
    );
    expect(placed.clipped).toBe(0);
    expect(countLive(placed.grid)).toBe(5);
  });

  it("reports cells that still cannot fit", () => {
    const placed = placePattern(
      [
        [1, 0],
        [1, 4],
        [1, 8],
      ],
      5,
      5
    );
    expect(placed.clipped).toBe(2);
    expect(countLive(placed.grid)).toBe(1);
  });
});

describe("speed slider", () => {
  it("keeps every slider position inside the configured delay range", () => {
    for (let value = SPEED.MIN; value <= SPEED.MAX; value += SPEED.STEP) {
      const speed = speedFromSlider(value);
      expect(speed).toBeGreaterThanOrEqual(SPEED.MIN);
      expect(speed).toBeLessThanOrEqual(SPEED.MAX);
    }
    expect(speedFromSlider(SPEED.MAX)).toBe(SPEED.MIN);
    expect(speedFromSlider(SPEED.MIN)).toBe(SPEED.MAX);
    expect(sliderFromSpeed(SPEED.DEFAULT)).toBe(
      SPEED.MIN + SPEED.MAX - SPEED.DEFAULT
    );
    expect(speedFromSlider(0)).toBe(SPEED.MAX);
  });
});

describe("keyboard shortcut guard", () => {
  it("ignores shortcuts while a dialog is open or focus is on the grid", () => {
    expect(shouldIgnoreGameShortcut({ nodeName: "BUTTON" }, true)).toBe(true);
    expect(shouldIgnoreGameShortcut({ nodeName: "CANVAS" }, false)).toBe(true);
    expect(shouldIgnoreGameShortcut({ nodeName: "INPUT" }, false)).toBe(true);
    expect(shouldIgnoreGameShortcut({ nodeName: "BUTTON" }, false)).toBe(
      false
    );
  });
});

describe("setPattern contract", () => {
  it("unknown pattern name is a no-op in patterns map", async () => {
    const { patterns } = await import("@/utils/patterns");
    expect(patterns["__does_not_exist__"]).toBeUndefined();
  });
});

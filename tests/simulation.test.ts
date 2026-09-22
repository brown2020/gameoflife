import { describe, expect, it } from "vitest";
import { stepSimulation, resizeGrid } from "@/utils/simulation";
import { createEmptyGrid } from "@/utils/grid";
import { CellState, Grid } from "@/types/game";

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
});

describe("resizeGrid", () => {
  it("preserves overlapping cells when expanding", () => {
    const prev = gridFrom(["10", "01"]);
    const next = resizeGrid(prev, 3, 3);
    expect(next).toEqual(gridFrom(["100", "010", "000"]));
  });
});

describe("setPattern contract", () => {
  it("unknown pattern name is a no-op in patterns map", async () => {
    const { patterns } = await import("@/utils/patterns");
    expect(patterns["__does_not_exist__"]).toBeUndefined();
  });
});

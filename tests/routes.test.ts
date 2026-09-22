import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

describe("route security (client-only)", () => {
  it("ships no API route handlers or server actions", () => {
    const appDir = path.join(process.cwd(), "src/app");
    const walk = (dir: string): string[] => {
      const out: string[] = [];
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) out.push(...walk(p));
        else out.push(p);
      }
      return out;
    };
    const files = walk(appDir).map((f) => path.relative(appDir, f));
    expect(files.some((f) => f.includes("route.ts"))).toBe(false);
    expect(files.some((f) => f.includes("route.js"))).toBe(false);
    const page = fs.readFileSync(path.join(appDir, "page.tsx"), "utf8");
    expect(page).not.toMatch(/["']use server["']/);
  });
});

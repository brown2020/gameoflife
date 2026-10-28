import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";
import nextConfig from "../next.config.mjs";
import {
  headersForRuntime,
  poweredByHeader,
  securityHeaders,
} from "../security-headers.mjs";

describe("response security headers", () => {
  it("disables the framework banner and publishes a baseline policy", async () => {
    expect(poweredByHeader).toBe(false);
    expect(nextConfig.poweredByHeader).toBe(false);

    if (!nextConfig.headers) {
      throw new Error("next config is missing headers()");
    }
    const rules = await nextConfig.headers();
    expect(rules).toEqual([
      {
        source: "/:path*",
        headers: headersForRuntime(process.env.NODE_ENV !== "production"),
      },
    ]);

    const csp = securityHeaders.find(
      (header) => header.key === "Content-Security-Policy"
    );
    expect(csp?.value).toContain("default-src 'self'");
    expect(csp?.value).toContain("frame-ancestors 'none'");
    expect(csp?.value).not.toContain("unsafe-eval");
    expect(securityHeaders.map((header) => header.key)).toEqual([
      "X-Content-Type-Options",
      "X-Frame-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "Content-Security-Policy",
    ]);
    expect(
      headersForRuntime(true).find(
        (header) => header.key === "Content-Security-Policy"
      )?.value
    ).toContain("'unsafe-eval'");
  });
});

describe("env files stay untracked", () => {
  it("ignores .env and .env.* but keeps .env.example", () => {
    const gitignore = fs.readFileSync(
      path.join(process.cwd(), ".gitignore"),
      "utf8"
    );
    expect(gitignore).toMatch(/^\.env$/m);
    expect(gitignore).toMatch(/^\.env\.\*$/m);
    expect(gitignore).toMatch(/^!\.env\.example$/m);
  });
});

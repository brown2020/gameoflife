/** Disable the framework banner on responses. */
export const poweredByHeader = false;

/**
 * Baseline headers for this client-only app.
 * Script and style allow inline tags because Next.js emits them for hydration.
 * `unsafe-eval` is added only in development (see next.config.mjs).
 */
export const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "worker-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

/** Dev React refresh evaluates scripts; production CSP stays without eval. */
export const headersForRuntime = (isDev) => {
  if (!isDev) return securityHeaders;
  return securityHeaders.map((header) => {
    if (header.key !== "Content-Security-Policy") return header;
    return {
      ...header,
      value: header.value.replace(
        "script-src 'self' 'unsafe-inline'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
      ),
    };
  });
};

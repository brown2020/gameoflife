import { headersForRuntime, poweredByHeader } from "./security-headers.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: headersForRuntime(process.env.NODE_ENV !== "production"),
      },
    ];
  },
};

export default nextConfig;

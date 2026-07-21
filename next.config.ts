import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained `.next/standalone` server for Docker/Coolify deploys.
  output: "standalone",
  // Stray package-lock.json files exist in parent folders (C:\Users\krsit, Desktop).
  // Pin the workspace root to this project so file tracing resolves correctly
  // (used by both Turbopack and standalone output file tracing).
  turbopack: {
    root: __dirname,
  },
  outputFileTracingRoot: __dirname,
};

export default nextConfig;

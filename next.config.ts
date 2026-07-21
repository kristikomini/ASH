import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Stray package-lock.json files exist in parent folders (C:\Users\krsit, Desktop).
  // Pin the workspace root to this project so file tracing resolves correctly.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;

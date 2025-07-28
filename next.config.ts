import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure clean build
  experimental: {
    forceSwcTransforms: true,
  },
};

export default nextConfig;
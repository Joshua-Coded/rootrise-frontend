import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Remove any experimental features that might cause issues
  },
  // Ensure proper static export if needed
  trailingSlash: false,
  // Add this if you're having routing issues
  async redirects() {
    return [];
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // iOS Simulator loads via 127.0.0.1 — allow dev HMR/assets cross-origin
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;

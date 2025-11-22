import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  images: {
    unoptimized: true,
  },
  logging: { fetches: { fullUrl: true } },
  devIndicators: { position: "bottom-right" },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    typedEnv: true,
    browserDebugInfoInTerminal: true,
  }
};

export default nextConfig;

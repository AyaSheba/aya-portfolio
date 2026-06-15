import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
  },
  turbopack: {
    root: process.cwd(),
  },
}

export default nextConfig

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  cacheComponents: false,
  partialPrefetching: false,
};

export default nextConfig;

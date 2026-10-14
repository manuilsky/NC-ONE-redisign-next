import type { NextConfig } from "next";

const basePath = "/NC-ONE-redisign-next";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  // Keeps `/base/#section` (not `/base#section`) so static hosts don't drop the hash on redirect.
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

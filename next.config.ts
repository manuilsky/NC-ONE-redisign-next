import type { NextConfig } from "next";

const basePath = "/NC-ONE-redisign-next";
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = {
  // Static export is used for GitHub Pages (`npm run build` / build-pages).
  // Without STATIC_EXPORT, `next dev` / server builds can use `/api/contact`.
  ...(isStaticExport ? { output: "export" as const } : {}),
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

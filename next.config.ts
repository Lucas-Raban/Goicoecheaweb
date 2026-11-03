import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "static.tokkobroker.com" },
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  // Las fotos 360 se piden desde el mismo dominio: el visor las baja con fetch y así no depende del CORS de Sanity.
  async rewrites() {
    return [{ source: "/foto360/:archivo", destination: "https://cdn.sanity.io/images/wjn5b9z2/production/:archivo" }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

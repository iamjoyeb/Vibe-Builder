import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vibe Builder is browser-first and deploys as a fully static site.
  // This means no route handlers, server actions, cookies, ISR or middleware
  // anywhere in the app (see guides/static-exports in the Next.js docs).
  output: "export",

  // The default next/image loader needs an image-optimization server, which
  // does not exist in a static export. Use unoptimized images instead.
  images: {
    unoptimized: true,
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

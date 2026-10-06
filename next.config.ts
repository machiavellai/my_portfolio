import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Project media comes from Sanity's asset CDN, scoped to this project's files.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${process.env.SANITY_STUDIO_PROJECT_ID}/**`,
      },
    ],
  },
};

export default nextConfig;

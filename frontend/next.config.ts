import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  /* config options here */
  /* config options here */

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all hostnames
      },
    ],
    domains: ["localhost"],
  },
};

export default nextConfig;

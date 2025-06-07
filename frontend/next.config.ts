import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  /* config options here */
  /* config options here */
  output: "export", // Ensure static export
  trailingSlash: true, // Optional: Avoid 404s for subpages
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

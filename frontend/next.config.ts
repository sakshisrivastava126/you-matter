import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from any hostname (for future avatar/profile pictures)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  // Optional: If using <Image /> component without server optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

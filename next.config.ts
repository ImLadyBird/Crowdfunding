import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drzgsgsdgfmdbkdtoxzv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  // Optional: ensure static images can be optimized properly on Vercel
  reactStrictMode: true,
};

export default nextConfig;

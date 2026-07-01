import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      new URL("https://kpgbusvofvdonfpicjwt.supabase.co/storage/v1/object/public/**"),
    ],
  },
};

export default nextConfig;

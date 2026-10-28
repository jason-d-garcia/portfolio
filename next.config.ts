import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/projects/senti", destination: "/projects/moodify", permanent: false }];
  },
};

export default nextConfig;

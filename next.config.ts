import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/projects/moodify", destination: "/projects/senti", permanent: true },
      // Research moved into Explorations.
      { source: "/research", destination: "/explorations", permanent: false },
    ];
  },
};

export default nextConfig;

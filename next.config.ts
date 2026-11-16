import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/projects/senti", destination: "/projects/moodify", permanent: false },
      // Research moved into Explorations.
      { source: "/research", destination: "/explorations", permanent: false },
    ];
  },
};

export default nextConfig;

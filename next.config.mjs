/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  async rewrites() {
    return [
      { source: "/api/girlfriend", destination: "/data/girlfriend.json" },
      { source: "/api/grass", destination: "/data/grass.json" },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "grass-graph.moshimo.works",
      },
    ],
  },
};

export default nextConfig;

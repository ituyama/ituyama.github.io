/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  async rewrites() {
    return [{ source: "/api/girlfriend", destination: "/data/girlfriend.json" }];
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

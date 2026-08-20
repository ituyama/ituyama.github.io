/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
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

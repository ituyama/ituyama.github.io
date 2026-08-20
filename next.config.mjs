/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "grass-graph.moshimo.works",
      },
    ],
  },
};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "6avqdlglj1.ufs.sh",
      },
    ],
  },
};

module.exports = nextConfig;

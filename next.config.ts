import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**.ts.net",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "**.ts.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.ts.net",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

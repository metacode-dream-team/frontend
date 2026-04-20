import type { NextConfig } from "next";

const authProxyTarget =
  process.env.BACKEND_PROXY_AUTH ?? "http://localhost:8080";
const platformProxyTarget =
  process.env.BACKEND_PROXY_PLATFORM ?? "http://localhost:8082";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: `${authProxyTarget}/:path*`,
      },
      {
        source: "/api/backend-platform/:path*",
        destination: `${platformProxyTarget}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

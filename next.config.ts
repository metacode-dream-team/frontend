import type { NextConfig } from "next";

function stripTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, "");
}

const defaultGateway = "http://localhost:8080";
const authProxyTarget = stripTrailingSlashes(
  process.env.BACKEND_PROXY_AUTH ?? defaultGateway,
);
const platformProxyTarget = stripTrailingSlashes(
  process.env.BACKEND_PROXY_PLATFORM ?? defaultGateway,
);

const nextConfig: NextConfig = {
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

import type { NextConfig } from "next";

function stripTrailingSlashes(url: string): string {
  return url.replace(/\/+$/, "");
}

/** Единый API gateway (локально :8080). Раздельные цели — только если задать оба env. */
const defaultGateway = "http://localhost:8080";
const authProxyTarget = stripTrailingSlashes(
  process.env.BACKEND_PROXY_AUTH ?? defaultGateway,
);
const platformProxyTarget = stripTrailingSlashes(
  process.env.BACKEND_PROXY_PLATFORM ?? defaultGateway,
);

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

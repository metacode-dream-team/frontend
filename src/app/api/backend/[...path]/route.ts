import { NextRequest, NextResponse } from "next/server";
import {
  API_BASE_URL,
  AUTH_LOGOUT_PATH,
  AUTH_REFRESH_COOKIE_NAMES,
} from "@/shared/config/constants";
import {
  appendClearAuthRefreshCookies,
  appendRewrittenSetCookies,
} from "@/shared/lib/api/rewriteProxySetCookies";

const AUTH_LOGOUT_PROXY_PATH = AUTH_LOGOUT_PATH.replace(/^\/+/, "");

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
]);

const STRIP_RESPONSE_HEADERS = new Set([
  "access-control-allow-origin",
  "access-control-allow-credentials",
  "access-control-allow-headers",
  "access-control-allow-methods",
  "access-control-expose-headers",
  "access-control-max-age",
]);

function buildGatewayUrl(pathSegments: string[], search: string): string {
  const base = API_BASE_URL.replace(/\/+$/, "");
  const path = pathSegments.join("/");
  return `${base}/${path}${search}`;
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
): Promise<NextResponse> {
  const target = buildGatewayUrl(pathSegments, request.nextUrl.search);

  const headers = new Headers();
  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP.has(lower) || lower === "host") return;
    headers.set(key, value);
  });

  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
    redirect: "manual",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(target, init);
  const responseHeaders = new Headers();

  upstream.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (STRIP_RESPONSE_HEADERS.has(lower) || lower === "set-cookie") return;
    responseHeaders.set(key, value);
  });

  appendRewrittenSetCookies(upstream.headers, responseHeaders, request.url);

  const proxyPath = pathSegments.join("/");
  if (
    request.method === "POST" &&
    proxyPath === AUTH_LOGOUT_PROXY_PATH
  ) {
    appendClearAuthRefreshCookies(
      responseHeaders,
      request.url,
      AUTH_REFRESH_COOKIE_NAMES,
    );
  }

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: responseHeaders,
  });
}

type RouteContext = { params: Promise<{ path: string[] }> };

async function handle(
  request: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const { path } = await context.params;
  return proxyRequest(request, path);
}

export function GET(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export function POST(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export function PUT(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export function PATCH(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

export function OPTIONS(request: NextRequest, context: RouteContext) {
  return handle(request, context);
}

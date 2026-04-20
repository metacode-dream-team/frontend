/**
 * В dev/prod при NEXT_PUBLIC_USE_API_PROXY=true браузерные fetch идут на same-origin
 * (/api/backend/…, /api/backend-platform/…), Next rewrites проксируют на реальные хосты — без CORS.
 * На сервере (RSC) по-прежнему прямые URL из env.
 */

import {
  AUTH_API_SERVER_BASE,
  AUTH_SERVICE_URL,
  INTEGRATION_API_SERVER_BASE,
  INTEGRATION_API_URL,
  PLATFORM_API_SERVER_BASE,
  PLATFORM_API_URL,
} from "@/shared/config/constants";

export const API_PROXY_AUTH = "/api/backend";
export const API_PROXY_PLATFORM = "/api/backend-platform";

export function shouldUseBrowserApiProxy(): boolean {
  return typeof window !== "undefined" && process.env.NEXT_PUBLIC_USE_API_PROXY === "true";
}

function stripSlash(s: string): string {
  return s.replace(/\/$/, "");
}

function sameBase(a: string, b: string): boolean {
  return stripSlash(a) === stripSlash(b);
}

/** Прямой URL: в Node — внутренняя база (Docker), в браузере — NEXT_PUBLIC. */
export function authServiceFetchUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const base =
    typeof window === "undefined" ? AUTH_API_SERVER_BASE : stripSlash(AUTH_SERVICE_URL);
  return `${base}${p}`;
}

export function platformFetchUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const base =
    typeof window === "undefined" ? PLATFORM_API_SERVER_BASE : stripSlash(PLATFORM_API_URL);
  return `${base}${p}`;
}

export function integrationFetchUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const base =
    typeof window === "undefined"
      ? INTEGRATION_API_SERVER_BASE
      : stripSlash(INTEGRATION_API_URL);
  return `${base}${p}`;
}

/**
 * URL для fetch в браузере с учётом прокси.
 */
export function resolveAuthUrlForFetch(path: string): string {
  if (!shouldUseBrowserApiProxy()) {
    return authServiceFetchUrl(path);
  }
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_PROXY_AUTH}${p}`;
}

export function resolvePlatformUrlForFetch(path: string): string {
  if (!shouldUseBrowserApiProxy()) {
    return platformFetchUrl(path);
  }
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_PROXY_PLATFORM}${p}`;
}

/**
 * Integration может совпадать по хосту с auth (:8080) или с platform (:8082).
 */
export function resolveIntegrationUrlForFetch(path: string): string {
  if (!shouldUseBrowserApiProxy()) {
    return integrationFetchUrl(path);
  }
  const p = path.startsWith("/") ? path : `/${path}`;
  const int = stripSlash(INTEGRATION_API_URL);
  if (sameBase(int, stripSlash(AUTH_SERVICE_URL))) {
    return `${API_PROXY_AUTH}${p}`;
  }
  if (sameBase(int, stripSlash(PLATFORM_API_URL))) {
    return `${API_PROXY_PLATFORM}${p}`;
  }
  return integrationFetchUrl(path);
}

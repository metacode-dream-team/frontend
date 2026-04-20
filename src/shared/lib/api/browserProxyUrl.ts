/**
 * В браузере при включённом прокси fetch идёт на same-origin
 * (/api/backend/…, /api/backend-platform/…), Next rewrites проксируют на BACKEND_PROXY_* — без CORS.
 * В development прокси по умолчанию включён (см. shouldUseBrowserApiProxy).
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

/**
 * Прокси same-origin (/api/backend*) обходит CORS к API gateway (по умолчанию :8080).
 * - Явно: NEXT_PUBLIC_USE_API_PROXY=true / false / 1 / 0
 * - В development, если переменная не задана: включено (типичный localhost:5417 → API на других портах)
 * - В production: выключено, пока не задано true
 */
export function shouldUseBrowserApiProxy(): boolean {
  if (typeof window === "undefined") return false;
  const raw = process.env.NEXT_PUBLIC_USE_API_PROXY?.trim().toLowerCase();
  if (raw === "true" || raw === "1" || raw === "yes") return true;
  if (raw === "false" || raw === "0" || raw === "no") return false;
  return process.env.NODE_ENV === "development";
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
 * Integration и platform обычно на одном gateway; префикс /api/backend-platform при необходимости ведёт на тот же хост.
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

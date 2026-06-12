import { API_BASE_URL } from "@/shared/config/constants";

const ABSOLUTE_URL_RE = /^https?:\/\//i;

/** Same-origin BFF — see src/app/api/backend/[...path]/route.ts */
export const API_PROXY_PREFIX = "/api/backend";

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/** Browser: same-origin proxy (no CORS). SSR: direct gateway URL. */
function shouldUseBrowserProxy(): boolean {
  return typeof window !== "undefined";
}

export function normalizeApiPath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) {
    throw new Error("API path is required");
  }
  if (ABSOLUTE_URL_RE.test(trimmed)) {
    return trimmed;
  }

  let normalized = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;

  if (normalized === API_PROXY_PREFIX || normalized === `${API_PROXY_PREFIX}/`) {
    throw new Error(`API path is incomplete (got "${path}")`);
  }
  if (normalized.startsWith(`${API_PROXY_PREFIX}/`)) {
    normalized = normalized.slice(API_PROXY_PREFIX.length);
  }

  const base = stripTrailingSlash(API_BASE_URL);
  if (normalized.startsWith(base)) {
    normalized = normalized.slice(base.length);
    normalized = normalized.startsWith("/") ? normalized : `/${normalized}`;
  }

  if (normalized === "/" || normalized === "") {
    throw new Error(`API path is incomplete (got "${path}")`);
  }

  return normalized;
}

/**
 * Browser: /api/backend/v1/... → Route Handler → NEXT_PUBLIC_API_URL/v1/...
 * SSR:      NEXT_PUBLIC_API_URL/v1/...
 */
export function buildApiUrl(path: string): string {
  const normalized = normalizeApiPath(path);
  if (ABSOLUTE_URL_RE.test(normalized)) {
    return normalized;
  }
  if (shouldUseBrowserProxy()) {
    return `${API_PROXY_PREFIX}${normalized}`;
  }
  return `${stripTrailingSlash(API_BASE_URL)}${normalized}`;
}

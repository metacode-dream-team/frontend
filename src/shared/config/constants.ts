export const FRONTEND_DEV_PORT =
  process.env.NEXT_PUBLIC_FRONTEND_DEV_PORT?.trim() || "5417";

export const FRONTEND_DEV_ORIGIN = `http://localhost:${FRONTEND_DEV_PORT}`;

const ABSOLUTE_URL_RE = /^https?:\/\//i;

function stripTrailingSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

/** Backend API gateway (all services behind one host). */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() || "http://localhost:8080";

/**
 * Path suffix for buildApiUrl: NEXT_PUBLIC_API_URL + path.
 * Env may be "/v1/..." or a full URL — gateway prefix is stripped when it matches API_BASE_URL.
 */
function readApiPath(raw: string | undefined, fallback: string): string {
  const value = (raw?.trim() || fallback).trim();
  if (!value) return fallback;

  if (ABSOLUTE_URL_RE.test(value)) {
    const base = stripTrailingSlash(API_BASE_URL);
    if (value.startsWith(base)) {
      const suffix = value.slice(base.length);
      if (!suffix || suffix === "/") return fallback;
      return suffix.startsWith("/") ? suffix : `/${suffix}`;
    }
    return value;
  }

  let path = value.startsWith("/") ? value : `/${value}`;
  const proxyPrefix = "/api/backend";
  if (path.startsWith(`${proxyPrefix}/`)) {
    path = path.slice(proxyPrefix.length);
  }
  if (path === "/" || path === "") return fallback;

  return path;
}

export const AUTH_OAUTH_LINK_PATH = readApiPath(
  process.env.NEXT_PUBLIC_AUTH_OAUTH_LINK_PATH,
  "/v1/auth/oauth/link",
);

export const AUTH_OAUTH_TOKEN_PATH = readApiPath(
  process.env.NEXT_PUBLIC_AUTH_OAUTH_TOKEN_PATH,
  "/v1/auth/oauth/token",
);

export const AUTH_LOGIN_PATH = readApiPath(
  process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH,
  "/v1/auth/login",
);

export const AUTH_REGISTER_PATH = readApiPath(
  process.env.NEXT_PUBLIC_AUTH_REGISTER_PATH,
  "/v1/auth/register",
);

export const PROFILE_INTRO_PATH = readApiPath(
  process.env.NEXT_PUBLIC_PROFILE_INTRO_PATH,
  "/v1/profiles/me/intro",
);

export const PROFILE_FILL_PATH = readApiPath(
  process.env.NEXT_PUBLIC_PROFILE_FILL_PATH,
  "/v1/profiles/me/fill",
);

export const AVATAR_UPLOAD_PATH = readApiPath(
  process.env.NEXT_PUBLIC_AVATAR_UPLOAD_PATH,
  "/v1/fileservice/upload/avatar",
);

export const LEETCODE_BIND_PATH = readApiPath(
  process.env.NEXT_PUBLIC_LEETCODE_BIND_PATH,
  "/v1/integration/leetcode/bind",
);

export const LEETCODE_UNBIND_PATH = readApiPath(
  process.env.NEXT_PUBLIC_LEETCODE_UNBIND_PATH,
  "/v1/integration/leetcode/unbind",
);

export const GITHUB_UNLINK_PATH = readApiPath(
  process.env.NEXT_PUBLIC_GITHUB_UNLINK_PATH,
  "/v1/integration/github/unlink",
);

export const MONKEYTYPE_BIND_PATH = readApiPath(
  process.env.NEXT_PUBLIC_MONKEYTYPE_BIND_PATH,
  "/v1/integration/monkeytype/bind",
);

export const MONKEYTYPE_UNBIND_PATH = readApiPath(
  process.env.NEXT_PUBLIC_MONKEYTYPE_UNBIND_PATH,
  "/v1/integration/monkeytype/unbind",
);

export const NOTIFICATION_SSE_PATH = readApiPath(
  process.env.NEXT_PUBLIC_NOTIFICATION_SSE_PATH,
  "/v1/notification/sse/events",
);

export const LEETCODE_BIND_TIMEOUT_MS = 5 * 60 * 1000;

export const MONKEYTYPE_BIND_TIMEOUT_MS = 5 * 60 * 1000;

export const LEETCODE_VERIFICATION_SUCCEEDED_EVENT =
  "SYSTEM_LEETCODE_VERIFICATION_SUCCEEDED";

/** @deprecated fallback for older backend event name */
export const LEETCODE_LINKED_EVENT = "SYSTEM_LEETCODE_LINKED";

export const MONKEYTYPE_VERIFICATION_SUCCEEDED_EVENT =
  "SYSTEM_MONKEYTYPE_VERIFICATION_SUCCEEDED";

export const AUTH_REFRESH_PATH = readApiPath(
  process.env.NEXT_PUBLIC_AUTH_REFRESH_PATH,
  "/v1/auth/token/refresh",
);

export const AUTH_LOGOUT_PATH = readApiPath(
  process.env.NEXT_PUBLIC_AUTH_LOGOUT_PATH,
  "/v1/auth/logout",
);

/** HttpOnly refresh cookie name(s) set by auth gateway (cleared on logout via BFF). */
export const AUTH_REFRESH_COOKIE_NAMES: string[] = (
  process.env.NEXT_PUBLIC_AUTH_REFRESH_COOKIE_NAMES?.trim() || "refresh_token"
)
  .split(",")
  .map((name) => name.trim())
  .filter(Boolean);

export const KEYCLOAK_URL =
  process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080";
export const KEYCLOAK_REALM =
  process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "metacode";
export const KEYCLOAK_CLIENT_ID =
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "frontend-app";
export const REDIRECT_URI =
  typeof window !== "undefined" ? `${window.location.origin}/callback` : "";

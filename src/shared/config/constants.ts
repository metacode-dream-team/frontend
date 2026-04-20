export const FRONTEND_DEV_PORT =
  process.env.NEXT_PUBLIC_FRONTEND_DEV_PORT?.trim() || "5417";

export const FRONTEND_DEV_ORIGIN = `http://localhost:${FRONTEND_DEV_PORT}`;

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function readOptionalServiceUrl(
  raw: string | undefined,
  defaultUrl: string,
): string {
  const t = raw?.trim();
  if (
    raw !== undefined &&
    (t === "" || t === "0" || (t !== undefined && t.toLowerCase() === "false"))
  ) {
    return "";
  }
  return t || defaultUrl;
}

export const PLATFORM_API_URL = readOptionalServiceUrl(
  process.env.NEXT_PUBLIC_PLATFORM_API_URL,
  "http://localhost:8080",
);

function stripTrailingSlash(s: string): string {
  return s.replace(/\/$/, "");
}

export const PLATFORM_API_SERVER_BASE = PLATFORM_API_URL
  ? stripTrailingSlash(
      process.env.PLATFORM_API_SERVER_URL?.trim() || PLATFORM_API_URL,
    )
  : "";

export const INTEGRATION_API_URL =
  process.env.NEXT_PUBLIC_INTEGRATION_API_URL ||
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "http://localhost:8080";

export const INTEGRATION_API_SERVER_BASE = stripTrailingSlash(
  process.env.INTEGRATION_API_SERVER_URL?.trim() || INTEGRATION_API_URL,
);

export const AUTH_SERVICE_URL =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8080";

export const AUTH_API_SERVER_BASE = stripTrailingSlash(
  process.env.AUTH_API_SERVER_URL?.trim() || AUTH_SERVICE_URL,
);

export const AUTH_OAUTH_LINK_PATH =
  process.env.NEXT_PUBLIC_AUTH_OAUTH_LINK_PATH || "/v1/auth/oauth/link";

export const AUTH_OAUTH_TOKEN_PATH =
  process.env.NEXT_PUBLIC_AUTH_OAUTH_TOKEN_PATH || "/v1/auth/oauth/token";

export const AUTH_LOGIN_PATH =
  process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH || "/v1/auth/login";

export const AUTH_REFRESH_PATH =
  process.env.NEXT_PUBLIC_AUTH_REFRESH_PATH || "/v1/auth/token/refresh";

export const KEYCLOAK_URL =
  process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080";
export const KEYCLOAK_REALM =
  process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "metacode";
export const KEYCLOAK_CLIENT_ID =
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "frontend-app";
export const REDIRECT_URI =
  typeof window !== "undefined" ? `${window.location.origin}/callback` : "";

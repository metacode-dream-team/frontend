/**
 * Константы приложения
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

/**
 * Platform-сервис: профили, интеграции (GitHub / LeetCode / Monkeytype), календарь, достижения.
 * Пример: GET /v1/profiles/{username}, /v1/integration/profile?user_id=…
 *
 * Пустая строка / "false" / "0" — не ходить в platform (страница профиля сразу mock, без ECONNREFUSED).
 */
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
  "http://localhost:8082",
);

function stripTrailingSlash(s: string): string {
  return s.replace(/\/$/, "");
}

/**
 * База URL для fetch из Node (RSC, Server Actions): Docker / k8s DNS, не localhost с хоста.
 * Без NEXT_* — не попадает в клиентский бандл как значение по умолчанию от сервера при сборке.
 */
export const PLATFORM_API_SERVER_BASE = PLATFORM_API_URL
  ? stripTrailingSlash(
      process.env.PLATFORM_API_SERVER_URL?.trim() || PLATFORM_API_URL,
    )
  : "";

/**
 * Интеграции и активность: GET /v1/integration/profile, /v1/activity/…
 * Часто совпадает с auth-сервисом (:8080).
 */
export const INTEGRATION_API_URL =
  process.env.NEXT_PUBLIC_INTEGRATION_API_URL ||
  process.env.NEXT_PUBLIC_AUTH_URL ||
  "http://localhost:8080";

export const INTEGRATION_API_SERVER_BASE = stripTrailingSlash(
  process.env.INTEGRATION_API_SERVER_URL?.trim() || INTEGRATION_API_URL,
);

/**
 * Микросервис авторизации (логин, OAuth, refresh). По умолчанию :8080.
 *
 * Контракт refresh: refresh-токен только в httpOnly cookie (фронт его не хранит и не шлёт в body).
 * После логина бэкенд выставляет cookie; POST refresh с credentials: "include" — cookie уходит сама.
 * Нужны CORS с credentials и корректные SameSite/Secure у cookie (для cross-origin — согласовать с бэком).
 */
export const AUTH_SERVICE_URL =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8080";

export const AUTH_API_SERVER_BASE = stripTrailingSlash(
  process.env.AUTH_API_SERVER_URL?.trim() || AUTH_SERVICE_URL,
);

export const AUTH_OAUTH_LINK_PATH =
  process.env.NEXT_PUBLIC_AUTH_OAUTH_LINK_PATH || "/v1/auth/oauth/link";

/** POST: обмен code → токены (подстройте под контракт бэкенда) */
export const AUTH_OAUTH_TOKEN_PATH =
  process.env.NEXT_PUBLIC_AUTH_OAUTH_TOKEN_PATH || "/v1/auth/oauth/token";

/** POST: логин email/password → токены (+ refresh в cookie при необходимости) */
export const AUTH_LOGIN_PATH =
  process.env.NEXT_PUBLIC_AUTH_LOGIN_PATH || "/v1/auth/login";

/** POST: новый access — refresh только из httpOnly cookie */
export const AUTH_REFRESH_PATH =
  process.env.NEXT_PUBLIC_AUTH_REFRESH_PATH || "/v1/auth/token/refresh";

/** Keycloak (прямой OIDC / провайдеры вне auth-сервиса, напр. monkeytype) */
export const KEYCLOAK_URL =
  process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8080";
export const KEYCLOAK_REALM =
  process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "metacode";
export const KEYCLOAK_CLIENT_ID =
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "frontend-app";
export const REDIRECT_URI =
  typeof window !== "undefined" ? `${window.location.origin}/callback` : "";

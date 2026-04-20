/**
 * OAuth через отдельный микросервис авторизации (не Keycloak напрямую).
 * Старт: GET {AUTH}/v1/auth/oauth/link?provider=google|github
 * Callback на бэкенде: /v1/auth/callback — после этого пользователь обычно попадает на SPA /callback?code=...
 */

import {
  AUTH_OAUTH_LINK_PATH,
  AUTH_OAUTH_TOKEN_PATH,
  AUTH_SERVICE_URL,
  REDIRECT_URI,
} from "@/shared/config/constants";
import { resolveAuthUrlForFetch } from "@/shared/lib/api/browserProxyUrl";
import type { AuthTokens } from "@/shared/types/api";

export type AuthServiceOAuthProvider = "google" | "github";

function baseUrl(): string {
  return AUTH_SERVICE_URL.replace(/\/$/, "");
}

/**
 * Полный URL для редиректа браузера на OAuth (Google / GitHub).
 * Добавляем redirect_uri, чтобы после /v1/auth/callback сервис вернул пользователя на фронт с code.
 */
export function getOAuthLinkUrl(provider: AuthServiceOAuthProvider): string {
  const url = new URL(`${baseUrl()}${AUTH_OAUTH_LINK_PATH}`);
  url.searchParams.set("provider", provider);
  if (typeof window !== "undefined" && REDIRECT_URI) {
    url.searchParams.set("redirect_uri", REDIRECT_URI);
  }
  return url.toString();
}

/**
 * Запускает OAuth: полный переход браузера на сервис авторизации.
 */
export function startAuthServiceOAuth(
  provider: AuthServiceOAuthProvider,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (!window.crypto?.subtle) {
    alert(
      "OAuth requires a secure context. Open the app via http://localhost:3000 or HTTPS.",
    );
    return false;
  }

  try {
    window.location.href = getOAuthLinkUrl(provider);
    return true;
  } catch (e) {
    console.error("Failed to start OAuth:", e);
    return false;
  }
}

/**
 * Обмен authorization code на токены у сервиса авторизации (после редиректа на /callback?code=...).
 */
export async function exchangeAuthServiceCodeForTokens(
  code: string,
): Promise<AuthTokens> {
  const redirectUri =
    typeof window !== "undefined" ? REDIRECT_URI : "";

  const response = await fetch(
    resolveAuthUrlForFetch(AUTH_OAUTH_TOKEN_PATH),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        code,
        redirect_uri: redirectUri,
      }),
    },
  );

  if (!response.ok) {
    const err = await response
      .json()
      .catch(() => ({ error: "Token exchange failed" }));
    const msg =
      typeof err === "object" && err && "error" in err
        ? String((err as { error?: string }).error)
        : "Token exchange failed";
    throw new Error(msg);
  }

  return response.json() as Promise<AuthTokens>;
}

import {
  API_BASE_URL,
  AUTH_OAUTH_LINK_PATH,
  AUTH_OAUTH_TOKEN_PATH,
  FRONTEND_DEV_ORIGIN,
  REDIRECT_URI,
} from "@/shared/config/constants";
import { buildApiUrl } from "@/shared/lib/api/apiUrl";
import { normalizeAuthTokens } from "@/shared/lib/auth/normalizeAuthTokens";
import type { AuthTokens } from "@/shared/types/api";

export type AuthServiceOAuthProvider = "google" | "github";

function baseUrl(): string {
  return API_BASE_URL.replace(/\/$/, "");
}

export function getOAuthLinkUrl(provider: AuthServiceOAuthProvider): string {
  const url = new URL(`${baseUrl()}${AUTH_OAUTH_LINK_PATH}`);
  url.searchParams.set("provider", provider);
  if (typeof window !== "undefined" && REDIRECT_URI) {
    url.searchParams.set("redirect_uri", REDIRECT_URI);
  }
  return url.toString();
}

export function startAuthServiceOAuth(
  provider: AuthServiceOAuthProvider,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  if (!window.crypto?.subtle) {
    alert(
      `OAuth requires a secure context. Open the app via ${FRONTEND_DEV_ORIGIN} or HTTPS.`,
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

export async function exchangeAuthServiceCodeForTokens(
  code: string,
): Promise<AuthTokens> {
  const redirectUri =
    typeof window !== "undefined" ? REDIRECT_URI : "";

  const response = await fetch(
    buildApiUrl(AUTH_OAUTH_TOKEN_PATH),
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

  const raw = (await response.json()) as unknown;
  try {
    const tokens = normalizeAuthTokens(raw);
    if (process.env.NODE_ENV === "development") {
      console.log("[OAuth] Token exchange response:", {
        refresh_token_in_body: Boolean(tokens.refresh_token),
        set_cookie_readable:
          "Set-Cookie is not exposed to fetch in the browser; check DevTools > Application > Cookies on this origin",
      });
    }
    return tokens;
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("[OAuth] Token response parse failed:", raw, err);
    }
    throw err;
  }
}

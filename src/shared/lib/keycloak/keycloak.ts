/**
 * Keycloak OAuth2 клиент для социальной аутентификации
 */

import {
  KEYCLOAK_URL,
  KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID,
  REDIRECT_URI,
} from "@/shared/config/constants";
import { generatePKCE } from "./pkce";
import type { AuthTokens } from "@/shared/types/api";

const PKCE_VERIFIER_KEY = "pkce_verifier";

/**
 * Генерирует URL для авторизации через Keycloak
 */
export async function getLoginUrl(
  provider?: "google" | "github",
): Promise<string> {
  const { codeVerifier, codeChallenge } = await generatePKCE();

  // Сохраняем code_verifier в localStorage для последующего использования
  if (typeof window !== "undefined") {
    localStorage.setItem(PKCE_VERIFIER_KEY, codeVerifier);
  }

  const params = new URLSearchParams({
    client_id: KEYCLOAK_CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: "openid profile email",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  if (provider) {
    params.append("kc_idp_hint", provider);
  }

  return `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth?${params.toString()}`;
}

/**
 * Генерирует URL для привязки GitHub аккаунта (AIA)
 */
export async function getLinkGithubUrl(): Promise<string> {
  const { codeVerifier, codeChallenge } = await generatePKCE();

  if (typeof window !== "undefined") {
    localStorage.setItem(PKCE_VERIFIER_KEY, codeVerifier);
  }

  const params = new URLSearchParams({
    client_id: KEYCLOAK_CLIENT_ID,
    response_type: "code",
    redirect_uri: REDIRECT_URI,
    scope: "openid",
    kc_action: "idp_link",
    kc_idp_hint: "github",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  return `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth?${params.toString()}`;
}

/**
 * Обменивает authorization code на токены
 */
export async function exchangeCodeForTokens(code: string): Promise<AuthTokens> {
  const codeVerifier =
    typeof window !== "undefined"
      ? localStorage.getItem(PKCE_VERIFIER_KEY)
      : null;

  if (!codeVerifier) {
    throw new Error("Code verifier not found");
  }

  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: KEYCLOAK_CLIENT_ID,
    code_verifier: codeVerifier,
  });

  const response = await fetch(
    `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error_description: "Token exchange failed" }));
    throw new Error(error.error_description || "Token exchange failed");
  }

  const tokens = (await response.json()) as AuthTokens;

  // Удаляем code_verifier после использования
  if (typeof window !== "undefined") {
    localStorage.removeItem(PKCE_VERIFIER_KEY);
  }

  return tokens;
}

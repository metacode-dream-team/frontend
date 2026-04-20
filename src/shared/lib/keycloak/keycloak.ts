import {
  FRONTEND_DEV_ORIGIN,
  FRONTEND_DEV_PORT,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_REALM,
  KEYCLOAK_URL,
  REDIRECT_URI,
} from "@/shared/config/constants";
import { generatePKCE } from "./pkce";
import type { AuthTokens } from "@/shared/types/api";

const PKCE_VERIFIER_KEY = "pkce_verifier";

export type KeycloakIdpHint =
  | "google"
  | "github"
  | "monkeytype"
  | "leetcode";

export async function getLoginUrl(
  provider?: KeycloakIdpHint,
): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("getLoginUrl can only be called in the browser");
  }

  const { codeVerifier, codeChallenge } = await generatePKCE();

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

export async function startKeycloakIdpLogin(
  provider: KeycloakIdpHint,
): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  if (!window.crypto?.subtle) {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    alert(
      `Social login requires a secure context.\n` +
        `Current: ${protocol}//${hostname}\n\n` +
        `Please access the app via:\n` +
        `- ${FRONTEND_DEV_ORIGIN} (recommended)\n` +
        `- http://127.0.0.1:${FRONTEND_DEV_PORT}\n` +
        `- https:// (in production)`,
    );
    return false;
  }

  try {
    const url = await getLoginUrl(provider);
    window.location.href = url;
    return true;
  } catch (error) {
    console.error(`Failed to initiate ${provider} login:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (errorMessage.includes("crypto.subtle")) {
      alert(
        `Social login is not available in this context.\n\n` +
          `Please access the app via http://localhost:PORT or use HTTPS.`,
      );
    }
    return false;
  }
}

export async function getLinkGithubUrl(): Promise<string> {
  if (typeof window === "undefined") {
    throw new Error("getLinkGithubUrl can only be called in the browser");
  }

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

export async function exchangeCodeForTokens(code: string): Promise<AuthTokens> {
  if (typeof window === "undefined") {
    throw new Error("exchangeCodeForTokens can only be called in the browser");
  }

  const codeVerifier = localStorage.getItem(PKCE_VERIFIER_KEY);

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
    console.error("[Keycloak] ❌ Token exchange failed:", error);
    console.error("[Keycloak] 💡 Status:", response.status);
    console.error("[Keycloak] 💡 Check Keycloak configuration and PKCE verifier");
    throw new Error(error.error_description || "Token exchange failed");
  }

  const tokens = (await response.json()) as AuthTokens;
  console.log("[Keycloak] ✅ Tokens received from Keycloak");
  console.log("[Keycloak] ⚠️ Note: These tokens are from Keycloak, NOT from backend");
  console.log("[Keycloak] ⚠️ Backend refresh_token cookie will NOT be set!");

  localStorage.removeItem(PKCE_VERIFIER_KEY);

  return tokens;
}

/**
 * PKCE (Proof Key for Code Exchange) утилиты для OAuth2
 * Работает только на клиенте (браузер)
 */

/**
 * Проверяет, что код выполняется в браузере
 */
function isBrowser(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof crypto !== "undefined" &&
    typeof window.crypto !== "undefined"
  );
}

/**
 * Проверяет доступность crypto.subtle
 */
function isSubtleAvailable(): boolean {
  if (!isBrowser()) {
    return false;
  }

  // crypto.subtle доступен только в безопасном контексте (HTTPS или localhost)
  try {
    return (
      typeof crypto.subtle !== "undefined" &&
      typeof crypto.subtle.digest === "function"
    );
  } catch {
    return false;
  }
}

/**
 * Генерирует случайную строку для code_verifier
 */
export function generateRandomString(length: number = 64): string {
  if (!isBrowser()) {
    throw new Error("generateRandomString can only be called in the browser");
  }

  if (!crypto.getRandomValues) {
    throw new Error("crypto.getRandomValues is not available");
  }

  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => ("0" + (b % 36).toString(36)).slice(-1)).join(
    "",
  );
}

/**
 * Вычисляет SHA256 hash
 */
async function sha256(plain: string): Promise<ArrayBuffer> {
  if (!isBrowser()) {
    throw new Error("sha256 can only be called in the browser");
  }

  if (!isSubtleAvailable()) {
    const protocol = typeof window !== "undefined" ? window.location?.protocol : "unknown";
    const hostname = typeof window !== "undefined" ? window.location?.hostname : "unknown";
    
    throw new Error(
      `crypto.subtle is not available. ` +
      `Protocol: ${protocol}, Hostname: ${hostname}. ` +
      `Make sure you're using HTTPS or localhost (http://localhost or http://127.0.0.1).`
    );
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest("SHA-256", data);
}

/**
 * Кодирует ArrayBuffer в base64url
 */
function base64UrlEncode(buffer: ArrayBuffer): string {
  if (typeof btoa === "undefined") {
    throw new Error("btoa is not available");
  }

  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Генерирует code_verifier и code_challenge для PKCE
 * Работает только на клиенте (браузер) в безопасном контексте
 */
export async function generatePKCE(): Promise<{
  codeVerifier: string;
  codeChallenge: string;
}> {
  if (!isBrowser()) {
    throw new Error("generatePKCE can only be called in the browser");
  }

  if (!isSubtleAvailable()) {
    const protocol = typeof window !== "undefined" ? window.location?.protocol : "unknown";
    const hostname = typeof window !== "undefined" ? window.location?.hostname : "unknown";
    
    throw new Error(
      `crypto.subtle is required for PKCE but is not available. ` +
      `Current context: ${protocol}//${hostname}. ` +
      `PKCE requires a secure context (HTTPS or localhost). ` +
      `If you're on localhost, make sure you're accessing via http://localhost:PORT or http://127.0.0.1:PORT`
    );
  }

  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64UrlEncode(hashed);

  return { codeVerifier, codeChallenge };
}

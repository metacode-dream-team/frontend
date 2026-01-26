/**
 * PKCE (Proof Key for Code Exchange) утилиты для OAuth2
 */

/**
 * Генерирует случайную строку для code_verifier
 */
export function generateRandomString(length: number = 64): string {
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
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return crypto.subtle.digest("SHA-256", data);
}

/**
 * Кодирует ArrayBuffer в base64url
 */
function base64UrlEncode(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * Генерирует code_verifier и code_challenge для PKCE
 */
export async function generatePKCE(): Promise<{
  codeVerifier: string;
  codeChallenge: string;
}> {
  const codeVerifier = generateRandomString(64);
  const hashed = await sha256(codeVerifier);
  const codeChallenge = base64UrlEncode(hashed);

  return { codeVerifier, codeChallenge };
}

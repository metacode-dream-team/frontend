/**
 * Утилиты для работы с JWT токенами
 */

/**
 * Декодирует JWT токен без проверки подписи
 * Используется только для извлечения payload (exp, iat и т.д.)
 */
export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Проверяет, истек ли токен
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) {
    return true;
  }

  const exp =
    typeof decoded.exp === "number" ? decoded.exp : Number(decoded.exp);
  const now = Math.floor(Date.now() / 1000);

  return exp < now;
}

/**
 * Получает время истечения токена в миллисекундах
 */
export function getTokenExpirationTime(token: string): number | null {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) {
    return null;
  }

  const exp =
    typeof decoded.exp === "number" ? decoded.exp : Number(decoded.exp);
  return exp * 1000; // Конвертируем в миллисекунды
}

/**
 * Получает время до истечения токена в миллисекундах
 */
export function getTimeUntilExpiration(token: string): number | null {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) {
    return null;
  }

  return expirationTime - Date.now();
}

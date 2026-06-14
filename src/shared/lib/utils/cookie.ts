/**
 * Утилиты для работы с cookies (только для отладки)
 * httpOnly cookies недоступны из JavaScript, но можно проверить их наличие через запрос
 */

import { AUTH_REFRESH_PATH } from "@/shared/config/constants";
import { buildApiUrl } from "@/shared/lib/api/apiUrl";

/**
 * Проверяет наличие refresh token cookie через тестовый запрос
 * Только для отладки!
 */
export async function checkRefreshTokenCookie(): Promise<{
  exists: boolean;
  status: number;
  message: string;
  details?: string;
}> {
  const refreshUrl = buildApiUrl(AUTH_REFRESH_PATH);

  try {
    console.log("[Cookie Debug] Checking refresh token cookie...");
    console.log("[Cookie Debug] URL:", refreshUrl);

    const response = await fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({}),
    });

    const status = response.status;
    let message = "";
    let details = "";

    if (status === 200 || status === 201) {
      message = "Refresh token cookie exists and is valid";
      details = "Backend accepted the refresh token from cookie";
      console.log("[Cookie Debug] Refresh token cookie is present and valid");
    } else if (status === 401) {
      message = "No refresh token cookie or it's invalid";
      details = "Backend returned 401 - cookie not found or expired";
      console.warn("[Cookie Debug] Refresh token cookie not found or invalid");
      console.warn("[Cookie Debug] Possible reasons:");
      console.warn("[Cookie Debug]   1. Backend didn't set cookie on login/OAuth");
      console.warn("[Cookie Debug]   2. Cookie expired");
      console.warn("[Cookie Debug]   3. Cookie domain/path mismatch");
      console.warn("[Cookie Debug]   4. CORS issue with credentials");
    } else {
      message = `Unexpected status: ${status}`;
      details = `Backend returned status ${status}`;
      console.warn("[Cookie Debug] Unexpected response status:", status);
    }

    return {
      exists: status !== 401,
      status,
      message,
      details,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[Cookie Debug] Error checking cookie:", errorMessage);
    return {
      exists: false,
      status: 0,
      message: "Network error",
      details: errorMessage,
    };
  }
}

/**
 * Диагностика проблем с refresh token
 * Выводит подробную информацию в консоль
 */
export async function diagnoseRefreshToken(): Promise<void> {
  console.log("=".repeat(60));
  console.log("REFRESH TOKEN DIAGNOSTICS");
  console.log("=".repeat(60));

  console.log(
    "\nCurrent origin:",
    typeof window !== "undefined" ? window.location.origin : "SSR",
  );

  console.log("\nChecking refresh token cookie...");
  const result = await checkRefreshTokenCookie();

  console.log("\nResult:");
  console.log("  Status:", result.status);
  console.log("  Message:", result.message);
  if (result.details) {
    console.log("  Details:", result.details);
  }

  console.log("\nHow to check manually:");
  console.log("  1. Open browser DevTools (F12)");
  console.log("  2. Go to Application > Cookies");
  console.log("  3. Look for refresh_token cookie on the frontend origin");
  console.log("  4. Check HttpOnly flag and path");

  console.log("=".repeat(60));
}

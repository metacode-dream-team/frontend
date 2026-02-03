/**
 * API клиент с автоматическим refresh токенов
 */

import { API_BASE_URL } from "@/shared/config/constants";
import type { ApiError, AuthTokens, RefreshTokenResponse } from "@/shared/types/api";

class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Обновление access token через refresh token
   * Использует cookie для refresh token (httpOnly)
   * Refresh token НЕ отправляется в body, а автоматически отправляется браузером в cookie
   * Вызывается извне через authApi.refreshTokens()
   */
  async refreshAccessToken(): Promise<RefreshTokenResponse> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = fetch(`${this.baseUrl}/v1/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Важно: автоматически отправляет httpOnly cookie с refresh_token
      body: JSON.stringify({}), // Пустой body, refresh token в cookie
    })
      .then(async (response) => {
        if (!response.ok) {
          let errorData: ApiError;
          try {
            errorData = await response.json();
          } catch {
            errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
          }

          if (response.status !== 401) {
            console.error("[API] Refresh failed:", response.status, errorData);
          }

          const errorMessage = errorData.error || "Token refresh failed";
          const refreshError = new Error(errorMessage) as Error & {
            status?: number;
            isUnauthorized?: boolean;
            isNetworkError?: boolean;
          };
          refreshError.status = response.status;
          refreshError.isUnauthorized = response.status === 401;

          throw refreshError;
        }

        let tokens: RefreshTokenResponse;
        try {
          tokens = (await response.json()) as RefreshTokenResponse;
        } catch (parseError) {
          console.error("[API] Refresh: invalid JSON response", parseError);
          throw new Error("Invalid response format from refresh endpoint");
        }

        return tokens;
      })
      .catch((error) => {
        if (error?.isUnauthorized !== undefined) {
          throw error;
        }
        if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
          console.warn("[API] Refresh: backend unavailable at", this.baseUrl);
          const networkError = new Error("Backend unavailable") as Error & { isNetworkError?: boolean };
          networkError.isNetworkError = true;
          throw networkError;
        }
        throw error;
      })
      .finally(() => {
        this.refreshPromise = null;
      });

    return this.refreshPromise;
  }

  /**
   * Обработка ответа с автоматическим refresh при 401
   */
  private async handleResponse<T>(
    response: Response,
    accessToken: string | null,
  ): Promise<T> {
    // Если получили 401 и есть access token, пытаемся обновить
    if (response.status === 401 && accessToken) {
      try {
        const newTokens = await this.refreshAccessToken();
        // Повторяем запрос с новым токеном
        // Но для этого нужно знать оригинальный запрос...
        // В реальности лучше использовать interceptor или middleware
        throw new Error("Token expired, please retry");
      } catch (error) {
        // Если refresh не удался, пробрасываем ошибку
        throw error;
      }
    }

    if (!response.ok) {
      const errorMessage = await this.parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }

  /**
   * Парсит тело ошибки из ответа (JSON, text или стандартное сообщение по коду).
   */
  private async parseErrorResponse(response: Response): Promise<string> {
    const contentType = response.headers.get("content-type") ?? "";
    try {
      if (contentType.includes("application/json")) {
        const data: ApiError = await response.json();
        return data.error ?? "Request failed";
      }
      if (response.status < 500 && contentType.includes("text/")) {
        const text = await response.text();
        const trimmed = text.trim().slice(0, 200);
        if (trimmed) return trimmed;
      }
    } catch {
      // ignore parse errors
    }
    if (response.status >= 500) return "Server error. Please try again later.";
    if (response.status === 400) return "Invalid request.";
    if (response.status === 401) return "Unauthorized.";
    if (response.status === 403) return "Access denied.";
    if (response.status === 404) return "Not found.";
    return "Request failed.";
  }

  /**
   * GET запрос
   */
  async get<T>(url: string, accessToken: string | null = null): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "GET",
      headers,
      credentials: "include",
    });

    return this.handleResponse<T>(response, accessToken);
  }

  /**
   * POST запрос
   */
  async post<T>(
    url: string,
    data: unknown,
    accessToken: string | null = null,
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    });

    // Логируем Set-Cookie заголовки для диагностики (особенно для /v1/login)
    if (url.includes("/login")) {
      console.log("[API] 📋 Login response headers:", Object.fromEntries(response.headers.entries()));
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        console.log("[API] ✅ Backend set cookie:", setCookieHeader);
        console.log("[API] 💡 Check if refresh_token cookie was set");
      } else {
        console.warn("[API] ⚠️ No Set-Cookie header in login response!");
        console.warn("[API] 💡 Backend should set refresh_token cookie via Set-Cookie header");
      }
    }

    return this.handleResponse<T>(response, accessToken);
  }

  /**
   * PUT запрос
   */
  async put<T>(
    url: string,
    data: unknown,
    accessToken: string | null = null,
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "PUT",
      headers,
      credentials: "include",
      body: JSON.stringify(data),
    });

    return this.handleResponse<T>(response, accessToken);
  }

  /**
   * DELETE запрос
   */
  async delete<T>(url: string, accessToken: string | null = null): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "DELETE",
      headers,
      credentials: "include",
    });

    return this.handleResponse<T>(response, accessToken);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

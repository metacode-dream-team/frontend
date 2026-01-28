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
      console.log("[API] Refresh already in progress, returning existing promise");
      return this.refreshPromise;
    }

    console.log("[API] 🔄 Refreshing token...");
    console.log("[API] 📍 URL:", `${this.baseUrl}/v1/token/refresh`);
    console.log("[API] 🔐 Using credentials: include (will send httpOnly cookies)");
    
    this.refreshPromise = fetch(`${this.baseUrl}/v1/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Важно: автоматически отправляет httpOnly cookie с refresh_token
      body: JSON.stringify({}), // Пустой body, refresh token в cookie
    })
      .then(async (response) => {
        console.log("[API] 📥 Refresh response status:", response.status);
        console.log("[API] 📥 Response headers:", Object.fromEntries(response.headers.entries()));
        
        if (!response.ok) {
          let errorData: ApiError;
          try {
            errorData = await response.json();
          } catch {
            // Если не удалось распарсить JSON, создаем ошибку из статуса
            errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
          }
          
          console.error("[API] ❌ Refresh failed:", errorData);
          console.error("[API] 💡 Possible reasons:");
          console.error("[API]   1. Backend didn't set refresh_token cookie on login");
          console.error("[API]   2. Refresh token expired or invalid");
          console.error("[API]   3. CORS issue - check if backend allows credentials");
          console.error("[API]   4. Cookie domain/path mismatch");
          
          // Создаем специальный тип ошибки для 401 (нет refresh token)
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
        
        // Response не содержит refresh_token (он остается в cookie)
        let tokens: RefreshTokenResponse;
        try {
          tokens = await response.json() as RefreshTokenResponse;
          console.log("[API] ✅ Refresh successful!");
          console.log("[API] 📦 Received tokens:", {
            access_token: tokens.access_token ? "✓" : "✗",
            id_token: tokens.id_token ? "✓" : "✗",
            expires_in: tokens.expires_in,
          });
        } catch (parseError) {
          console.error("[API] ❌ Failed to parse response as JSON:", parseError);
          throw new Error("Invalid response format from refresh endpoint");
        }
        
        return tokens;
      })
      .catch((error) => {
        // Обрабатываем сетевые ошибки
        if (error instanceof TypeError && error.message.includes("Failed to fetch")) {
          console.error("[API] ❌ Network error during refresh");
          console.error("[API] 💡 Check if backend is running on:", this.baseUrl);
          const networkError = new Error("Backend unavailable") as Error & { isNetworkError?: boolean };
          networkError.isNetworkError = true;
          throw networkError;
        }
        
        // Если ошибка уже обработана выше, просто пробрасываем
        if (error.status || error.isUnauthorized || error.isNetworkError) {
          throw error;
        }
        
        // Неожиданная ошибка
        console.error("[API] ❌ Unexpected error during refresh:", error);
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
      const error: ApiError = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(error.error || "Request failed");
    }

    return response.json() as Promise<T>;
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

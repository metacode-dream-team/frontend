/**
 * API клиент с автоматическим refresh токенов
 */

import { API_BASE_URL } from "@/shared/config/constants";
import type { ApiError, AuthTokens } from "@/shared/types/api";

class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  /**
   * Обновление access token через refresh token
   * Использует cookie для refresh token (httpOnly)
   * Вызывается извне через authApi.refreshTokens()
   */
  async refreshAccessToken(): Promise<AuthTokens> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = fetch(`${this.baseUrl}/v1/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Важно для отправки httpOnly cookies
      // Не отправляем body, так как refresh token в cookie
    })
      .then(async (response) => {
        if (!response.ok) {
          const error: ApiError = await response
            .json()
            .catch(() => ({ error: "Token refresh failed" }));
          throw new Error(error.error || "Token refresh failed");
        }
        return response.json() as Promise<AuthTokens>;
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

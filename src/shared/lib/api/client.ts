import { API_BASE_URL, AUTH_REFRESH_PATH } from "@/shared/config/constants";
import { resolveAuthUrlForFetch } from "@/shared/lib/api/browserProxyUrl";
import type { ApiError, AuthTokens, RefreshTokenResponse } from "@/shared/types/api";

class ApiClient {
  private baseUrl: string;
  private refreshPromise: Promise<AuthTokens> | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async refreshAccessToken(): Promise<RefreshTokenResponse> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    const refreshUrl = resolveAuthUrlForFetch(AUTH_REFRESH_PATH);
    this.refreshPromise = fetch(refreshUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({}),
    })
      .then(async (response) => {
        if (!response.ok) {
          let errorData: ApiError;
          try {
            errorData = await response.json();
          } catch {
            errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
          }

          const silent =
            response.status === 401 || response.status === 404;
          if (!silent) {
            console.error("[API] Refresh failed:", response.status, errorData);
          }

          const errorMessage = errorData.error || "Token refresh failed";
          const refreshError = new Error(errorMessage) as Error & {
            status?: number;
            isUnauthorized?: boolean;
            isNetworkError?: boolean;
          };
          refreshError.status = response.status;
          refreshError.isUnauthorized =
            response.status === 401 || response.status === 404;

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
          console.warn("[API] Refresh: backend unavailable at", refreshUrl);
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

  private async handleResponse<T>(
    response: Response,
    accessToken: string | null,
  ): Promise<T> {
    if (response.status === 401 && accessToken) {
      await this.refreshAccessToken();
      throw new Error("Token expired, please retry");
    }

    if (!response.ok) {
      const errorMessage = await this.parseErrorResponse(response);
      throw new Error(errorMessage);
    }

    return response.json() as Promise<T>;
  }

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
    } catch {}
    if (response.status >= 500) return "Server error. Please try again later.";
    if (response.status === 400) return "Invalid request.";
    if (response.status === 401) return "Unauthorized.";
    if (response.status === 403) return "Access denied.";
    if (response.status === 404) return "Not found.";
    return "Request failed.";
  }

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

import {
  AUTH_LOGIN_PATH,
  AUTH_LOGOUT_PATH,
  AUTH_REGISTER_PATH,
} from "@/shared/config/constants";
import { buildApiUrl } from "@/shared/lib/api/apiUrl";
import { apiClient } from "@/shared/lib/api/client";
import { normalizeAuthTokens } from "@/shared/lib/auth/normalizeAuthTokens";
import type {
  AuthTokens,
  RefreshTokenResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiSuccess,
} from "@/shared/types/api";

async function parseAuthError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as {
      error?: string;
      message?: string;
    };
    return data.error ?? data.message ?? "Login failed";
  } catch {
    return response.status === 401 ? "Invalid email or password" : "Login failed";
  }
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiSuccess> => {
    const response = await fetch(buildApiUrl(AUTH_REGISTER_PATH), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(await parseAuthError(response));
    }

    return response.json() as Promise<ApiSuccess>;
  },

  login: async (data: LoginRequest): Promise<AuthTokens> => {
    const response = await fetch(buildApiUrl(AUTH_LOGIN_PATH), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });

    if (!response.ok) {
      throw new Error(await parseAuthError(response));
    }

    const raw = (await response.json()) as Record<string, unknown>;
    return normalizeAuthTokens(raw);
  },

  verifyEmail: async (token: string): Promise<ApiSuccess> => {
    return apiClient.post<ApiSuccess>(`/v1/auth/verify-email?token=${token}`, {});
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiSuccess> => {
    return apiClient.post<ApiSuccess>("/v1/forgot-password", data);
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<ApiSuccess> => {
    return apiClient.post<ApiSuccess>("/v1/reset-password", data);
  },

  refreshTokens: async (): Promise<RefreshTokenResponse> => {
    return apiClient.refreshAccessToken();
  },

  logout: async (): Promise<void> => {
    try {
      await fetch(buildApiUrl(AUTH_LOGOUT_PATH), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({}),
      });
    } catch {
      // best-effort: ignore network/backend errors so logout still clears local state
    }
  },
};

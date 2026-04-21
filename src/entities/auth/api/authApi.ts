import { AUTH_LOGIN_PATH, AUTH_LOGOUT_PATH } from "@/shared/config/constants";
import { resolveAuthUrlForFetch } from "@/shared/lib/api/browserProxyUrl";
import { apiClient } from "@/shared/lib/api/client";
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

function unwrapTokenPayload(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") {
    return {};
  }
  const r = raw as Record<string, unknown>;
  const nested =
    r.data && typeof r.data === "object"
      ? (r.data as Record<string, unknown>)
      : r.tokens && typeof r.tokens === "object"
        ? (r.tokens as Record<string, unknown>)
        : r.result && typeof r.result === "object"
          ? (r.result as Record<string, unknown>)
          : null;
  if (!nested) {
    return r;
  }
  return { ...r, ...nested };
}

function normalizeAuthTokens(raw: Record<string, unknown>): AuthTokens {
  const flat = unwrapTokenPayload(raw);
  const access =
    (flat.access_token as string | undefined) ??
    (flat.accessToken as string | undefined);
  if (!access) {
    throw new Error("Invalid login response: missing access token");
  }
  return {
    access_token: access,
    id_token:
      (flat.id_token as string | undefined) ??
      (flat.idToken as string | undefined) ??
      "",
    expires_in: Number(flat.expires_in ?? flat.expiresIn ?? 3600),
    token_type:
      (flat.token_type as string) ?? (flat.tokenType as string) ?? "Bearer",
    refresh_token: flat.refresh_token as string | undefined,
  };
}

export const authApi = {
  register: async (data: RegisterRequest): Promise<ApiSuccess> => {
    return apiClient.post<ApiSuccess>("/v1/register", data);
  },

  login: async (data: LoginRequest): Promise<AuthTokens> => {
    const response = await fetch(resolveAuthUrlForFetch(AUTH_LOGIN_PATH), {
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
    return apiClient.post<ApiSuccess>(`/v1/verify-email?token=${token}`, {});
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
      await fetch(resolveAuthUrlForFetch(AUTH_LOGOUT_PATH), {
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

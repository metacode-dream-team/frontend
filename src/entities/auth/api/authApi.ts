/**
 * API методы для авторизации
 */

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

export const authApi = {
  /**
   * Регистрация пользователя
   */
  register: async (data: RegisterRequest): Promise<ApiSuccess> => {
    return apiClient.post<ApiSuccess>("/v1/register", data);
  },

  /**
   * Вход в систему
   * Бэкенд должен установить refresh_token в httpOnly cookie через Set-Cookie header
   */
  login: async (data: LoginRequest): Promise<AuthTokens> => {
    console.log("[API] 🔐 Logging in...");
    console.log("[API] 📍 Endpoint: /v1/login");
    console.log("[API] 💡 Backend should set refresh_token cookie in response");
    const response = await apiClient.post<AuthTokens>("/v1/login", data);
    console.log("[API] ✅ Login successful");
    console.log("[API] 💡 Check browser DevTools > Application > Cookies for refresh_token");
    return response;
  },

  /**
   * Верификация email
   */
  verifyEmail: async (token: string): Promise<ApiSuccess> => {
    return apiClient.post<ApiSuccess>(`/v1/verify-email?token=${token}`, {});
  },

  /**
   * Запрос на восстановление пароля
   */
  forgotPassword: async (data: ForgotPasswordRequest): Promise<ApiSuccess> => {
    return apiClient.post<ApiSuccess>("/v1/forgot-password", data);
  },

  /**
   * Сброс пароля
   */
  resetPassword: async (data: ResetPasswordRequest): Promise<ApiSuccess> => {
    return apiClient.post<ApiSuccess>("/v1/reset-password", data);
  },

  /**
   * Обновление токенов
   * Refresh token отправляется автоматически в httpOnly cookie браузером
   * Response не содержит refresh_token (он остается в cookie)
   */
  refreshTokens: async (): Promise<RefreshTokenResponse> => {
    return apiClient.refreshAccessToken();
  },
};

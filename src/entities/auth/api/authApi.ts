/**
 * API методы для авторизации
 */

import { apiClient } from "@/shared/lib/api/client";
import type {
  AuthTokens,
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
   */
  login: async (data: LoginRequest): Promise<AuthTokens> => {
    return apiClient.post<AuthTokens>("/v1/login", data);
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
   * Refresh token отправляется автоматически в httpOnly cookie
   */
  refreshTokens: async (): Promise<AuthTokens> => {
    return apiClient.refreshAccessToken();
  },
};

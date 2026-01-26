/**
 * Zustand store для авторизации
 * Access token хранится в памяти (без persist)
 * Refresh token хранится в httpOnly cookie (управляется бэкендом)
 */

import { create } from "zustand";
import type { AuthStore } from "./types";
import { authApi } from "../api/authApi";
import { isTokenExpired, getTimeUntilExpiration } from "@/shared/lib/utils/jwt";

export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  accessToken: null,
  idToken: null,
  expiresIn: null,
  isAuthenticated: false,

  // Actions
  setTokens: (accessToken, idToken, expiresIn) => {
    set({
      accessToken,
      idToken,
      expiresIn,
      isAuthenticated: true,
    });

    // Настраиваем автоматическое обновление токена за 1 минуту до истечения
    const timeUntilExpiration = expiresIn * 1000 - 60000; // минус 1 минута
    if (timeUntilExpiration > 0) {
      setTimeout(() => {
        get().refreshToken();
      }, timeUntilExpiration);
    }
  },

  setAccessToken: (token) => {
    set({
      accessToken: token,
      isAuthenticated: !!token,
    });
  },

  logout: () => {
    set({
      accessToken: null,
      idToken: null,
      expiresIn: null,
      isAuthenticated: false,
    });
  },

  refreshToken: async () => {
    try {
      const tokens = await authApi.refreshTokens();
      get().setTokens(tokens.access_token, tokens.id_token, tokens.expires_in);
    } catch (error) {
      console.error("Failed to refresh token:", error);
      // При неудаче refresh - разлогиниваем пользователя
      get().logout();
      throw error;
    }
  },
}));

/**
 * Хук для проверки валидности токена и автоматического refresh
 */
export function useAuth() {
  const store = useAuthStore();

  // Проверяем токен при монтировании
  if (store.accessToken && isTokenExpired(store.accessToken)) {
    // Если токен истек, пытаемся обновить
    store.refreshToken().catch(() => {
      // Если не удалось - разлогиниваем
      store.logout();
    });
  }

  return store;
}

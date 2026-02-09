/**
 * Zustand store для авторизации
 * Access token хранится в памяти (без persist)
 * Refresh token хранится в httpOnly cookie (управляется бэкендом)
 */

import { create } from "zustand";
import type { AuthStore } from "./types";
import { authApi } from "../api/authApi";
import { isTokenExpired, getTimeUntilExpiration } from "@/shared/lib/utils/jwt";
import { API_BASE_URL } from "@/shared/config/constants";

export const useAuthStore = create<AuthStore>((set, get) => ({
  // State
  accessToken: null,
  idToken: null,
  expiresIn: null,
  isAuthenticated: false,
  isInitialized: false, // Флаг инициализации

  // Actions
  setTokens: (accessToken, idToken, expiresIn) => {
    console.log("[Auth] Setting tokens, expires in:", expiresIn, "seconds");
    set({
      accessToken,
      idToken,
      expiresIn,
      isAuthenticated: true,
    });

    // Настраиваем автоматическое обновление токена за 1 минуту до истечения
    const timeUntilExpiration = expiresIn * 1000 - 60000; // минус 1 минута
    if (timeUntilExpiration > 0) {
      console.log("[Auth] Scheduled token refresh in", timeUntilExpiration / 1000, "seconds");
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
      isInitialized: true, // Остается true после logout
    });
  },

  refreshToken: async () => {
    try {
      const tokens = await authApi.refreshTokens();
      get().setTokens(tokens.access_token, tokens.id_token, tokens.expires_in);
      return tokens;
    } catch (error) {
      const err = error as Error & { isUnauthorized?: boolean; isNetworkError?: boolean; message?: string; status?: number };
      const isUnauthorized = err?.isUnauthorized;
      const isNetworkError =
        err?.isNetworkError ||
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("ERR_CONNECTION_REFUSED") ||
        err?.message?.includes("NetworkError") ||
        err?.message?.includes("Backend unavailable");

      if (isUnauthorized) {
        // 401 — нормально для неавторизованных; без лишних логов
        throw error;
      }

      if (isNetworkError) {
        console.warn("[Auth] Refresh: backend unavailable");
        throw error;
      }

      console.error("[Auth] Refresh failed:", err?.status ?? err?.message);
      get().logout();
      throw error;
    }
  },

  /**
   * Инициализация авторизации при загрузке приложения
   * Пытается восстановить access token через refresh token из cookie
   * Устанавливает isInitialized в true после завершения
   */
  initializeAuth: async () => {
    const state = get();
    
    // Если уже инициализировано - пропускаем
    if (state.isInitialized) {
      return;
    }
    
    if (state.accessToken && !isTokenExpired(state.accessToken)) {
      set({ isInitialized: true });
      return;
    }

    try {
      await get().refreshToken();
      set({ isInitialized: true });
    } catch (error) {
      const err = error as Error & { isUnauthorized?: boolean; message?: string };
      const isUnauthorized = err?.isUnauthorized;
      const isNetworkError =
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("ERR_CONNECTION_REFUSED") ||
        err?.message?.includes("NetworkError") ||
        err?.message?.includes("Backend unavailable");

      if (isUnauthorized) {
        // Нет сессии — нормально для неавторизованных; без логов
        set({ isInitialized: true });
        return;
      }

      if (isNetworkError) {
        // Бэкенд недоступен - нормально для разработки без бэкенда
        // Просто инициализируем приложение без авторизации
        console.log("[Auth] Backend unavailable - continuing without auth (dev mode)");
        set({ isInitialized: true });
        return;
      }

      set({ isInitialized: true });
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

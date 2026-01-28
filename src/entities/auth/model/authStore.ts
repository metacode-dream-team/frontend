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
      console.log("[Auth] 🔄 Attempting to refresh token...");
      console.log("[Auth] 💡 Refresh token should be in httpOnly cookie (set by backend on login)");
      const tokens = await authApi.refreshTokens();
      console.log("[Auth] ✅ Token refreshed successfully");
      get().setTokens(tokens.access_token, tokens.id_token, tokens.expires_in);
      return tokens;
    } catch (error) {
      // Проверяем тип ошибки
      const err = error as Error & { isUnauthorized?: boolean; isNetworkError?: boolean; message?: string; status?: number };
      const isUnauthorized = err?.isUnauthorized;
      const isNetworkError = err?.isNetworkError || 
                            err?.message?.includes("Failed to fetch") || 
                            err?.message?.includes("ERR_CONNECTION_REFUSED") ||
                            err?.message?.includes("NetworkError") ||
                            err?.message?.includes("Backend unavailable");
      
      if (isUnauthorized) {
        // 401 - нет refresh token или он истек, это нормально для неавторизованных пользователей
        console.warn("[Auth] ❌ Refresh failed: 401 Unauthorized");
        console.warn("[Auth] 💡 Possible reasons:");
        console.warn("[Auth]   1. No refresh_token cookie found (backend didn't set it on login)");
        console.warn("[Auth]   2. Refresh token expired");
        console.warn("[Auth]   3. Backend doesn't read refresh_token from cookie");
        console.warn("[Auth]   4. Cookie domain/path mismatch");
        throw error;
      }
      
      if (isNetworkError) {
        // Сетевая ошибка - бэкенд недоступен, не разлогиниваем
        console.warn("[Auth] ⚠️ Network error during refresh - backend may be unavailable");
        console.warn("[Auth] 💡 Check if backend is running and accessible");
        throw error;
      }
      
      // Другие ошибки - логируем и разлогиниваем
      console.error("[Auth] ❌ Failed to refresh token:", error);
      console.error("[Auth] 💡 Status:", err?.status || "unknown");
      console.error("[Auth] 💡 Message:", err?.message || "Unknown error");
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
    
    // Если уже есть токен и он валидный - помечаем как инициализированное
    if (state.accessToken && !isTokenExpired(state.accessToken)) {
      console.log("[Auth] Token is valid, marking as initialized");
      set({ isInitialized: true });
      return;
    }

    console.log("[Auth] Initializing auth - attempting to refresh token from cookie");
    
    // Если токен истек или отсутствует - пытаемся обновить через refresh token
    try {
      const tokens = await get().refreshToken();
      console.log("[Auth] ✅ Successfully restored session from refresh token");
      set({ isInitialized: true });
    } catch (error) {
      // Проверяем тип ошибки
      const err = error as Error & { isUnauthorized?: boolean; message?: string };
      const isUnauthorized = err?.isUnauthorized;
      const isNetworkError = err?.message?.includes("Failed to fetch") || 
                            err?.message?.includes("ERR_CONNECTION_REFUSED") ||
                            err?.message?.includes("NetworkError");
      
      if (isUnauthorized) {
        // 401 - нет refresh token в cookie (пользователь не авторизован)
        console.log("[Auth] ❌ No refresh token found in cookie - user is not authenticated");
        console.log("[Auth] 💡 This is normal if:");
        console.log("[Auth]   - User hasn't logged in yet");
        console.log("[Auth]   - Backend didn't set refresh_token cookie on login");
        console.log("[Auth]   - Refresh token expired");
        console.log("[Auth] 💡 To debug: check browser DevTools > Application > Cookies");
        // Помечаем как инициализированное (пользователь просто не авторизован)
        set({ isInitialized: true });
        return;
      }
      
      if (isNetworkError) {
        // Сетевая ошибка - бэкенд недоступен
        console.warn("[Auth] ⚠️ Backend unavailable - cannot check authentication");
        console.warn("[Auth] 💡 Make sure backend is running on", API_BASE_URL);
        // Помечаем как инициализированное, чтобы не блокировать приложение
        // Пользователь останется в текущем состоянии (если был залогинен - останется)
        set({ isInitialized: true });
        return;
      }
      
      // Другие ошибки (сервер и т.д.) - логируем, но не разлогиниваем
      console.warn("[Auth] ⚠️ Failed to initialize auth:", error);
      // Помечаем как инициализированное, чтобы не блокировать приложение
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

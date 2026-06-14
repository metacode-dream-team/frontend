/**
 * Zustand store для авторизации
 * Access token: память + sessionStorage (persist), чтобы после F5 оставаться в сессии
 * Refresh token: httpOnly cookie (бэкенд)
 */

import { useEffect } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthState, AuthStore } from "./types";
import { authApi } from "../api/authApi";
import { isTokenExpired } from "@/shared/lib/utils/jwt";

let refreshTimerId: ReturnType<typeof setTimeout> | null = null;

function scheduleTokenRefresh(
  expiresIn: number,
  refresh: () => Promise<unknown>,
): void {
  if (refreshTimerId) {
    clearTimeout(refreshTimerId);
    refreshTimerId = null;
  }
  const timeUntilExpiration = expiresIn * 1000 - 60_000;
  if (timeUntilExpiration > 0) {
    refreshTimerId = setTimeout(() => {
      refreshTimerId = null;
      void refresh();
    }, timeUntilExpiration);
  }
}

const LOGOUT_FLAG_KEY = "metacode-auth-logged-out";

function setLogoutFlag() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOGOUT_FLAG_KEY, "1");
  } catch {}
}

function clearLogoutFlag() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LOGOUT_FLAG_KEY);
  } catch {}
}

function hasLogoutFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(LOGOUT_FLAG_KEY) === "1";
  } catch {
    return false;
  }
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // State
      accessToken: null,
      idToken: null,
      expiresIn: null,
      refreshTokenInMemory: null,
      isAuthenticated: false,
      isInitialized: false,

      // Actions
      setTokens: (accessToken, idToken, expiresIn, refreshToken) => {
        const token = accessToken?.trim();
        if (!token) {
          console.error("[Auth] setTokens called without access token");
          return;
        }
        clearLogoutFlag();
        const next: Pick<
          AuthState,
          "accessToken" | "idToken" | "expiresIn" | "refreshTokenInMemory" | "isAuthenticated"
        > = {
          accessToken: token,
          idToken,
          expiresIn,
          refreshTokenInMemory: get().refreshTokenInMemory,
          isAuthenticated: true,
        };
        if (refreshToken !== undefined) {
          next.refreshTokenInMemory = refreshToken?.trim() || null;
        }
        set(next);
        scheduleTokenRefresh(expiresIn, () => get().refreshToken());
      },

      setAccessToken: (token) => {
        set({
          accessToken: token,
          isAuthenticated: !!token,
        });
      },

      getRefreshTokenInMemory: () => get().refreshTokenInMemory,

      clearRefreshTokenInMemory: () => {
        set({ refreshTokenInMemory: null });
      },

      prepareForOAuthExchange: async () => {
        if (refreshTimerId) {
          clearTimeout(refreshTimerId);
          refreshTimerId = null;
        }
        clearLogoutFlag();
        set({ refreshTokenInMemory: null, isInitialized: false });
        try {
          await authApi.logout();
        } catch {
          // best-effort: clear stale refresh cookie before OAuth
        }
      },

      completeOAuthLogin: () => {
        set({ isInitialized: true });
      },

      logout: () => {
        if (refreshTimerId) {
          clearTimeout(refreshTimerId);
          refreshTimerId = null;
        }

        setLogoutFlag();

        void authApi.logout();

        if (typeof window !== "undefined") {
          try {
            window.sessionStorage.removeItem("metacode-auth");
          } catch {}
        }

        set({
          accessToken: null,
          idToken: null,
          expiresIn: null,
          refreshTokenInMemory: null,
          isAuthenticated: false,
          isInitialized: true,
        });
      },

      refreshToken: async () => {
        try {
          const tokens = await authApi.refreshTokens();
          get().setTokens(
            tokens.access_token,
            tokens.id_token,
            tokens.expires_in,
            tokens.refresh_token,
          );
          return tokens;
        } catch (error) {
          const err = error as Error & {
            isUnauthorized?: boolean;
            isNetworkError?: boolean;
            message?: string;
            status?: number;
          };
          const isUnauthorized = err?.isUnauthorized;
          const isNetworkError =
            err?.isNetworkError ||
            err?.message?.includes("Failed to fetch") ||
            err?.message?.includes("ERR_CONNECTION_REFUSED") ||
            err?.message?.includes("NetworkError") ||
            err?.message?.includes("Backend unavailable");

          if (isUnauthorized) {
            get().clearRefreshTokenInMemory();
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

      initializeAuth: async () => {
        const state = get();

        if (state.isInitialized) {
          return;
        }

        if (hasLogoutFlag()) {
          set({
            accessToken: null,
            idToken: null,
            expiresIn: null,
            refreshTokenInMemory: null,
            isAuthenticated: false,
            isInitialized: true,
          });
          return;
        }

        if (state.accessToken && !isTokenExpired(state.accessToken)) {
          if (state.expiresIn) {
            scheduleTokenRefresh(state.expiresIn, () => get().refreshToken());
          }
          set({ isAuthenticated: true, isInitialized: true });
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
            if (
              process.env.NODE_ENV === "development" &&
              get().refreshTokenInMemory
            ) {
              console.warn(
                "[Auth] Refresh returned 401 but refresh_token is in memory — backend may reject body refresh; check gateway cookie/body support",
              );
            }
            get().logout();
            return;
          }

          if (isNetworkError) {
            console.log("[Auth] Backend unavailable - continuing without auth (dev mode)");
            set({ isInitialized: true });
            return;
          }

          set({ isInitialized: true });
        }
      },
    }),
    {
      name: "metacode-auth",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        idToken: state.idToken,
        expiresIn: state.expiresIn,
      }),
      merge: (persisted, current) => {
        if (!persisted || typeof persisted !== "object") {
          return current;
        }
        const p = persisted as Partial<AuthState>;
        return {
          ...current,
          ...p,
          isAuthenticated: !!p.accessToken,
        };
      },
    },
  ),
);

/**
 * Хук для проверки валидности токена и автоматического refresh
 */
export function useAuth() {
  const store = useAuthStore();
  const accessToken = store.accessToken;
  const refreshToken = store.refreshToken;
  const logout = store.logout;

  useEffect(() => {
    if (!accessToken || !isTokenExpired(accessToken)) {
      return;
    }
    void refreshToken().catch(() => {
      logout();
    });
  }, [accessToken, refreshToken, logout]);

  return store;
}

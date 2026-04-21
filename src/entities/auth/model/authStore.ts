/**
 * Zustand store для авторизации
 * Access token: память + sessionStorage (persist), чтобы после F5 оставаться в сессии
 * Refresh token: httpOnly cookie (бэкенд)
 */

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthState, AuthStore } from "./types";
import { authApi } from "../api/authApi";
import { isTokenExpired } from "@/shared/lib/utils/jwt";

let refreshTimerId: ReturnType<typeof setTimeout> | null = null;

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
      isAuthenticated: false,
      isInitialized: false,

      // Actions
      setTokens: (accessToken, idToken, expiresIn) => {
        if (refreshTimerId) {
          clearTimeout(refreshTimerId);
          refreshTimerId = null;
        }
        clearLogoutFlag();
        set({
          accessToken,
          idToken,
          expiresIn,
          isAuthenticated: true,
        });

        const timeUntilExpiration = expiresIn * 1000 - 60000;
        if (timeUntilExpiration > 0) {
          refreshTimerId = setTimeout(() => {
            refreshTimerId = null;
            void get().refreshToken();
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
          isAuthenticated: false,
          isInitialized: true,
        });
      },

      refreshToken: async () => {
        try {
          const tokens = await authApi.refreshTokens();
          get().setTokens(tokens.access_token, tokens.id_token, tokens.expires_in);
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
            isAuthenticated: false,
            isInitialized: true,
          });
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

  if (store.accessToken && isTokenExpired(store.accessToken)) {
    store.refreshToken().catch(() => {
      store.logout();
    });
  }

  return store;
}

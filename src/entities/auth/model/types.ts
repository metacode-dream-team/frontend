/**
 * Типы для сущности Auth
 */

import type { RefreshTokenResponse } from "@/shared/types/api";

export interface AuthState {
  accessToken: string | null;
  idToken: string | null;
  expiresIn: number | null;
  /** In-memory fallback when backend returns refresh_token in body (OAuth). */
  refreshTokenInMemory: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // Флаг инициализации
}

export interface AuthActions {
  setTokens: (
    accessToken: string,
    idToken: string,
    expiresIn: number,
    refreshToken?: string | null,
  ) => void;
  setAccessToken: (token: string | null) => void;
  getRefreshTokenInMemory: () => string | null;
  logout: () => void;
  refreshToken: () => Promise<RefreshTokenResponse>;
  initializeAuth: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

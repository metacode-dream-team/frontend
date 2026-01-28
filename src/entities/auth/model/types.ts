/**
 * Типы для сущности Auth
 */

import type { RefreshTokenResponse } from "@/shared/types/api";

export interface AuthState {
  accessToken: string | null;
  idToken: string | null;
  expiresIn: number | null;
  isAuthenticated: boolean;
  isInitialized: boolean; // Флаг инициализации
}

export interface AuthActions {
  setTokens: (accessToken: string, idToken: string, expiresIn: number) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  refreshToken: () => Promise<RefreshTokenResponse>;
  initializeAuth: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

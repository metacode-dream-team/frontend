/**
 * Типы для сущности Auth
 */

export interface AuthState {
  accessToken: string | null;
  idToken: string | null;
  expiresIn: number | null;
  isAuthenticated: boolean;
}

export interface AuthActions {
  setTokens: (accessToken: string, idToken: string, expiresIn: number) => void;
  setAccessToken: (token: string | null) => void;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;

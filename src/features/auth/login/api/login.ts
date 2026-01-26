/**
 * API для логина
 */

import { authApi } from "@/entities/auth";
import type { LoginRequest, AuthTokens } from "@/shared/types/api";

export async function loginUser(data: LoginRequest): Promise<AuthTokens> {
  return authApi.login(data);
}

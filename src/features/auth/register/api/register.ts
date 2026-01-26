/**
 * API для регистрации
 */

import { authApi } from "@/entities/auth";
import type { RegisterRequest, ApiSuccess } from "@/shared/types/api";

export async function registerUser(data: RegisterRequest): Promise<ApiSuccess> {
  return authApi.register(data);
}

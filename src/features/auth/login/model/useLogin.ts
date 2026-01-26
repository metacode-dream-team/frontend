/**
 * Хук для логина
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/entities/auth";
import { loginUser } from "../api/login";
import { validateLoginForm } from "@/shared/lib/utils/validation";
import type { LoginRequest } from "@/shared/types/api";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setTokens } = useAuthStore();

  const login = async (email: string, password: string) => {
    setError(null);

    // Валидация на клиенте
    const validation = validateLoginForm(email, password);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setIsLoading(true);

    try {
      const data: LoginRequest = { email, password };
      const tokens = await loginUser(data);

      // Сохраняем токены в store
      setTokens(tokens.access_token, tokens.id_token, tokens.expires_in);

      // Перенаправляем на главную страницу
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    login,
    isLoading,
    error,
  };
}

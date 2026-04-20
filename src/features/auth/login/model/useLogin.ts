/**
 * Хук для логина
 */

"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/entities/auth";
import { loginUser } from "../api/login";
import { validateLoginForm } from "@/shared/lib/utils/validation";
import type { LoginRequest } from "@/shared/types/api";

function safeInternalPath(raw: string | null): string | null {
  if (!raw) return null;
  if (!raw.startsWith("/") || raw.startsWith("//")) return null;
  if (raw.includes("..")) return null;
  return raw;
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = async (identifier: string, password: string) => {
    setError(null);

    // Валидация на клиенте
    const validation = validateLoginForm(identifier, password);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setIsLoading(true);

    try {
      const data: LoginRequest = { email: identifier.trim(), password };
      const tokens = await loginUser(data);

      // Явно через getState(), чтобы всегда писать в единственный экземпляр store
      useAuthStore.getState().setTokens(
        tokens.access_token,
        tokens.id_token,
        tokens.expires_in,
      );

      const next = safeInternalPath(searchParams.get("redirect"));
      router.replace(next ?? "/");
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

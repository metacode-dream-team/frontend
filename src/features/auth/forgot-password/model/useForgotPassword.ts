/**
 * Хук для восстановления пароля
 */

"use client";

import { useState } from "react";
import { authApi } from "@/entities/auth";
import { validateEmail } from "@/shared/lib/utils/validation";
import type { ForgotPasswordRequest } from "@/shared/types/api";

export function useForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const forgotPassword = async (email: string) => {
    setError(null);
    setSuccess(false);

    // Валидация на клиенте
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }

    setIsLoading(true);

    try {
      const data: ForgotPasswordRequest = { email };
      await authApi.forgotPassword(data);
      setSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Request failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    forgotPassword,
    isLoading,
    error,
    success,
  };
}

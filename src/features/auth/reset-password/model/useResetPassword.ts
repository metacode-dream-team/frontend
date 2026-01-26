/**
 * Хук для сброса пароля
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/entities/auth";
import { validateResetPasswordForm } from "@/shared/lib/utils/validation";
import type { ResetPasswordRequest } from "@/shared/types/api";

export function useResetPassword(token: string | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const resetPassword = async (
    newPassword: string,
    confirmPassword: string,
  ) => {
    setError(null);
    setSuccess(false);

    if (!token) {
      setError("Reset token is missing");
      return;
    }

    // Валидация на клиенте
    const validation = validateResetPasswordForm(newPassword, confirmPassword);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setIsLoading(true);

    try {
      const data: ResetPasswordRequest = {
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      };
      await authApi.resetPassword(data);
      setSuccess(true);
      // Перенаправляем на страницу входа через 3 секунды
      setTimeout(() => {
        router.push("/login?reset=true");
      }, 3000);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Password reset failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    resetPassword,
    isLoading,
    error,
    success,
  };
}

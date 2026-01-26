/**
 * Хук для регистрации
 */

"use client";

import { useState } from "react";
import { registerUser } from "../api/register";
import { validateRegisterForm } from "@/shared/lib/utils/validation";
import type { RegisterRequest } from "@/shared/types/api";

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const register = async (
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    setError(null);
    setSuccess(false);

    // Валидация на клиенте
    const validation = validateRegisterForm(email, password, confirmPassword);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setIsLoading(true);

    try {
      const data: RegisterRequest = {
        email,
        password,
        confirm_password: confirmPassword,
      };
      await registerUser(data);
      setSuccess(true);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
    success,
  };
}

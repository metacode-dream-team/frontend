/**
 * Хук для верификации email
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/entities/auth";

export function useVerifyEmail(token: string | null) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      setError("Verification token is missing");
      setIsLoading(false);
      return;
    }

    const verify = async () => {
      try {
        await authApi.verifyEmail(token);
        setSuccess(true);
        // Перенаправляем на страницу входа через 3 секунды
        setTimeout(() => {
          router.push("/login?verified=true");
        }, 3000);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Verification failed";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [token, router]);

  return {
    isLoading,
    error,
    success,
  };
}

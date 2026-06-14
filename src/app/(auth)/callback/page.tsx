/**
 * OAuth callback: возврат с сервиса авторизации (code) → обмен токенов.
 */

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { exchangeAuthServiceCodeForTokens } from "@/shared/lib/auth";
import { diagnoseRefreshToken } from "@/shared/lib/utils/cookie";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { setTokens, prepareForOAuthExchange, completeOAuthLogin } = useAuthStore();
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) {
      return;
    }

    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      handledRef.current = true;
      setError(errorParam);
      setTimeout(() => {
        router.push(`/login?error=${encodeURIComponent(errorParam)}`);
      }, 2000);
      return;
    }

    if (!code) {
      handledRef.current = true;
      setError("Authorization code is missing");
      setTimeout(() => {
        router.push("/login?error=missing_code");
      }, 2000);
      return;
    }

    const handleCallback = async () => {
      const handledKey = `oauth-code-${code}`;
      if (typeof window !== "undefined" && sessionStorage.getItem(handledKey)) {
        const accessToken = useAuthStore.getState().accessToken;
        if (accessToken) {
          router.replace("/");
        }
        return;
      }
      handledRef.current = true;

      try {
        await prepareForOAuthExchange();

        const tokens = await exchangeAuthServiceCodeForTokens(code);
        setTokens(
          tokens.access_token,
          tokens.id_token,
          tokens.expires_in,
          tokens.refresh_token,
        );

        const accessToken = useAuthStore.getState().accessToken;
        if (!accessToken) {
          throw new Error("Access token was not saved after OAuth");
        }

        completeOAuthLogin();

        if (typeof window !== "undefined") {
          sessionStorage.setItem(handledKey, "1");
        }

        if (process.env.NODE_ENV === "development") {
          void diagnoseRefreshToken();
        }
        router.push("/");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Token exchange failed";
        setError(message);
        setTimeout(() => {
          router.push(`/login?error=${encodeURIComponent(message)}`);
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, router, setTokens, prepareForOAuthExchange, completeOAuthLogin]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <div className="text-center space-y-4">
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-md">
            <h2 className="text-xl font-bold mb-2">Authentication Error</h2>
            <p>{error}</p>
            <p className="mt-2 text-sm">Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
        <p>Processing authentication...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}

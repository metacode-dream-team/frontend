/**
 * Страница обработки OAuth callback от Keycloak
 */

"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeCodeForTokens } from "@/shared/lib/keycloak/keycloak";
import { useAuthStore } from "@/entities/auth";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const { setTokens } = useAuthStore();

  useEffect(() => {
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      setError(errorParam);
      setTimeout(() => {
        router.push("/login?error=" + encodeURIComponent(errorParam));
      }, 2000);
      return;
    }

    if (!code) {
      setError("Authorization code is missing");
      setTimeout(() => {
        router.push("/login?error=missing_code");
      }, 2000);
      return;
    }

    const handleCallback = async () => {
      try {
        console.log("[OAuth] 🔄 Exchanging code for tokens from Keycloak...");
        const tokens = await exchangeCodeForTokens(code);
        console.log("[OAuth] ✅ Tokens received from Keycloak");
        console.warn("[OAuth] ⚠️ IMPORTANT: OAuth login gets tokens directly from Keycloak");
        console.warn("[OAuth] ⚠️ Backend is NOT involved, so refresh_token cookie is NOT set!");
        console.warn("[OAuth] 💡 Solution: Send tokens to backend to set refresh_token cookie");
        console.warn("[OAuth] 💡 Or: Use backend OAuth endpoint instead of direct Keycloak call");
        
        setTokens(tokens.access_token, tokens.id_token, tokens.expires_in);
        console.log("[OAuth] ✅ Tokens saved to store");
        console.warn("[OAuth] ⚠️ Refresh token will NOT work until backend sets cookie!");
        router.push("/");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Token exchange failed";
        console.error("[OAuth] ❌ Token exchange failed:", err);
        setError(message);
        setTimeout(() => {
          router.push("/login?error=" + encodeURIComponent(message));
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, router, setTokens]);

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

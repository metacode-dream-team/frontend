"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import { diagnoseRefreshToken } from "@/shared/lib/utils/cookie";

const AUTH_INIT_SKIP_PATHS = ["/callback", "/login", "/register"] as const;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const fetchProfileMe = useProfileMeStore((state) => state.fetchMe);
  const clearProfileMe = useProfileMeStore((state) => state.clear);
  const [persistReady, setPersistReady] = useState(false);

  useEffect(() => {
    const api = useAuthStore.persist;
    if (!api || api.hasHydrated()) {
      setPersistReady(true);
      return;
    }
    const unsub = api.onFinishHydration(() => setPersistReady(true));
    return unsub;
  }, []);

  useEffect(() => {
    if (!persistReady) {
      return;
    }
    if (AUTH_INIT_SKIP_PATHS.includes(pathname as (typeof AUTH_INIT_SKIP_PATHS)[number])) {
      return;
    }
    void initializeAuth();

    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      (window as Window & { debugRefreshToken?: () => void }).debugRefreshToken = () =>
        void diagnoseRefreshToken();
    }
  }, [persistReady, pathname, initializeAuth]);

  useEffect(() => {
    if (!persistReady || !isInitialized) {
      return;
    }
    if (isAuthenticated && accessToken) {
      void fetchProfileMe(accessToken);
    } else {
      clearProfileMe();
    }
  }, [persistReady, isInitialized, isAuthenticated, accessToken, fetchProfileMe, clearProfileMe]);

  if (!persistReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-400" />
      </div>
    );
  }

  return <>{children}</>;
}

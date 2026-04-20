"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import { API_BASE_URL } from "@/shared/config/constants";
import { diagnoseRefreshToken } from "@/shared/lib/utils/cookie";

export function AuthProvider({ children }: { children: React.ReactNode }) {
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
    void initializeAuth();

    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      (window as Window & { debugRefreshToken?: () => void }).debugRefreshToken = () =>
        diagnoseRefreshToken(API_BASE_URL);
    }
  }, [persistReady, initializeAuth]);

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

  if (!persistReady || !isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

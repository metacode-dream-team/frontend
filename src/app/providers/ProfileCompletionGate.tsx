"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";

const ALLOWLIST_PREFIXES = [
  "/complete-profile",
  "/callback",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
] as const;

function isAllowlisted(pathname: string): boolean {
  return ALLOWLIST_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function ProfileCompletionGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const accessToken = useAuthStore((s) => s.accessToken);
  const profile = useProfileMeStore((s) => s.profile);
  const isLoading = useProfileMeStore((s) => s.isLoading);
  const profileError = useProfileMeStore((s) => s.error);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      return;
    }

    if (isLoading) {
      return;
    }

    const onCompletePage = pathname === "/complete-profile";

    if (profileError) {
      if (!onCompletePage && !isAllowlisted(pathname)) {
        router.replace("/complete-profile");
      }
      return;
    }

    if (!profile) {
      return;
    }

    if (!profile.isComplete && !isAllowlisted(pathname)) {
      const redirect =
        pathname && pathname !== "/"
          ? `?redirect=${encodeURIComponent(pathname)}`
          : "";
      router.replace(`/complete-profile${redirect}`);
      return;
    }

    if (profile.isComplete && onCompletePage) {
      router.replace("/dashboard");
    }
  }, [
    isAuthenticated,
    accessToken,
    profile,
    isLoading,
    profileError,
    pathname,
    router,
  ]);

  return <>{children}</>;
}

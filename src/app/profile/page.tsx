"use client";

/**
 * Канонический URL «мой профиль»: редирект на /profile/{slug}.
 * Сначала данные из GET /v1/profiles/me (Zustand), иначе JWT.
 */

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import { decodeJwt } from "@/shared/lib/utils/jwt";

function slugFromAccessToken(accessToken: string): string | null {
  const p = decodeJwt(accessToken);
  if (!p) return null;
  if (typeof p.preferred_username === "string" && p.preferred_username.trim()) {
    return p.preferred_username.trim();
  }
  if (typeof p.email === "string" && p.email.trim()) {
    return p.email.trim();
  }
  if (typeof p.sub === "string" && p.sub.trim()) {
    return p.sub.trim();
  }
  return null;
}

export default function ProfileEntryPage() {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const profile = useProfileMeStore((s) => s.profile);
  const isLoadingMe = useProfileMeStore((s) => s.isLoading);

  useEffect(() => {
    if (!isInitialized) return;

    if (!accessToken) {
      router.replace("/login?redirect=/profile");
      return;
    }

    if (isLoadingMe && !profile) {
      return;
    }

    const slug =
      profile?.username?.trim() ||
      profile?.externalProfileLinks?.find((l) => l.provider === "leetcode")?.username?.trim() ||
      profile?.userId?.trim() ||
      slugFromAccessToken(accessToken);

    if (slug) {
      router.replace(`/profile/${encodeURIComponent(slug)}`);
      return;
    }

    router.replace("/dashboard");
  }, [isInitialized, accessToken, router, profile, isLoadingMe]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center bg-black px-4 text-sm text-zinc-400">
      Redirecting to your profile…
    </div>
  );
}

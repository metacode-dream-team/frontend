"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import type { ProfileAchievement, ProfileData } from "@/entities/profile";
import { useProfileMeStore } from "@/entities/profile";
import { mapAchievementsPayload } from "@/shared/lib/api/platformMappers";
import { fetchUserAchievements } from "@/shared/lib/api/platformData";
import { resolveActivityUserId } from "./resolveActivityUserId";

export function useProfileAchievementsPage(
  routeUsername: string,
  profile: ProfileData,
): {
  achievements: ProfileAchievement[];
  isLoading: boolean;
} {
  const accessToken = useAuthStore((s) => s.accessToken);
  const me = useProfileMeStore((s) => s.profile);
  const [achievements, setAchievements] = useState<ProfileAchievement[]>(
    profile.achievements,
  );
  const [isLoading, setIsLoading] = useState(Boolean(accessToken));

  useEffect(() => {
    if (!accessToken) {
      setAchievements(profile.achievements);
      setIsLoading(false);
      return;
    }

    const userId = resolveActivityUserId(routeUsername, me, profile);
    if (!userId) {
      setAchievements(profile.achievements);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    void (async () => {
      try {
        const raw = await fetchUserAchievements(userId, accessToken);
        if (cancelled) return;
        setAchievements(mapAchievementsPayload(raw));
      } catch {
        if (!cancelled) {
          setAchievements(profile.achievements);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accessToken, me, profile.id, routeUsername]);

  return { achievements, isLoading };
}

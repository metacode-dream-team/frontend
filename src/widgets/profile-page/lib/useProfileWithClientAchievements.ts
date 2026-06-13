"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import type { ProfileAchievement, ProfileData } from "@/entities/profile";
import { mergeProfileWithMe, useProfileMeStore } from "@/entities/profile";
import {
  applyActivityStreakToProfile,
  augmentProfileWithIntegration,
  mapAchievementsPayload,
  mapLeaderboardUserRank,
  mapStreakPayload,
} from "@/shared/lib/api/platformMappers";
import {
  fetchIntegrationProfile,
  fetchLeaderboardUser,
  fetchUserAchievements,
  fetchUserStreak,
} from "@/shared/lib/api/platformData";
import { resolveActivityUserId } from "./resolveActivityUserId";

type ClientBundle = {
  achievements?: ProfileAchievement[];
  integrationJson: unknown | null;
  rank?: number;
  streakJson: unknown | null;
};

/**
 * После SSR подмешивает с клиента (Bearer) только то, что не дублирует третий лишний слой:
 * - `GET /v1/activity/user/achievement?user_id=<UserID>` — все достижения (полученные и нет)
 * - `GET /v1/activity/streak?user_id=<UserID>` — платформенная серия (огонёк)
 * - `GET /v1/integration/profile?user_id=<UserID>` — теплокарта GitHub / LeetCode / Monkeytype
 *
 * Данные «о себе» из `GET /v1/profiles/me` приходят через `mergeProfileWithMe` + `useProfileMeStore`.
 * Отдельный `/v1/integration/calendar` здесь не вызываем — дни активности интеграций уже в `integration/profile`.
 */
export function useProfileWithClientAchievements(
  routeUsername: string,
  initialProfile: ProfileData,
): ProfileData {
  const me = useProfileMeStore((s) => s.profile);
  const accessToken = useAuthStore((s) => s.accessToken);
  const [bundle, setBundle] = useState<ClientBundle | null>(null);

  useEffect(() => {
    setBundle(null);
    if (!accessToken) {
      return;
    }

    const userId = resolveActivityUserId(routeUsername, me, initialProfile);
    if (!userId) {
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const [achRaw, intRaw, leaderboardRaw, streakRaw] = await Promise.all([
          fetchUserAchievements(userId, accessToken).catch(() => null),
          fetchIntegrationProfile(userId, accessToken).catch(() => null),
          fetchLeaderboardUser(userId, accessToken).catch(() => null),
          fetchUserStreak(userId, accessToken).catch(() => null),
        ]);
        if (cancelled) return;

        const achParsed = achRaw ? mapAchievementsPayload(achRaw) : [];
        const rank = leaderboardRaw ? mapLeaderboardUserRank(leaderboardRaw) : null;
        setBundle({
          achievements: achRaw != null ? achParsed : undefined,
          integrationJson: intRaw,
          rank: rank ?? undefined,
          streakJson: streakRaw,
        });
      } catch {
        if (!cancelled) {
          setBundle({ integrationJson: null, streakJson: null });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken, me, routeUsername, initialProfile.id]);

  return useMemo(() => {
    const merged = mergeProfileWithMe(initialProfile, me, routeUsername);
    if (!bundle) {
      return merged;
    }

    let next: ProfileData = merged;
    if (bundle.achievements !== undefined) {
      next = { ...next, achievements: bundle.achievements };
    }
    if (bundle.integrationJson != null) {
      next = augmentProfileWithIntegration(next, bundle.integrationJson);
    }
    if (typeof bundle.rank === "number" && Number.isFinite(bundle.rank) && bundle.rank > 0) {
      next = { ...next, rank: bundle.rank };
    }
    if (bundle.streakJson != null) {
      next = applyActivityStreakToProfile(next, mapStreakPayload(bundle.streakJson));
    }
    return next;
  }, [initialProfile, me, routeUsername, bundle]);
}

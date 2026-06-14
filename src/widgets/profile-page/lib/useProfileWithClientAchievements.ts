"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import type { ProfileAchievement, ProfileData } from "@/entities/profile";
import {
  isProfileRouteCurrentUser,
  mergeProfileWithMe,
  useProfileMeStore,
} from "@/entities/profile";
import {
  applyActivityStreakToProfile,
  applyLeaderboardExtras,
  augmentProfileWithIntegration,
  mapAchievementsPayload,
  mapStreakPayload,
} from "@/shared/lib/api/platformMappers";
import {
  fetchIntegrationProfile,
  fetchLeaderboardUser,
  fetchUserAchievements,
  fetchUserStreak,
} from "@/shared/lib/api/platformData";
import { profileHasLoaderEnrichment } from "./profileLoaderEnrichment";
import { resolveActivityUserId } from "./resolveActivityUserId";

type ClientBundle = {
  achievements?: ProfileAchievement[];
  integrationJson?: unknown;
  leaderboardJson?: unknown;
  streakJson?: unknown;
};

/**
 * Подмешивает live-данные поверх loader:
 * - свой профиль: mergeProfileWithMe (career из store) + achievements/streak с Bearer
 * - чужой профиль: повторный fetch только если loader не успел обогатить данные
 */
export function useProfileWithClientAchievements(
  routeUsername: string,
  initialProfile: ProfileData,
): ProfileData {
  const me = useProfileMeStore((s) => s.profile);
  const accessToken = useAuthStore((s) => s.accessToken);
  const isOwnProfile = isProfileRouteCurrentUser(routeUsername, me);
  const loaderEnriched = profileHasLoaderEnrichment(initialProfile);

  const [bundle, setBundle] = useState<ClientBundle | null>(null);

  useEffect(() => {
    const isAccessible = initialProfile.visibility?.isAccessible ?? true;
    const userId = resolveActivityUserId(routeUsername, me, initialProfile);

    if (!isAccessible || !userId) {
      setBundle(null);
      return;
    }

    const needsAuthRefresh = Boolean(accessToken) && isOwnProfile;
    const needsPublicEnrichment = !isOwnProfile && !loaderEnriched;

    if (!needsAuthRefresh && !needsPublicEnrichment) {
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const [achRaw, intRaw, leaderboardRaw, streakRaw] = await Promise.all([
          needsAuthRefresh
            ? fetchUserAchievements(userId, accessToken).catch(() => null)
            : Promise.resolve(null),
          needsPublicEnrichment
            ? fetchIntegrationProfile(userId, accessToken).catch(() => null)
            : Promise.resolve(null),
          needsPublicEnrichment
            ? fetchLeaderboardUser(userId, accessToken).catch(() => null)
            : Promise.resolve(null),
          needsAuthRefresh
            ? fetchUserStreak(userId, accessToken).catch(() => null)
            : Promise.resolve(null),
        ]);
        if (cancelled) return;

        setBundle({
          achievements:
            achRaw != null ? mapAchievementsPayload(achRaw) : undefined,
          integrationJson: intRaw ?? undefined,
          leaderboardJson: leaderboardRaw ?? undefined,
          streakJson: streakRaw ?? undefined,
        });
      } catch {
        if (!cancelled) {
          setBundle(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    accessToken,
    initialProfile.id,
    initialProfile.visibility,
    isOwnProfile,
    loaderEnriched,
    me,
    routeUsername,
  ]);

  return useMemo(() => {
    let next = mergeProfileWithMe(initialProfile, me, routeUsername);
    if (!bundle) {
      return next;
    }

    if (bundle.achievements !== undefined) {
      next = { ...next, achievements: bundle.achievements };
    }
    if (bundle.integrationJson != null) {
      next = augmentProfileWithIntegration(next, bundle.integrationJson);
    }
    if (bundle.leaderboardJson != null) {
      next = applyLeaderboardExtras(next, bundle.leaderboardJson);
    }
    if (bundle.streakJson != null) {
      next = applyActivityStreakToProfile(next, mapStreakPayload(bundle.streakJson));
    }

    return next;
  }, [initialProfile, me, routeUsername, bundle]);
}

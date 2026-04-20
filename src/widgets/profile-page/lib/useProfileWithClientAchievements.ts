"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import type { ProfileAchievement, ProfileData } from "@/entities/profile";
import { isProfileRouteCurrentUser, mergeProfileWithMe, useProfileMeStore } from "@/entities/profile";
import { augmentProfileWithIntegration, mapAchievementsPayload } from "@/shared/lib/api/platformMappers";
import { fetchIntegrationProfile, fetchUserAchievements } from "@/shared/lib/api/platformData";
import { resolveActivityUserId } from "./resolveActivityUserId";

type ClientBundle = {
  achievements?: ProfileAchievement[];
  integrationJson: unknown | null;
};

/**
 * После SSR подмешивает с клиента (Bearer) только то, что не дублирует третий лишний слой:
 * - `GET /v1/activity/user/achievement?user_id=<UserID>` — если смотришь **свой** профиль
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

    const ownProfile = isProfileRouteCurrentUser(routeUsername, me);
    let cancelled = false;
    void (async () => {
      try {
        const [achRaw, intRaw] = await Promise.all([
          ownProfile
            ? fetchUserAchievements(userId, accessToken).catch(() => null)
            : Promise.resolve(null),
          fetchIntegrationProfile(userId, accessToken).catch(() => null),
        ]);
        if (cancelled) return;

        const achParsed = achRaw ? mapAchievementsPayload(achRaw) : [];
        setBundle({
          achievements: achParsed.length > 0 ? achParsed : undefined,
          integrationJson: intRaw,
        });
      } catch {
        if (!cancelled) {
          setBundle({ integrationJson: null });
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
    if (bundle.achievements?.length) {
      next = { ...next, achievements: bundle.achievements };
    }
    if (bundle.integrationJson != null) {
      next = augmentProfileWithIntegration(next, bundle.integrationJson);
    }
    return next;
  }, [initialProfile, me, routeUsername, bundle]);
}

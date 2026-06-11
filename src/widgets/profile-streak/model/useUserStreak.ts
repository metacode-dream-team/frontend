"use client";

import { useEffect, useState } from "react";
import { fetchUserStreak } from "@/shared/lib/api/platformData";
import { mapStreakPayload } from "@/shared/lib/api/platformMappers";
import type { ActivityStreak } from "@/shared/types/streak";

export function useUserStreak(
  userId: string | null | undefined,
  accessToken: string | null | undefined,
): ActivityStreak | null {
  const [streak, setStreak] = useState<ActivityStreak | null>(null);

  useEffect(() => {
    const uid = userId?.trim();
    if (!uid || !accessToken) {
      setStreak(null);
      return;
    }

    let cancelled = false;
    void (async () => {
      try {
        const raw = await fetchUserStreak(uid, accessToken);
        if (!cancelled) {
          setStreak(mapStreakPayload(raw));
        }
      } catch {
        if (!cancelled) {
          setStreak(null);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId, accessToken]);

  return streak;
}

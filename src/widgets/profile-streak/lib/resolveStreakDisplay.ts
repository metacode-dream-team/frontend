import type { ProfileData } from "@/entities/profile";
import type { ActivityStreak } from "@/shared/types/streak";

export function resolveStreakDisplay(
  profile: ProfileData,
): { count: number; activeToday: boolean } {
  const streak = profile.activityStreak;
  return {
    count: streak?.current ?? profile.currentStreak ?? 0,
    activeToday: streak?.activeToday ?? false,
  };
}

export function streakFromActivity(
  streak: ActivityStreak | null,
): { count: number; activeToday: boolean } {
  return {
    count: streak?.current ?? 0,
    activeToday: streak?.activeToday ?? false,
  };
}

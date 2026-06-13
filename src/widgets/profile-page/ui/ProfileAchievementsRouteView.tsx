"use client";

import type { ProfileData } from "@/entities/profile";
import { useProfileAchievementsPage } from "../lib/useProfileAchievementsPage";
import { ProfileAchievementsPageContent } from "./profile-achievements-page-content";

interface ProfileAchievementsRouteViewProps {
  routeUsername: string;
  initialProfile: ProfileData;
}

export function ProfileAchievementsRouteView({
  routeUsername,
  initialProfile,
}: ProfileAchievementsRouteViewProps) {
  const { achievements, isLoading } = useProfileAchievementsPage(
    routeUsername,
    initialProfile,
  );

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        {isLoading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-violet-400" />
          </div>
        ) : (
          <ProfileAchievementsPageContent
            username={initialProfile.username}
            achievements={achievements}
          />
        )}
      </div>
    </div>
  );
}

"use client";

import type { ProfileData } from "@/entities/profile";
import { useProfileWithClientAchievements } from "../lib/useProfileWithClientAchievements";
import { ProfileAchievementsPageContent } from "./profile-achievements-page-content";

interface ProfileAchievementsRouteViewProps {
  routeUsername: string;
  initialProfile: ProfileData;
}

export function ProfileAchievementsRouteView({
  routeUsername,
  initialProfile,
}: ProfileAchievementsRouteViewProps) {
  const profile = useProfileWithClientAchievements(routeUsername, initialProfile);

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-zinc-100">
      <div className="mx-auto max-w-7xl">
        <ProfileAchievementsPageContent
          username={profile.username}
          achievements={profile.achievements}
        />
      </div>
    </div>
  );
}

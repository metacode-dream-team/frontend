"use client";

import { isProfileRouteCurrentUser, type ProfileData, useProfileMeStore } from "@/entities/profile";
import { useProfileWithClientAchievements } from "../lib/useProfileWithClientAchievements";
import { ProfilePageContent } from "./ProfilePageContent";

interface ProfileRouteViewProps {
  routeUsername: string;
  initialProfile: ProfileData;
}

export function ProfileRouteView({
  routeUsername,
  initialProfile,
}: ProfileRouteViewProps) {
  const profile = useProfileWithClientAchievements(routeUsername, initialProfile);
  const me = useProfileMeStore((s) => s.profile);
  const canEdit = isProfileRouteCurrentUser(routeUsername, me);

  return (
    <div className="min-h-screen bg-black px-3 py-5 text-zinc-100 max-lg:pb-6 lg:px-4 lg:py-8">
      <div className="mx-auto max-w-7xl">
        <ProfilePageContent profile={profile} canEdit={canEdit} />
      </div>
    </div>
  );
}

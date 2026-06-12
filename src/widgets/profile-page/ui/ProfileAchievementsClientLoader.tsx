"use client";

import Link from "next/link";
import { useClientProfileLoader } from "../lib/useClientProfileLoader";
import { useProfileWithClientAchievements } from "../lib/useProfileWithClientAchievements";
import { ProfileAchievementsPageContent } from "./profile-achievements-page-content";
import { ProfileLoadError } from "./ProfileLoadError";

interface ProfileAchievementsClientLoaderProps {
  routeUsername: string;
}

function ProfileLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-zinc-400">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-600 border-t-violet-400" />
    </div>
  );
}

function ProfileNotFound({ username }: { username: string }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 text-zinc-100">
      <h1 className="text-2xl font-bold">Profile not found</h1>
      <p className="mt-2 text-sm text-zinc-400">
        User @{username} does not exist or the profile is unavailable.
      </p>
      <Link
        href="/"
        className="mt-6 text-sm font-medium text-violet-400 transition-colors hover:text-violet-300"
      >
        Back to home
      </Link>
    </div>
  );
}

export function ProfileAchievementsClientLoader({
  routeUsername,
}: ProfileAchievementsClientLoaderProps) {
  const { profile, isLoading, errorStatus, notFound } =
    useClientProfileLoader(routeUsername);

  if (isLoading) {
    return <ProfileLoading />;
  }

  if (notFound) {
    return <ProfileNotFound username={routeUsername} />;
  }

  if (errorStatus != null || !profile) {
    return (
      <ProfileLoadError username={routeUsername} status={errorStatus} />
    );
  }

  return (
    <ProfileAchievementsClientContent
      routeUsername={routeUsername}
      initialProfile={profile}
    />
  );
}

function ProfileAchievementsClientContent({
  routeUsername,
  initialProfile,
}: {
  routeUsername: string;
  initialProfile: Parameters<typeof useProfileWithClientAchievements>[1];
}) {
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

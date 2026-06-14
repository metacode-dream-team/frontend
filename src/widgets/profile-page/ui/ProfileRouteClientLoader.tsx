"use client";

import Link from "next/link";
import {
  isProfileRouteCurrentUser,
  type ProfileData,
  useProfileMeStore,
} from "@/entities/profile";
import { useClientProfileLoader } from "../lib/useClientProfileLoader";
import { useProfileWithClientAchievements } from "../lib/useProfileWithClientAchievements";
import { ProfileLoadError } from "./ProfileLoadError";
import { ProfilePageContent } from "./ProfilePageContent";
import { ProfileRestrictedView } from "./ProfileRestrictedView";

interface ProfileRouteClientLoaderProps {
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

export function ProfileRouteClientLoader({ routeUsername }: ProfileRouteClientLoaderProps) {
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

  if (profile.visibility?.isAccessible === false) {
    return <ProfileRestrictedView username={routeUsername} />;
  }

  return (
    <ProfileRouteClientContent routeUsername={routeUsername} initialProfile={profile} />
  );
}

function ProfileRouteClientContent({
  routeUsername,
  initialProfile,
}: {
  routeUsername: string;
  initialProfile: ProfileData;
}) {
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

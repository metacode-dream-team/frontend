"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import type { ProfileData } from "@/entities/profile";
import {
  getProfileErrorStatus,
  isProfileNotFoundError,
} from "@/shared/lib/api/profileApi";
import { buildProfileFromPlatform } from "@/shared/lib/api/platformData";
import { shouldUseProfileMeEndpoint } from "./shouldUseProfileMeEndpoint";

export function useClientProfileLoader(routeUsername: string) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const me = useProfileMeStore((s) => s.profile);
  const isLoadingMe = useProfileMeStore((s) => s.isLoading);

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (accessToken && isLoadingMe) {
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setProfile(null);
    setErrorStatus(null);
    setNotFound(false);

    const useMeEndpoint = shouldUseProfileMeEndpoint(
      routeUsername,
      accessToken,
      me,
    );

    void (async () => {
      try {
        const data = await buildProfileFromPlatform(routeUsername, accessToken, {
          useMeEndpoint,
        });
        if (!cancelled) {
          setProfile(data);
        }
      } catch (err) {
        if (cancelled) return;
        if (isProfileNotFoundError(err)) {
          setNotFound(true);
          return;
        }
        setErrorStatus(getProfileErrorStatus(err));
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [routeUsername, accessToken, me, isLoadingMe]);

  const waitingForMe = Boolean(accessToken && isLoadingMe);

  return {
    profile,
    isLoading: isLoading || waitingForMe,
    errorStatus,
    notFound,
  };
}

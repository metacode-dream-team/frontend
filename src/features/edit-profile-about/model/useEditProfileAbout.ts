"use client";

import { useCallback, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import { formatProfileFillError } from "@/features/profile-basics";
import { updateProfileAbout } from "@/shared/lib/api/platformData";

export function useEditProfileAbout(options?: { onSuccess?: () => void }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useProfileMeStore((s) => s.fetchMe);

  const [about, setAboutState] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setAbout = (value: string) => {
    setAboutState(value);
    setError(null);
  };

  const resetFromProfile = useCallback((value: string | null | undefined) => {
    setAboutState(value?.trim() ?? "");
    setError(null);
  }, []);

  const submit = async (): Promise<boolean> => {
    setError(null);

    const trimmed = about.trim();
    if (!trimmed) {
      setError("About cannot be empty.");
      return false;
    }

    if (!accessToken) {
      setError("You must be signed in to save your profile.");
      return false;
    }

    setIsLoading(true);

    try {
      await updateProfileAbout(accessToken, { about: trimmed });
      await fetchMe(accessToken);
      options?.onSuccess?.();
      return true;
    } catch (err) {
      setError(formatProfileFillError(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    about,
    setAbout,
    resetFromProfile,
    submit,
    isLoading,
    error,
  };
}

"use client";

import { useCallback, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { type CurrentUserProfile, useProfileMeStore } from "@/entities/profile";
import { updateProfileFill, updateProfileIntro } from "@/shared/lib/api/platformData";
import {
  validateCompleteProfileForm,
  validateProfileIntroForm,
  type CompleteProfileFormValues,
} from "@/shared/lib/utils/validation";
import {
  emptyProfileBasicsForm,
  formatProfileFillError,
  formValuesToFillPayload,
  formValuesToIntroPayload,
  profileMeToFormValues,
} from "../lib/profileBasicsForm";

export function useProfileBasicsForm(options?: {
  onSuccess?: (newUsername: string) => void;
  mode?: "fill" | "intro";
}) {
  const mode = options?.mode ?? "fill";
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useProfileMeStore((s) => s.fetchMe);
  const profile = useProfileMeStore((s) => s.profile);

  const [values, setValues] = useState<CompleteProfileFormValues>(
    emptyProfileBasicsForm,
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetFromProfile = useCallback((me: CurrentUserProfile | null) => {
    if (!me) {
      setValues(emptyProfileBasicsForm);
      return;
    }
    setValues(profileMeToFormValues(me));
    setError(null);
  }, []);

  const setField = (field: keyof CompleteProfileFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const submit = async (): Promise<boolean> => {
    setError(null);

    const validation =
      mode === "intro"
        ? validateProfileIntroForm(values, { requireUsername: true })
        : validateCompleteProfileForm(values);
    if (!validation.isValid) {
      setError(validation.errors[0] ?? "Please fill in all required fields.");
      return false;
    }

    if (!accessToken) {
      setError("You must be signed in to save your profile.");
      return false;
    }

    setIsLoading(true);

    try {
      const newUsername = values.username.trim();
      const previousUsername = profile?.username?.trim() ?? "";
      const usernameChanged =
        Boolean(newUsername) &&
        Boolean(previousUsername) &&
        newUsername.toLowerCase() !== previousUsername.toLowerCase();

      if (mode === "intro" && usernameChanged && profile?.isComplete) {
        setError("Username cannot be changed after your profile is set up.");
        return false;
      }

      const includeUsername =
        mode === "intro" && !profile?.isComplete;

      if (mode === "fill") {
        await updateProfileFill(accessToken, formValuesToFillPayload(values));
      } else {
        await updateProfileIntro(
          accessToken,
          formValuesToIntroPayload(values, { includeUsername }),
        );
      }

      await fetchMe(accessToken);
      options?.onSuccess?.(newUsername);
      return true;
    } catch (err) {
      setError(formatProfileFillError(err));
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    values,
    setField,
    resetFromProfile,
    submit,
    isLoading,
    error,
    usernameLocked: mode === "intro" && Boolean(profile?.isComplete),
  };
}

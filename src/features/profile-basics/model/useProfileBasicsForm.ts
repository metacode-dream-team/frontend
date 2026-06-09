"use client";

import { useCallback, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { type CurrentUserProfile, useProfileMeStore } from "@/entities/profile";
import { fillProfileMe, updateProfileIntro } from "@/shared/lib/api/platformData";
import {
  validateCompleteProfileForm,
  validateProfileIntroForm,
  type CompleteProfileFormValues,
} from "@/shared/lib/utils/validation";
import {
  emptyProfileBasicsForm,
  formatProfileFillError,
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

      if (mode === "intro") {
        await updateProfileIntro(accessToken, formValuesToIntroPayload(values));

        const previousUsername = profile?.username?.trim() ?? "";
        if (
          newUsername &&
          previousUsername &&
          newUsername.toLowerCase() !== previousUsername.toLowerCase()
        ) {
          await fillProfileMe(accessToken, {
            username: newUsername,
            first_name: values.firstName.trim(),
            last_name: values.lastName.trim(),
            headline: values.headline.trim(),
            country: values.country.trim(),
            city: values.city.trim(),
          });
        }
      } else {
        await fillProfileMe(accessToken, {
          username: newUsername,
          first_name: values.firstName.trim(),
          last_name: values.lastName.trim(),
          headline: values.headline.trim(),
          country: values.country.trim(),
          city: values.city.trim(),
        });
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
  };
}

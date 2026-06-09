"use client";

import { useCallback, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import { formatProfileFillError } from "@/features/profile-basics";
import {
  emptyPersonalForm,
  formValuesToPersonalPayload,
  personalToFormValues,
  validatePersonalForm,
  type PersonalFormValues,
} from "@/features/profile-personal/lib/personalMappers";
import type { ProfilePersonal } from "@/shared/types/profile";
import { updateProfilePersonal } from "@/shared/lib/api/platformData";

export function useEditProfilePersonal(options?: { onSuccess?: () => void }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useProfileMeStore((s) => s.fetchMe);
  const me = useProfileMeStore((s) => s.profile);

  const [values, setValues] = useState<PersonalFormValues>(emptyPersonalForm);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetFromPersonal = useCallback(
    (personal?: ProfilePersonal | null) => {
      setValues(personalToFormValues(personal, me));
      setError(null);
    },
    [me],
  );

  const setField = useCallback((field: keyof PersonalFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }, []);

  const submit = async (): Promise<boolean> => {
    setError(null);

    const validationError = validatePersonalForm(values);
    if (validationError) {
      setError(validationError);
      return false;
    }

    if (!accessToken) {
      setError("You must be signed in to save personal info.");
      return false;
    }

    setIsLoading(true);

    try {
      await updateProfilePersonal(accessToken, formValuesToPersonalPayload(values));
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
    values,
    setField,
    resetFromPersonal,
    submit,
    isLoading,
    error,
  };
}

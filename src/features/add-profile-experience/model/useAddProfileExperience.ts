"use client";

import { useCallback, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import { formatProfileFillError } from "@/features/profile-basics";
import { createProfileExperience } from "@/shared/lib/api/platformData";
import {
  emptyExperienceForm,
  formValuesToExperiencePayload,
  validateExperienceForm,
  type ExperienceFormValues,
} from "../lib/experienceForm";

export function useAddProfileExperience(options?: { onSuccess?: () => void }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useProfileMeStore((s) => s.fetchMe);

  const [values, setValuesState] = useState<ExperienceFormValues>(emptyExperienceForm);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setField = useCallback(
    (field: keyof ExperienceFormValues, value: string) => {
      setValuesState((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    [],
  );

  const setIsCurrent = useCallback((isCurrent: boolean) => {
    setValuesState((prev) => ({
      ...prev,
      isCurrent,
      ...(isCurrent ? { endYear: "", endMonth: "" } : {}),
    }));
    setError(null);
  }, []);

  const resetForm = useCallback(() => {
    setValuesState(emptyExperienceForm);
    setError(null);
  }, []);

  const submit = async (): Promise<boolean> => {
    setError(null);

    const validationError = validateExperienceForm(values);
    if (validationError) {
      setError(validationError);
      return false;
    }

    if (!accessToken) {
      setError("You must be signed in to add experience.");
      return false;
    }

    setIsLoading(true);

    try {
      await createProfileExperience(
        accessToken,
        formValuesToExperiencePayload(values),
      );
      await fetchMe(accessToken);
      resetForm();
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
    setIsCurrent,
    resetForm,
    submit,
    isLoading,
    error,
  };
}

"use client";

import { useCallback, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import { formatProfileFillError } from "@/features/profile-basics";

interface UseProfilePostFormOptions<TValues, TPayload> {
  emptyValues: TValues;
  validate: (values: TValues) => string | null;
  toPayload: (values: TValues) => TPayload;
  submitRequest: (accessToken: string, payload: TPayload) => Promise<unknown>;
  onSuccess?: () => void;
  unsignedMessage?: string;
}

export function useProfilePostForm<TValues, TPayload>({
  emptyValues,
  validate,
  toPayload,
  submitRequest,
  onSuccess,
  unsignedMessage = "You must be signed in to save changes.",
}: UseProfilePostFormOptions<TValues, TPayload>) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useProfileMeStore((s) => s.fetchMe);

  const [values, setValuesState] = useState<TValues>(emptyValues);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setField = useCallback(
    <K extends keyof TValues>(field: K, value: TValues[K]) => {
      setValuesState((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    [],
  );

  const resetForm = useCallback(() => {
    setValuesState(emptyValues);
    setError(null);
  }, [emptyValues]);

  const submit = async (): Promise<boolean> => {
    setError(null);

    const validationError = validate(values);
    if (validationError) {
      setError(validationError);
      return false;
    }

    if (!accessToken) {
      setError(unsignedMessage);
      return false;
    }

    setIsLoading(true);

    try {
      await submitRequest(accessToken, toPayload(values));
      await fetchMe(accessToken);
      resetForm();
      onSuccess?.();
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
    resetForm,
    submit,
    isLoading,
    error,
  };
}

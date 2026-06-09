"use client";

import { useCallback, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import { formatProfileFillError } from "@/features/profile-basics";
import {
  contactsToFormValues,
  emptyContactsForm,
  formValuesToContactsPayload,
  validateContactsForm,
  type ContactsFormValues,
} from "@/features/profile-contacts/lib/contactsMappers";
import { updateProfileContacts } from "@/shared/lib/api/platformData";

export function useEditProfileContacts(options?: { onSuccess?: () => void }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useProfileMeStore((s) => s.fetchMe);
  const me = useProfileMeStore((s) => s.profile);

  const [values, setValues] = useState<ContactsFormValues>(emptyContactsForm);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const resetFromContacts = useCallback(
    (contacts?: Parameters<typeof contactsToFormValues>[0]) => {
      setValues(contactsToFormValues(contacts, me?.contacts));
      setError(null);
    },
    [me?.contacts],
  );

  const setField = useCallback(
    (field: keyof Omit<ContactsFormValues, "websites">, value: string) => {
      setValues((prev) => ({ ...prev, [field]: value }));
      setError(null);
    },
    [],
  );

  const addWebsite = useCallback(() => {
    setValues((prev) => ({
      ...prev,
      websites: [...prev.websites, { type: "website", url: "" }],
    }));
    setError(null);
  }, []);

  const removeWebsite = useCallback((index: number) => {
    setValues((prev) => ({
      ...prev,
      websites:
        prev.websites.length > 1
          ? prev.websites.filter((_, i) => i !== index)
          : prev.websites,
    }));
    setError(null);
  }, []);

  const updateWebsite = useCallback(
    (index: number, field: "type" | "url", value: string) => {
      setValues((prev) => ({
        ...prev,
        websites: prev.websites.map((site, i) =>
          i === index ? { ...site, [field]: value } : site,
        ),
      }));
      setError(null);
    },
    [],
  );

  const submit = async (): Promise<boolean> => {
    setError(null);

    const validationError = validateContactsForm(values);
    if (validationError) {
      setError(validationError);
      return false;
    }

    if (!accessToken) {
      setError("You must be signed in to save contact info.");
      return false;
    }

    setIsLoading(true);

    try {
      await updateProfileContacts(accessToken, formValuesToContactsPayload(values));
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
    addWebsite,
    removeWebsite,
    updateWebsite,
    resetFromContacts,
    submit,
    isLoading,
    error,
  };
}

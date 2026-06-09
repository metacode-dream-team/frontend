"use client";

import { useProfilePostForm } from "@/features/profile-forms";
import { createProfileLanguage } from "@/shared/lib/api/platformData";
import {
  emptyLanguageForm,
  formValuesToLanguagePayload,
  validateLanguageForm,
} from "../lib/languageForm";

export function useAddProfileLanguage(options?: { onSuccess?: () => void }) {
  return useProfilePostForm({
    emptyValues: emptyLanguageForm,
    validate: validateLanguageForm,
    toPayload: formValuesToLanguagePayload,
    submitRequest: createProfileLanguage,
    onSuccess: options?.onSuccess,
    unsignedMessage: "You must be signed in to add a language.",
  });
}

"use client";

import { useProfilePostForm } from "@/features/profile-forms";
import { createProfileEducation } from "@/shared/lib/api/platformData";
import {
  emptyEducationForm,
  formValuesToEducationPayload,
  validateEducationForm,
} from "../lib/educationForm";

export function useAddProfileEducation(options?: { onSuccess?: () => void }) {
  return useProfilePostForm({
    emptyValues: emptyEducationForm,
    validate: validateEducationForm,
    toPayload: formValuesToEducationPayload,
    submitRequest: createProfileEducation,
    onSuccess: options?.onSuccess,
    unsignedMessage: "You must be signed in to add education.",
  });
}

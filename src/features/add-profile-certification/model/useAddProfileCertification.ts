"use client";

import { useProfilePostForm } from "@/features/profile-forms";
import { createProfileCertification } from "@/shared/lib/api/platformData";
import {
  emptyCertificationForm,
  formValuesToCertificationPayload,
  validateCertificationForm,
} from "../lib/certificationForm";

export function useAddProfileCertification(options?: { onSuccess?: () => void }) {
  return useProfilePostForm({
    emptyValues: emptyCertificationForm,
    validate: validateCertificationForm,
    toPayload: formValuesToCertificationPayload,
    submitRequest: createProfileCertification,
    onSuccess: options?.onSuccess,
    unsignedMessage: "You must be signed in to add a certification.",
  });
}

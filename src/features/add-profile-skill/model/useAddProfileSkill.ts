"use client";

import { useProfilePostForm } from "@/features/profile-forms";
import { createProfileSkill } from "@/shared/lib/api/platformData";
import {
  emptySkillForm,
  formValuesToSkillPayload,
  validateSkillForm,
} from "../lib/skillForm";

export function useAddProfileSkill(options?: { onSuccess?: () => void }) {
  return useProfilePostForm({
    emptyValues: emptySkillForm,
    validate: validateSkillForm,
    toPayload: formValuesToSkillPayload,
    submitRequest: createProfileSkill,
    onSuccess: options?.onSuccess,
    unsignedMessage: "You must be signed in to add a skill.",
  });
}

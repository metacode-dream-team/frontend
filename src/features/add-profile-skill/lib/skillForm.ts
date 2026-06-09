import type { ProfileSkillPayload } from "@/shared/types/profile";

export interface SkillFormValues {
  name: string;
}

export const emptySkillForm: SkillFormValues = {
  name: "",
};

export function validateSkillForm(values: SkillFormValues): string | null {
  if (!values.name.trim()) {
    return "Skill name is required.";
  }
  return null;
}

export function formValuesToSkillPayload(values: SkillFormValues): ProfileSkillPayload {
  return {
    name: values.name.trim(),
  };
}

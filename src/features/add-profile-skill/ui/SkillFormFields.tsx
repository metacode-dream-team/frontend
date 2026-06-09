"use client";

import { Input } from "@/shared/ui/Input";
import type { SkillFormValues } from "../lib/skillForm";

interface SkillFormFieldsProps {
  values: SkillFormValues;
  setField: (field: keyof SkillFormValues, value: string) => void;
  disabled?: boolean;
}

export function SkillFormFields({
  values,
  setField,
  disabled = false,
}: SkillFormFieldsProps) {
  return (
    <Input
      label="Skill name"
      variant="auth"
      value={values.name}
      onChange={(e) => setField("name", e.target.value)}
      placeholder="PostgreSQL"
      required
      disabled={disabled}
    />
  );
}

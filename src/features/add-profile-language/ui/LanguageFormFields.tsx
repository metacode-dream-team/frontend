"use client";

import { AuthSelect } from "@/shared/ui/AuthSelect/AuthSelect";
import {
  LANGUAGE_CODES,
  LANGUAGE_LEVELS,
  type LanguageFormValues,
} from "../lib/languageForm";

interface LanguageFormFieldsProps {
  values: LanguageFormValues;
  setField: (field: keyof LanguageFormValues, value: string) => void;
  disabled?: boolean;
}

export function LanguageFormFields({
  values,
  setField,
  disabled = false,
}: LanguageFormFieldsProps) {
  return (
    <div className="space-y-4">
      <AuthSelect
        id="language-code"
        label="Language"
        value={values.code}
        onChange={(value) => setField("code", value)}
        disabled={disabled}
      >
        {LANGUAGE_CODES.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </AuthSelect>

      <AuthSelect
        id="language-level"
        label="Proficiency level"
        value={values.level}
        onChange={(value) => setField("level", value)}
        disabled={disabled}
      >
        {LANGUAGE_LEVELS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </AuthSelect>
    </div>
  );
}

import type { ProfileLanguagePayload } from "@/shared/types/profile";

export interface LanguageFormValues {
  code: string;
  level: string;
}

export const LANGUAGE_CODES = [
  { value: "eng", label: "English" },
  { value: "rus", label: "Russian" },
  { value: "kaz", label: "Kazakh" },
  { value: "ukr", label: "Ukrainian" },
  { value: "deu", label: "German" },
  { value: "fra", label: "French" },
  { value: "spa", label: "Spanish" },
  { value: "zho", label: "Chinese" },
  { value: "jpn", label: "Japanese" },
  { value: "kor", label: "Korean" },
  { value: "tur", label: "Turkish" },
] as const;

export const LANGUAGE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "elementary", label: "Elementary" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "native", label: "Native" },
] as const;

export const emptyLanguageForm: LanguageFormValues = {
  code: "eng",
  level: "intermediate",
};

const CODE_LABELS = Object.fromEntries(
  LANGUAGE_CODES.map((item) => [item.value, item.label]),
) as Record<string, string>;

const LEVEL_LABELS = Object.fromEntries(
  LANGUAGE_LEVELS.map((item) => [item.value, item.label]),
) as Record<string, string>;

export function formatLanguageCodeDisplay(code: string): string {
  const normalized = code.trim().toLowerCase();
  return CODE_LABELS[normalized] ?? normalized.toUpperCase();
}

export function formatLanguageLevelDisplay(level: string): string {
  const normalized = level.trim().toLowerCase();
  return LEVEL_LABELS[normalized] ?? normalized.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function validateLanguageForm(values: LanguageFormValues): string | null {
  const code = values.code.trim().toLowerCase();
  const level = values.level.trim().toLowerCase();

  if (!code) return "Language is required.";
  if (!/^[a-z]{2,3}$/.test(code)) {
    return "Language code must be 2–3 letters.";
  }
  if (!level) return "Proficiency level is required.";

  return null;
}

export function formValuesToLanguagePayload(
  values: LanguageFormValues,
): ProfileLanguagePayload {
  return {
    code: values.code.trim().toLowerCase(),
    level: values.level.trim().toLowerCase(),
  };
}

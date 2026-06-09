import type { CurrentUserProfile } from "@/entities/profile";
import type {
  ProfilePersonal,
  ProfilePersonalPayload,
} from "@/shared/types/profile";

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export interface PersonalFormValues {
  address: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: string;
}

export const emptyPersonalForm: PersonalFormValues = {
  address: "",
  birthYear: "",
  birthMonth: "",
  birthDay: "",
  gender: "",
};

export function personalToFormValues(
  personal: ProfilePersonal | null | undefined,
  me: CurrentUserProfile | null,
): PersonalFormValues {
  if (personal) {
    return {
      address: personal.address ?? "",
      birthYear: personal.birthDate ? String(personal.birthDate.year) : "",
      birthMonth: personal.birthDate ? String(personal.birthDate.month) : "",
      birthDay: personal.birthDate ? String(personal.birthDate.day) : "",
      gender: personal.gender ?? "",
    };
  }

  if (me) {
    const parts = me.birthDateParts;
    return {
      address: me.address ?? "",
      birthYear: parts ? String(parts.year) : "",
      birthMonth: parts ? String(parts.month) : "",
      birthDay: parts ? String(parts.day) : "",
      gender: me.gender ?? "",
    };
  }

  return emptyPersonalForm;
}

export function formValuesToPersonalPayload(
  values: PersonalFormValues,
): ProfilePersonalPayload {
  const payload: ProfilePersonalPayload = {};
  const address = values.address.trim();
  const gender = values.gender.trim();

  if (address) payload.address = address;
  if (gender) payload.gender = gender;

  const year = Number(values.birthYear);
  const month = Number(values.birthMonth);
  const day = Number(values.birthDay);
  if (
    Number.isFinite(year) &&
    Number.isFinite(month) &&
    Number.isFinite(day) &&
    values.birthYear.trim() &&
    values.birthMonth.trim() &&
    values.birthDay.trim()
  ) {
    payload.birth_date = {
      year: Math.trunc(year),
      month: Math.trunc(month),
      day: Math.trunc(day),
    };
  }

  return payload;
}

export function validatePersonalForm(values: PersonalFormValues): string | null {
  const hasAnyBirth =
    values.birthYear.trim() ||
    values.birthMonth.trim() ||
    values.birthDay.trim();

  if (hasAnyBirth) {
    const year = Number(values.birthYear);
    const month = Number(values.birthMonth);
    const day = Number(values.birthDay);

    if (!Number.isFinite(year) || year < 1900 || year > 2100) {
      return "Enter a valid birth year.";
    }
    if (!Number.isFinite(month) || month < 1 || month > 12) {
      return "Birth month must be between 1 and 12.";
    }
    if (!Number.isFinite(day) || day < 1 || day > 31) {
      return "Birth day must be between 1 and 31.";
    }
  }

  return null;
}

export function formatBirthDateDisplay(
  birthDate?: ProfilePersonal["birthDate"],
): string | null {
  if (!birthDate) return null;
  const month = MONTH_SHORT[birthDate.month - 1];
  if (!month) return String(birthDate.year);
  return `${month} ${birthDate.day}, ${birthDate.year}`;
}

export function formatGenderDisplay(gender?: string): string | null {
  if (!gender?.trim()) return null;
  const g = gender.trim().toLowerCase();
  if (g === "male") return "Male";
  if (g === "female") return "Female";
  return gender.trim();
}

export function hasPersonalContent(personal?: ProfilePersonal | null): boolean {
  if (!personal) return false;
  return Boolean(
    personal.address?.trim() ||
      personal.gender?.trim() ||
      personal.birthDate,
  );
}

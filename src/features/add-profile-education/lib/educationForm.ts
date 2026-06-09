import type { ProfileEducationPayload } from "@/shared/types/profile";
import { compareYearMonth, parseYearMonth } from "@/shared/lib/utils/yearMonth";

export interface EducationFormValues {
  school: string;
  degree: string;
  fieldOfStudy: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  grade: string;
  description: string;
}

export const emptyEducationForm: EducationFormValues = {
  school: "",
  degree: "",
  fieldOfStudy: "",
  startYear: "",
  startMonth: "",
  endYear: "",
  endMonth: "",
  grade: "",
  description: "",
};

export function validateEducationForm(values: EducationFormValues): string | null {
  if (!values.school.trim()) return "School is required.";
  if (!values.degree.trim()) return "Degree is required.";

  const start = parseYearMonth(values.startYear, values.startMonth, "start date");
  if (start.error) return start.error;
  if (!start.value) return "Start date is required.";

  const end = parseYearMonth(values.endYear, values.endMonth, "end date");
  if (end.error) return end.error;
  if (end.value && start.value && compareYearMonth(end.value, start.value) < 0) {
    return "End date cannot be before the start date.";
  }

  return null;
}

export function formValuesToEducationPayload(
  values: EducationFormValues,
): ProfileEducationPayload {
  const start = parseYearMonth(values.startYear, values.startMonth, "start date");
  const end = parseYearMonth(values.endYear, values.endMonth, "end date");
  const fieldOfStudy = values.fieldOfStudy.trim();
  const grade = values.grade.trim();
  const description = values.description.trim();

  const payload: ProfileEducationPayload = {
    school: values.school.trim(),
    degree: values.degree.trim(),
    start_date: start.value!,
  };

  if (fieldOfStudy) payload.field_of_study = fieldOfStudy;
  if (end.value) payload.end_date = end.value;
  if (grade) payload.grade = grade;
  if (description) payload.description = description;

  return payload;
}

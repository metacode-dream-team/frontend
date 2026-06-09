import type { ProfileExperiencePayload } from "@/shared/types/profile";
import { compareYearMonth, parseYearMonth } from "@/shared/lib/utils/yearMonth";

export interface ExperienceFormValues {
  title: string;
  employmentType: string;
  company: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  isCurrent: boolean;
  country: string;
  city: string;
  locationType: string;
  description: string;
  profileHeadline: string;
}

export const emptyExperienceForm: ExperienceFormValues = {
  title: "",
  employmentType: "full_time",
  company: "",
  startYear: "",
  startMonth: "",
  endYear: "",
  endMonth: "",
  isCurrent: false,
  country: "",
  city: "",
  locationType: "onsite",
  description: "",
  profileHeadline: "",
};

export function validateExperienceForm(values: ExperienceFormValues): string | null {
  if (!values.title.trim()) return "Job title is required.";
  if (!values.company.trim()) return "Company is required.";
  if (!values.employmentType.trim()) return "Employment type is required.";
  if (!values.locationType.trim()) return "Work mode is required.";

  const start = parseYearMonth(values.startYear, values.startMonth, "start date");
  if (start.error) return start.error;
  if (!start.value) return "Start date is required.";

  if (!values.isCurrent) {
    const end = parseYearMonth(values.endYear, values.endMonth, "end date");
    if (end.error) return end.error;
    if (end.value && start.value && compareYearMonth(end.value, start.value) < 0) {
      return "End date cannot be before the start date.";
    }
  }

  if (!values.country.trim() && !values.city.trim()) {
    return "Enter at least a country or city for location.";
  }

  return null;
}

export function formValuesToExperiencePayload(
  values: ExperienceFormValues,
): ProfileExperiencePayload {
  const start = parseYearMonth(values.startYear, values.startMonth, "start date");
  const end = parseYearMonth(values.endYear, values.endMonth, "end date");
  const description = values.description.trim();
  const profileHeadline = values.profileHeadline.trim();

  const payload: ProfileExperiencePayload = {
    title: values.title.trim(),
    employment_type: values.employmentType.trim(),
    company: values.company.trim(),
    start_date: start.value!,
    is_current: values.isCurrent,
    location: {
      country: values.country.trim(),
      city: values.city.trim(),
    },
    location_type: values.locationType.trim(),
  };

  if (!values.isCurrent && end.value) {
    payload.end_date = end.value;
  }
  if (description) payload.description = description;
  if (profileHeadline) payload.profile_headline = profileHeadline;

  return payload;
}

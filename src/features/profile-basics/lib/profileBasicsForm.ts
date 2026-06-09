import type { CurrentUserProfile } from "@/entities/profile";
import type { ProfileIntroPayload } from "@/shared/types/profile";
import { normalizeUrl } from "@/shared/lib/utils/normalizeUrl";
import type { CompleteProfileFormValues } from "@/shared/lib/utils/validation";

export const emptyProfileBasicsForm: CompleteProfileFormValues = {
  username: "",
  firstName: "",
  lastName: "",
  headline: "",
  positionLink: "",
  schoolLink: "",
  country: "",
  city: "",
};

export function parseLocationPrefill(location: string | null | undefined): {
  country: string;
  city: string;
} {
  if (!location?.trim()) {
    return { country: "", city: "" };
  }
  const parts = location.split(",").map((p) => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    return {
      city: parts[0] ?? "",
      country: parts.slice(1).join(", "),
    };
  }
  return { country: parts[0] ?? "", city: "" };
}

export function profileMeToFormValues(
  me: CurrentUserProfile,
): CompleteProfileFormValues {
  const { country, city } = parseLocationPrefill(me.location);
  return {
    username: me.username ?? "",
    firstName: me.firstName ?? "",
    lastName: me.lastName ?? "",
    headline: me.headline ?? "",
    positionLink: me.positionLink ?? "",
    schoolLink: me.schoolLink ?? "",
    country,
    city,
  };
}

export function formValuesToIntroPayload(
  values: CompleteProfileFormValues,
): ProfileIntroPayload {
  const payload: ProfileIntroPayload = {
    first_name: values.firstName.trim(),
    last_name: values.lastName.trim(),
    headline: values.headline.trim(),
    country: values.country.trim(),
    city: values.city.trim(),
  };

  const positionLink = values.positionLink.trim();
  const schoolLink = values.schoolLink.trim();
  if (positionLink) payload.position_link = normalizeUrl(positionLink);
  if (schoolLink) payload.school_link = normalizeUrl(schoolLink);

  return payload;
}

export function formatProfileFillError(err: unknown): string {
  if (!(err instanceof Error)) {
    return "Failed to save profile. Please try again.";
  }
  const message = err.message;
  if (message.includes("409")) {
    return "This username is already taken. Choose another one.";
  }
  if (message.includes("400")) {
    return "Some fields are invalid. Check your input and try again.";
  }
  if (message.startsWith("Invalid avatar upload response:")) {
    return "Avatar uploaded, but the server response was unexpected. Refresh the page.";
  }
  return message.replace(/^(?:Integration|Backend|Platform) API \d+: /, "") || message;
}

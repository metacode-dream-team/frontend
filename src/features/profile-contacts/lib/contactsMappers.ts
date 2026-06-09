import type {
  ProfileContacts,
  ProfileContactsPayload,
} from "@/shared/types/profile";
import { normalizeUrl, validateOptionalUrl } from "@/shared/lib/utils/normalizeUrl";
import { validateEmail } from "@/shared/lib/utils/validation";

export interface ContactsFormValues {
  email: string;
  phoneType: string;
  phoneValue: string;
  websites: Array<{ type: string; url: string }>;
}

export const emptyContactsForm: ContactsFormValues = {
  email: "",
  phoneType: "mobile",
  phoneValue: "",
  websites: [{ type: "portfolio", url: "" }],
};

function sid(v: unknown): string {
  return v == null ? "" : String(v);
}

function mapRawPhone(raw: unknown): { type: string; value: string } {
  if (raw && typeof raw === "object") {
    const o = raw as Record<string, unknown>;
    return {
      type: sid(o.Type ?? o.type).trim() || "mobile",
      value: sid(o.Value ?? o.value).trim(),
    };
  }
  const value = sid(raw).trim();
  return { type: "mobile", value };
}

export function contactsToFormValues(
  contacts: ProfileContacts | null | undefined,
  meContactsRaw?: unknown,
): ContactsFormValues {
  if (contacts) {
    return {
      email: contacts.email ?? "",
      phoneType: contacts.phone?.type ?? "mobile",
      phoneValue: contacts.phone?.value ?? "",
      websites:
        contacts.websites.length > 0
          ? contacts.websites.map((w) => ({ type: w.type, url: w.url }))
          : [{ type: "portfolio", url: "" }],
    };
  }

  if (meContactsRaw && typeof meContactsRaw === "object") {
    const o = meContactsRaw as Record<string, unknown>;
    const phone = mapRawPhone(o.Phone ?? o.phone);
    const websitesRaw = o.Websites ?? o.websites;
    const websites = Array.isArray(websitesRaw)
      ? websitesRaw
          .map((item) => {
            const w = item as Record<string, unknown>;
            return {
              type: sid(w.Type ?? w.type).trim() || "website",
              url: sid(w.URL ?? w.url).trim(),
            };
          })
          .filter((w) => w.url)
      : [];

    return {
      email: sid(o.Email ?? o.email).trim(),
      phoneType: phone.type,
      phoneValue: phone.value,
      websites: websites.length > 0 ? websites : [{ type: "portfolio", url: "" }],
    };
  }

  return emptyContactsForm;
}

export function formValuesToContactsPayload(
  values: ContactsFormValues,
): ProfileContactsPayload {
  const email = values.email.trim();
  const phoneValue = values.phoneValue.trim();
  const websites = values.websites
    .map((w) => {
      const url = w.url.trim();
      if (!url) return null;
      return {
        type: w.type.trim() || "website",
        url: normalizeUrl(url),
      };
    })
    .filter((w): w is NonNullable<typeof w> => w !== null);

  const payload: ProfileContactsPayload = { websites };

  if (email) payload.email = email;
  if (phoneValue) {
    payload.phone = {
      type: values.phoneType.trim() || "mobile",
      value: phoneValue,
    };
  }

  return payload;
}

export function validateContactsForm(values: ContactsFormValues): string | null {
  const email = values.email.trim();
  if (email && !validateEmail(email)) {
    return "Invalid email format.";
  }

  const phoneValue = values.phoneValue.trim();
  if (phoneValue && phoneValue.replace(/\D/g, "").length < 5) {
    return "Phone number looks too short.";
  }

  for (const site of values.websites) {
    const urlError = validateOptionalUrl(site.url, `URL (${site.type || "website"})`);
    if (urlError) return urlError;
  }

  return null;
}

export function hasContactsContent(contacts?: ProfileContacts | null): boolean {
  if (!contacts) return false;
  return Boolean(
    contacts.email?.trim() ||
      contacts.phone?.value?.trim() ||
      contacts.websites.length > 0,
  );
}

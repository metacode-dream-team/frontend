import type { ProfileCertificationPayload } from "@/shared/types/profile";
import { normalizeUrl, validateOptionalUrl } from "@/shared/lib/utils/normalizeUrl";
import { compareYearMonth, parseYearMonth } from "@/shared/lib/utils/yearMonth";

export interface CertificationFormValues {
  name: string;
  issuer: string;
  issueYear: string;
  issueMonth: string;
  expireYear: string;
  expireMonth: string;
  credentialUrl: string;
}

export const emptyCertificationForm: CertificationFormValues = {
  name: "",
  issuer: "",
  issueYear: "",
  issueMonth: "",
  expireYear: "",
  expireMonth: "",
  credentialUrl: "",
};

export function validateCertificationForm(
  values: CertificationFormValues,
): string | null {
  const name = values.name.trim();
  const issuer = values.issuer.trim();

  if (!name) return "Certification name is required.";
  if (!issuer) return "Issuer is required.";

  const issue = parseYearMonth(values.issueYear, values.issueMonth, "issue date");
  if (issue.error) return issue.error;
  if (!issue.value) return "Issue date is required.";

  const expire = parseYearMonth(values.expireYear, values.expireMonth, "expiration date");
  if (expire.error) return expire.error;
  if (expire.value && issue.value && compareYearMonth(expire.value, issue.value) < 0) {
    return "Expiration date cannot be before the issue date.";
  }

  return validateOptionalUrl(values.credentialUrl, "Credential URL");
}

export function formValuesToCertificationPayload(
  values: CertificationFormValues,
): ProfileCertificationPayload {
  const issue = parseYearMonth(values.issueYear, values.issueMonth, "issue date");
  const expire = parseYearMonth(values.expireYear, values.expireMonth, "expiration date");
  const credentialUrl = values.credentialUrl.trim();

  const payload: ProfileCertificationPayload = {
    name: values.name.trim(),
    issuer: values.issuer.trim(),
    issue_date: issue.value!,
  };

  if (expire.value) {
    payload.expire_date = expire.value;
  }
  if (credentialUrl) {
    payload.credential_url = normalizeUrl(credentialUrl);
  }

  return payload;
}

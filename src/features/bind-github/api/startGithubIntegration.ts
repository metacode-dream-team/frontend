import { GITHUB_PROVIDER_START_PATH } from "@/shared/config/constants";
import { buildApiUrl } from "@/shared/lib/api/apiUrl";

function pickRedirectUrl(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const candidates = [
    record.url,
    record.redirect_url,
    record.redirectUrl,
    record.authorization_url,
    record.authorizationUrl,
    record.location,
  ];

  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  for (const nestedKey of ["data", "result"] as const) {
    const nested = record[nestedKey];
    const fromNested = pickRedirectUrl(nested);
    if (fromNested) {
      return fromNested;
    }
  }

  return null;
}

export async function startGithubIntegration(accessToken: string): Promise<void> {
  const url = buildApiUrl(GITHUB_PROVIDER_START_PATH);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    credentials: "omit",
    cache: "no-store",
    redirect: "manual",
  });

  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get("Location");
    if (!location) {
      throw new Error("GitHub connect redirect URL is missing");
    }
    window.location.assign(location);
    return;
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Integration API ${response.status}: ${text.slice(0, 240)}`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  let payload: unknown = null;
  if (contentType.includes("application/json")) {
    payload = await response.json();
  }

  const redirectUrl = pickRedirectUrl(payload);
  if (!redirectUrl) {
    throw new Error("GitHub connect did not return a redirect URL");
  }

  window.location.assign(redirectUrl);
}

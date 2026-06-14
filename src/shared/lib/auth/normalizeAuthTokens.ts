import type { AuthTokens, RefreshTokenResponse } from "@/shared/types/api";

function unwrapTokenPayload(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") {
    return {};
  }
  const r = raw as Record<string, unknown>;
  const nested =
    r.data && typeof r.data === "object"
      ? (r.data as Record<string, unknown>)
      : r.tokens && typeof r.tokens === "object"
        ? (r.tokens as Record<string, unknown>)
        : r.result && typeof r.result === "object"
          ? (r.result as Record<string, unknown>)
          : null;
  if (!nested) {
    return r;
  }
  return { ...r, ...nested };
}

export function normalizeAuthTokens(raw: unknown): AuthTokens {
  const flat = unwrapTokenPayload(raw);
  const access =
    (flat.access_token as string | undefined) ??
    (flat.accessToken as string | undefined);
  if (!access?.trim()) {
    throw new Error("Invalid auth response: missing access token");
  }
  return {
    access_token: access.trim(),
    id_token:
      (flat.id_token as string | undefined) ??
      (flat.idToken as string | undefined) ??
      "",
    expires_in: Number(flat.expires_in ?? flat.expiresIn ?? 3600),
    token_type:
      (flat.token_type as string) ?? (flat.tokenType as string) ?? "Bearer",
    refresh_token: flat.refresh_token as string | undefined,
  };
}

export function normalizeRefreshTokenResponse(raw: unknown): RefreshTokenResponse {
  const tokens = normalizeAuthTokens(raw);
  return {
    access_token: tokens.access_token,
    id_token: tokens.id_token,
    expires_in: tokens.expires_in,
    token_type: tokens.token_type,
    refresh_token: tokens.refresh_token,
  };
}

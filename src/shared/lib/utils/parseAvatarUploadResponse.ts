type Json = Record<string, unknown>;

function pickUrl(raw: unknown): string | null {
  if (typeof raw === "string" && raw.trim()) {
    return raw.trim();
  }
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const o = raw as Json;
  const candidates = [
    o.avatar_url,
    o.avatarUrl,
    o.AvatarURL,
    o.url,
    o.URL,
    o.file_url,
    o.fileUrl,
  ];
  for (const value of candidates) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  const nested = o.data ?? o.result;
  if (nested && typeof nested === "object") {
    return pickUrl(nested);
  }
  return null;
}

export function parseAvatarUploadResponse(raw: unknown): string {
  const url = pickUrl(raw);
  if (!url) {
    throw new Error("Invalid avatar upload response: missing URL.");
  }
  return url;
}

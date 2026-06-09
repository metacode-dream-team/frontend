export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function validateOptionalUrl(url: string, label: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;
  try {
    new URL(normalizeUrl(trimmed));
    return null;
  } catch {
    return `${label} is invalid.`;
  }
}

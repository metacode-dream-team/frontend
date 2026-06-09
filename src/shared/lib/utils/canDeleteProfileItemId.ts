const CLIENT_FALLBACK_ID_PATTERNS = [
  /^ed-me-\d+$/,
  /^exp-me-\d+$/,
  /^lang-me-\d+$/,
  /^skill-me-\d+$/,
  /^e\d+$/,
  /^ed\d+$/,
  /^cert\d+$/,
  /^tech\d+$/,
  /^skill-mock-\d+$/,
];

export function canDeleteProfileItemId(id: string): boolean {
  const trimmed = id.trim();
  if (!trimmed) return false;
  return !CLIENT_FALLBACK_ID_PATTERNS.some((pattern) => pattern.test(trimmed));
}

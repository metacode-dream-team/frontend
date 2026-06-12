const USERNAME_PATTERN = /^[a-zA-Z0-9_-]{1,30}$/;

export function validatePlatformUsername(
  raw: string,
  platformLabel: string,
): string | null {
  const username = raw.trim();
  if (!username) {
    return `${platformLabel} username is required.`;
  }
  if (!USERNAME_PATTERN.test(username)) {
    return "Use 1–30 characters: letters, numbers, underscore, or hyphen.";
  }
  return null;
}

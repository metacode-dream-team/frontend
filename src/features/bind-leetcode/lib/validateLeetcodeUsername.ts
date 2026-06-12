import { validatePlatformUsername } from "@/shared/lib/integration/validatePlatformUsername";

export function validateLeetcodeUsername(raw: string): string | null {
  return validatePlatformUsername(raw, "LeetCode");
}

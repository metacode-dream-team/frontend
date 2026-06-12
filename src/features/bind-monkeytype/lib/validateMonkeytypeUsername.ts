import { validatePlatformUsername } from "@/shared/lib/integration/validatePlatformUsername";

export function validateMonkeytypeUsername(raw: string): string | null {
  return validatePlatformUsername(raw, "Monkeytype");
}

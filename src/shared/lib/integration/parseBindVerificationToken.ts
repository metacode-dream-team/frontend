import { unwrapDataPayload } from "@/shared/lib/api/platformMappers";

export function parseBindVerificationToken(raw: unknown): string {
  const data = unwrapDataPayload(raw);
  const token = data.token ?? data.Token;
  if (typeof token !== "string" || !token.trim()) {
    throw new Error("Bind response is missing verification token.");
  }
  return token.trim();
}

import type { ProfileData } from "@/shared/types/profile";
import { buildProfileFromPlatform } from "./platformData";

// TODO: просмотр чужого профиля — вернуть публичную загрузку через fetchProfileByUsername.
export async function getProfileById(id: string): Promise<ProfileData> {
  return buildProfileFromPlatform(id);
}

export function getProfileErrorStatus(error: unknown): number | null {
  if (!(error instanceof Error)) return null;
  const match = error.message.match(/\b(\d{3})\b/);
  return match ? Number(match[1]) : null;
}

export function isProfileNotFoundError(error: unknown): boolean {
  return getProfileErrorStatus(error) === 404;
}

export function isProfileUnauthorizedError(error: unknown): boolean {
  return getProfileErrorStatus(error) === 401;
}

import type { ProfileData } from "@/entities/profile";
import { isDicebearProfileAvatar } from "@/shared/lib/api/platformMappers";

/** Loader уже подтянул integration / rank / solved — повторный client-fetch не нужен. */
export function profileHasLoaderEnrichment(profile: ProfileData): boolean {
  return (
    profile.rank > 0 ||
    profile.heatmap.length > 0 ||
    profile.solved > 0 ||
    profile.skills.length > 0 ||
    !isDicebearProfileAvatar(profile.avatarUrl, profile.username)
  );
}

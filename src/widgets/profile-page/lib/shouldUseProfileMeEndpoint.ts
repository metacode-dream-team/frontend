import type { CurrentUserProfile } from "@/entities/profile";
import { isProfileRouteCurrentUser } from "@/entities/profile";
import { decodeJwt } from "@/shared/lib/utils/jwt";

function tokenIdentityCandidates(accessToken: string): string[] {
  const payload = decodeJwt(accessToken);
  if (!payload) return [];

  const out: string[] = [];
  for (const key of ["preferred_username", "email", "sub"] as const) {
    const value = payload[key];
    if (typeof value === "string" && value.trim()) {
      out.push(value.trim().toLowerCase());
    }
  }
  return out;
}

export function shouldUseProfileMeEndpoint(
  routeUsername: string,
  accessToken: string | null | undefined,
  me: CurrentUserProfile | null,
): boolean {
  if (!accessToken) return false;
  if (isProfileRouteCurrentUser(routeUsername, me)) return true;

  const route = routeUsername.trim().toLowerCase();
  if (!route) return false;

  return tokenIdentityCandidates(accessToken).includes(route);
}

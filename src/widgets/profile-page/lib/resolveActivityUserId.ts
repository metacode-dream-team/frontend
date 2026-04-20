import {
  isProfileRouteCurrentUser,
  type CurrentUserProfile,
  type ProfileData,
} from "@/entities/profile";

/**
 * `user_id` для integration и activity совпадает с **UserID** в API (см. /v1/profiles/me), не с полем `ID` записи профиля.
 *
 * Источники на клиенте (с Bearer), как в продукте:
 * 1. `GET /v1/profiles/me` → `useProfileMeStore` (`me.userId` = UserID)
 * 2. `GET /v1/activity/user/achievement?user_id=…`
 * 3. `GET /v1/integration/profile?user_id=…` (GitHub / LeetCode / Monkeytype для теплокарты)
 */
export function resolveActivityUserId(
  routeUsername: string,
  me: CurrentUserProfile | null,
  initialProfile: ProfileData,
): string | null {
  if (me && isProfileRouteCurrentUser(routeUsername, me)) {
    const uid = me.userId?.trim();
    if (uid) return uid;
  }
  const id = initialProfile.id?.trim() ?? "";
  if (/^[0-9a-f-]{36}$/i.test(id)) {
    return id;
  }
  return null;
}

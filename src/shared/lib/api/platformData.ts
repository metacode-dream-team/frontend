import {
  AVATAR_UPLOAD_PATH,
  GITHUB_UNLINK_PATH,
  LEETCODE_BIND_PATH,
  LEETCODE_UNBIND_PATH,
  MONKEYTYPE_BIND_PATH,
  MONKEYTYPE_UNBIND_PATH,
  PROFILE_INTRO_PATH,
  PROFILE_FILL_PATH,
} from "@/shared/config/constants";
import {
  authBackendDelete,
  authBackendMultipartPost,
  integrationDelete,
  integrationGet,
  integrationPatch,
  integrationPost,
  platformGet,
} from "./platformClient";
import { parseAvatarUploadResponse } from "@/shared/lib/utils/parseAvatarUploadResponse";
import {
  applyActivityStreakToProfile,
  augmentProfileWithIntegration,
  mapAchievementsPayload,
  mapStreakPayload,
  mapCalendarToActivityDays,
  mapCalendarToProfileHeatmap,
  mapIntegrationProfileToActivityDays,
  mapIntegrationProfileToStats,
  mapProfileDocument,
  pickUserId,
  unwrapDataPayload,
} from "./platformMappers";
import type {
  ProfileAboutPayload,
  ProfileAchievement,
  ProfileCertificationPayload,
  ProfileContactsPayload,
  ProfileEducationPayload,
  ProfileExperiencePayload,
  ProfileData,
  ProfileHeatmapDay,
  ProfileFillPayload,
  ProfileIntroPayload,
  ProfileLanguagePayload,
  ProfilePersonalPayload,
  ProfileSkillPayload,
} from "@/shared/types/profile";
import type { ActivityDay, GithubStats, LeetcodeStats, MonkeytypeStats } from "@/shared/types/stats";

type Json = Record<string, unknown>;

function profileMeItemPath(segment: string, id: string): string {
  return `/v1/profiles/me/${segment}/${encodeURIComponent(id)}`;
}

// TODO: просмотр чужого профиля — используется в buildProfileFromPlatform при useMeEndpoint=false.
export async function fetchProfileByUsername(
  username: string,
  accessToken?: string | null,
): Promise<Json> {
  const enc = encodeURIComponent(username);
  return platformGet<Json>(`/v1/profiles/${enc}`, accessToken);
}

export async function fetchProfileMe(accessToken: string): Promise<Json> {
  return integrationGet<Json>("/v1/profiles/me", accessToken);
}

export interface LeetcodeBindPayload {
  username: string;
}

export async function bindLeetcodeAccount(
  accessToken: string,
  body: LeetcodeBindPayload,
): Promise<Json> {
  return integrationPost<Json>(LEETCODE_BIND_PATH, body, accessToken);
}

export interface MonkeytypeBindPayload {
  username: string;
}

export async function bindMonkeytypeAccount(
  accessToken: string,
  body: MonkeytypeBindPayload,
): Promise<Json> {
  return integrationPost<Json>(MONKEYTYPE_BIND_PATH, body, accessToken);
}

export async function unbindLeetcodeIntegration(accessToken: string): Promise<Json> {
  return integrationDelete<Json>(LEETCODE_UNBIND_PATH, accessToken);
}

export async function unbindGithubIntegration(accessToken: string): Promise<Json> {
  return integrationDelete<Json>(GITHUB_UNLINK_PATH, accessToken);
}

export async function unbindMonkeytypeIntegration(accessToken: string): Promise<Json> {
  return integrationDelete<Json>(MONKEYTYPE_UNBIND_PATH, accessToken);
}

export async function uploadProfileAvatar(
  accessToken: string,
  file: File,
): Promise<void> {
  const formData = new FormData();
  formData.append("file", file);
  const raw = await authBackendMultipartPost<unknown>(
    AVATAR_UPLOAD_PATH,
    formData,
    accessToken,
  );
  if (raw != null) {
    parseAvatarUploadResponse(raw);
  }
}

export async function updateProfileFill(
  accessToken: string,
  body: ProfileFillPayload,
): Promise<Json> {
  return integrationPatch<Json>(PROFILE_FILL_PATH, body, accessToken);
}

export async function updateProfileIntro(
  accessToken: string,
  body: ProfileIntroPayload,
): Promise<Json> {
  return integrationPatch<Json>(PROFILE_INTRO_PATH, body, accessToken);
}

export async function updateProfileAbout(
  accessToken: string,
  body: ProfileAboutPayload,
): Promise<Json> {
  return integrationPatch<Json>("/v1/profiles/me/about", body, accessToken);
}

export async function updateProfileContacts(
  accessToken: string,
  body: ProfileContactsPayload,
): Promise<Json> {
  return integrationPatch<Json>("/v1/profiles/me/contacts", body, accessToken);
}

export async function updateProfilePersonal(
  accessToken: string,
  body: ProfilePersonalPayload,
): Promise<Json> {
  return integrationPatch<Json>("/v1/profiles/me/personal", body, accessToken);
}

export async function createProfileCertification(
  accessToken: string,
  body: ProfileCertificationPayload,
): Promise<Json> {
  return integrationPost<Json>("/v1/profiles/me/certifications", body, accessToken);
}

export async function createProfileEducation(
  accessToken: string,
  body: ProfileEducationPayload,
): Promise<Json> {
  return integrationPost<Json>("/v1/profiles/me/educations", body, accessToken);
}

export async function createProfileExperience(
  accessToken: string,
  body: ProfileExperiencePayload,
): Promise<Json> {
  return integrationPost<Json>("/v1/profiles/me/experiences", body, accessToken);
}

export async function createProfileLanguage(
  accessToken: string,
  body: ProfileLanguagePayload,
): Promise<Json> {
  return integrationPost<Json>("/v1/profiles/me/languages", body, accessToken);
}

export async function createProfileSkill(
  accessToken: string,
  body: ProfileSkillPayload,
): Promise<Json> {
  return integrationPost<Json>("/v1/profiles/me/skills", body, accessToken);
}

export async function deleteProfileCertification(
  accessToken: string,
  id: string,
): Promise<void> {
  return authBackendDelete<void>(
    profileMeItemPath("certifications", id),
    accessToken,
  );
}

export async function deleteProfileEducation(
  accessToken: string,
  id: string,
): Promise<void> {
  return authBackendDelete<void>(profileMeItemPath("educations", id), accessToken);
}

export async function deleteProfileExperience(
  accessToken: string,
  id: string,
): Promise<void> {
  return authBackendDelete<void>(profileMeItemPath("experiences", id), accessToken);
}

export async function deleteProfileLanguage(
  accessToken: string,
  id: string,
): Promise<void> {
  return authBackendDelete<void>(profileMeItemPath("languages", id), accessToken);
}

export async function deleteProfileSkill(
  accessToken: string,
  id: string,
): Promise<void> {
  return authBackendDelete<void>(profileMeItemPath("skills", id), accessToken);
}

export async function fetchIntegrationProfile(
  userId: string,
  accessToken?: string | null,
): Promise<Json> {
  const q = new URLSearchParams({ user_id: userId });
  return integrationGet<Json>(`/v1/integration/profile?${q.toString()}`, accessToken);
}

export async function fetchIntegrationCalendar(
  userId: string,
  accessToken?: string | null,
): Promise<Json> {
  const q = new URLSearchParams({ user_id: userId });
  return integrationGet<Json>(`/v1/integration/calendar?${q.toString()}`, accessToken);
}

export async function fetchUserAchievements(
  userId: string,
  accessToken?: string | null,
): Promise<Json> {
  const q = new URLSearchParams({ user_id: userId });
  return integrationGet<Json>(
    `/v1/activity/user/achievement?${q.toString()}`,
    accessToken,
  );
}

export async function fetchUserStreak(
  userId: string,
  accessToken?: string | null,
): Promise<Json> {
  const q = new URLSearchParams({ user_id: userId });
  return integrationGet<Json>(`/v1/activity/streak?${q.toString()}`, accessToken);
}

export async function fetchLeaderboardUser(
  userId: string,
  accessToken?: string | null,
): Promise<Json> {
  const enc = encodeURIComponent(userId);
  return integrationGet<Json>(`/v1/activity/leaderboard/user/${enc}`, accessToken);
}

export interface BuildProfileOptions {
  /** Own profile: GET /v1/profiles/me (backend may not expose /v1/profiles/{username}) */
  useMeEndpoint?: boolean;
}

export async function buildProfileFromPlatform(
  idFromRoute: string,
  accessToken?: string | null,
  options?: BuildProfileOptions,
): Promise<ProfileData> {
  // TODO: просмотр чужого профиля — сейчас грузим только /v1/profiles/me (см. useClientProfileLoader).
  const rawDoc =
    options?.useMeEndpoint && accessToken
      ? await fetchProfileMe(accessToken)
      : await fetchProfileByUsername(idFromRoute, accessToken);
  const doc = unwrapDataPayload(rawDoc) as Json;
  const userId =
    pickUserId(doc) ?? (/^[0-9a-f-]{36}$/i.test(idFromRoute) ? idFromRoute : null);

  let achievements: ProfileAchievement[] = [];
  let heatmapFromCalendar: ProfileHeatmapDay[] = [];

  let integrationJson: Json | null = null;
  let streakJson: Json | null = null;

  if (userId) {
    const [achJson, calJson, integJson, streakRaw] = await Promise.all([
      fetchUserAchievements(userId, accessToken).catch(() => null),
      fetchIntegrationCalendar(userId, accessToken).catch(() => null),
      fetchIntegrationProfile(userId, accessToken).catch(() => null),
      fetchUserStreak(userId, accessToken).catch(() => null),
    ]);
    if (achJson) {
      achievements = mapAchievementsPayload(achJson);
    }
    if (calJson) {
      heatmapFromCalendar = mapCalendarToProfileHeatmap(calJson);
    }
    if (integJson) {
      integrationJson = integJson;
    }
    streakJson = streakRaw;
  }

  let base = mapProfileDocument(doc, idFromRoute, {
    achievements,
    heatmap: heatmapFromCalendar,
  });

  if (integrationJson) {
    base = augmentProfileWithIntegration(base, integrationJson);
  }

  if (userId && streakJson) {
    base = applyActivityStreakToProfile(base, mapStreakPayload(streakJson));
  }

  return base;
}

export async function fetchUserIntegrationStats(userId: string): Promise<{
  github: GithubStats | null;
  leetcode: LeetcodeStats | null;
  monkeytype: MonkeytypeStats | null;
  activity: ActivityDay[] | null;
}> {
  const [profileJson, calJson] = await Promise.all([
    fetchIntegrationProfile(userId, null),
    fetchIntegrationCalendar(userId, null).catch(() => null),
  ]);

  const stats = mapIntegrationProfileToStats(profileJson);
  const fromProfile = mapIntegrationProfileToActivityDays(profileJson);
  const fromCal = calJson ? mapCalendarToActivityDays(calJson) : [];

  const activity =
    fromProfile.length > 0
      ? fromProfile
      : fromCal.length > 0
        ? fromCal
        : null;

  return {
    github: stats.github,
    leetcode: stats.leetcode,
    monkeytype: stats.monkeytype,
    activity,
  };
}

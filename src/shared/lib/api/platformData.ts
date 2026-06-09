import {
  integrationDelete,
  integrationGet,
  integrationMultipartPost,
  integrationPatch,
  integrationPost,
  platformGet,
} from "./platformClient";
import { parseAvatarUploadResponse } from "@/shared/lib/utils/parseAvatarUploadResponse";
import {
  augmentProfileWithIntegration,
  mapAchievementsPayload,
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
  ProfileFillPayload,
  ProfileHeatmapDay,
  ProfileIntroPayload,
  ProfileLanguagePayload,
  ProfilePersonalPayload,
  ProfileSkillPayload,
} from "@/shared/types/profile";
import type { ActivityDay, GithubStats, LeetcodeStats, MonkeytypeStats } from "@/shared/types/stats";

type Json = Record<string, unknown>;

export async function fetchProfileByUsername(username: string): Promise<Json> {
  const enc = encodeURIComponent(username);
  return platformGet<Json>(`/v1/profiles/${enc}`);
}

export async function fetchProfileMe(accessToken: string): Promise<Json> {
  return integrationGet<Json>("/v1/profiles/me", accessToken);
}

export async function uploadProfileAvatar(
  accessToken: string,
  file: File,
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const raw = await integrationMultipartPost<unknown>(
    "/v1/fileservice/upload/avatar",
    formData,
    accessToken,
  );
  return parseAvatarUploadResponse(raw);
}

export async function fillProfileMe(
  accessToken: string,
  body: ProfileFillPayload,
): Promise<Json> {
  return integrationPatch<Json>("/v1/profiles/me/fill", body, accessToken);
}

export async function updateProfileIntro(
  accessToken: string,
  body: ProfileIntroPayload,
): Promise<Json> {
  return integrationPatch<Json>("/v1/profiles/me/intro", body, accessToken);
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
  const enc = encodeURIComponent(id);
  return integrationDelete<void>(`/v1/profiles/me/certifications/${enc}`, accessToken);
}

export async function deleteProfileEducation(
  accessToken: string,
  id: string,
): Promise<void> {
  const enc = encodeURIComponent(id);
  return integrationDelete<void>(`/v1/profiles/me/educations/${enc}`, accessToken);
}

export async function deleteProfileExperience(
  accessToken: string,
  id: string,
): Promise<void> {
  const enc = encodeURIComponent(id);
  return integrationDelete<void>(`/v1/profiles/me/experiences/${enc}`, accessToken);
}

export async function deleteProfileLanguage(
  accessToken: string,
  id: string,
): Promise<void> {
  const enc = encodeURIComponent(id);
  return integrationDelete<void>(`/v1/profiles/me/languages/${enc}`, accessToken);
}

export async function deleteProfileSkill(
  accessToken: string,
  id: string,
): Promise<void> {
  const enc = encodeURIComponent(id);
  return integrationDelete<void>(`/v1/profiles/me/skills/${enc}`, accessToken);
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

export async function fetchLeaderboardUser(
  userId: string,
  accessToken?: string | null,
): Promise<Json> {
  const enc = encodeURIComponent(userId);
  return integrationGet<Json>(`/v1/activity/leaderboard/user/${enc}`, accessToken);
}

export async function buildProfileFromPlatform(idFromRoute: string): Promise<ProfileData> {
  const rawDoc = await fetchProfileByUsername(idFromRoute);
  const doc = unwrapDataPayload(rawDoc) as Json;
  const userId =
    pickUserId(doc) ?? (/^[0-9a-f-]{36}$/i.test(idFromRoute) ? idFromRoute : null);

  let achievements: ProfileAchievement[] = [];
  let heatmapFromCalendar: ProfileHeatmapDay[] = [];

  let integrationJson: Json | null = null;

  if (userId) {
    const [achJson, calJson, integJson] = await Promise.all([
      fetchUserAchievements(userId, null).catch(() => null),
      fetchIntegrationCalendar(userId, null).catch(() => null),
      fetchIntegrationProfile(userId, null).catch(() => null),
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
  }

  let base = mapProfileDocument(doc, idFromRoute, {
    achievements,
    heatmap: heatmapFromCalendar,
  });

  if (integrationJson) {
    base = augmentProfileWithIntegration(base, integrationJson);
  }

  return base;
}

export async function fetchDashboardIntegration(userId: string): Promise<{
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

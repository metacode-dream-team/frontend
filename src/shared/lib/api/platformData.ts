/**
 * Запросы: platform (профили) и integration — за одним API gateway (по умолчанию :8080).
 */

import { integrationGet, platformGet } from "./platformClient";
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
import type { ProfileAchievement, ProfileData, ProfileHeatmapDay } from "@/entities/profile";
import type { ActivityDay, GithubStats, LeetcodeStats, MonkeytypeStats } from "@/entities/stats";

type Json = Record<string, unknown>;

export async function fetchProfileByUsername(username: string): Promise<Json> {
  const enc = encodeURIComponent(username);
  return platformGet<Json>(`/v1/profiles/${enc}`);
}

/** /v1/profiles/me на gateway (тот же базовый URL, что integration, если не вынесли отдельно). */
export async function fetchProfileMe(accessToken: string): Promise<Json> {
  return integrationGet<Json>("/v1/profiles/me", accessToken);
}

export async function fetchIntegrationProfile(userId: string): Promise<Json> {
  const q = new URLSearchParams({ user_id: userId });
  return integrationGet<Json>(`/v1/integration/profile?${q.toString()}`);
}

export async function fetchIntegrationCalendar(userId: string): Promise<Json> {
  const q = new URLSearchParams({ user_id: userId });
  return integrationGet<Json>(`/v1/integration/calendar?${q.toString()}`);
}

export async function fetchUserAchievements(userId: string): Promise<Json> {
  const q = new URLSearchParams({ user_id: userId });
  return integrationGet<Json>(`/v1/activity/user/achievement?${q.toString()}`);
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
      fetchUserAchievements(userId).catch(() => null),
      fetchIntegrationCalendar(userId).catch(() => null),
      fetchIntegrationProfile(userId).catch(() => null),
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
    fetchIntegrationProfile(userId),
    fetchIntegrationCalendar(userId).catch(() => null),
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

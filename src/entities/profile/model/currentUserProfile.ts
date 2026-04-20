/**
 * GET /v1/profiles/me — нормализованная модель (бэкенд отдаёт PascalCase в data).
 */

import { unwrapDataPayload } from "@/shared/lib/api/platformMappers";

type Json = Record<string, unknown>;

function str(v: unknown): string {
  return v == null ? "" : String(v);
}

function optStr(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v);
  return s.length ? s : null;
}

function optNum(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

export interface ExternalProfileLink {
  provider: string;
  username: string | null;
}

export interface CurrentUserProfile {
  id: string;
  userId: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  avatarUrl: string | null;
  about: string | null;
  gender: string | null;
  location: string | null;
  address: string | null;
  birthDate: string | null;
  headline: string | null;
  positionLink: string | null;
  schoolLink: string | null;
  experiences: unknown;
  educations: unknown;
  certifications: unknown;
  skills: unknown;
  languages: unknown;
  contacts: unknown;
  followersCount: number | null;
  followingCount: number | null;
  verifyStatus: string;
  accountStatus: string;
  externalProfileLinks: ExternalProfileLink[];
  profileSettings: Record<string, unknown> | null;
  isComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export function normalizeProfileMe(payload: unknown): CurrentUserProfile {
  const d = unwrapDataPayload(payload) as Json;

  const linksRaw = d.ExternalProfileLinks ?? d.externalProfileLinks;
  const externalProfileLinks: ExternalProfileLink[] = Array.isArray(linksRaw)
    ? linksRaw.map((item) => {
        const o = item as Json;
        return {
          provider: str(o.Provider ?? o.provider),
          username: optStr(o.Username ?? o.username),
        };
      })
    : [];

  const settings = d.ProfileSettings ?? d.profileSettings;

  return {
    id: str(d.ID ?? d.id),
    userId: str(d.UserID ?? d.user_id),
    username: optStr(d.Username ?? d.username),
    firstName: optStr(d.FirstName ?? d.first_name ?? d.firstName),
    lastName: optStr(d.LastName ?? d.last_name ?? d.lastName),
    avatarUrl: optStr(d.AvatarURL ?? d.avatar_url ?? d.avatarUrl),
    about: optStr(d.About ?? d.about),
    gender: optStr(d.Gender ?? d.gender),
    location: optStr(d.Location ?? d.location),
    address: optStr(d.Address ?? d.address),
    birthDate: optStr(d.BirthDate ?? d.birth_date ?? d.birthDate),
    headline: optStr(d.Headline ?? d.headline),
    positionLink: optStr(d.PositionLink ?? d.position_link ?? d.positionLink),
    schoolLink: optStr(d.SchoolLink ?? d.school_link ?? d.schoolLink),
    experiences: d.Experiences ?? d.experiences ?? null,
    educations: d.Educations ?? d.educations ?? null,
    certifications: d.Certifications ?? d.certifications ?? null,
    skills: d.Skills ?? d.skills ?? null,
    languages: d.Languages ?? d.languages ?? null,
    contacts: d.Contacts ?? d.contacts ?? null,
    followersCount: optNum(d.FollowersCount ?? d.followers_count ?? d.followersCount),
    followingCount: optNum(d.FollowingCount ?? d.following_count ?? d.followingCount),
    verifyStatus: str(d.VerifyStatus ?? d.verify_status ?? d.verifyStatus ?? "unknown"),
    accountStatus: str(d.AccountStatus ?? d.account_status ?? d.accountStatus ?? "unknown"),
    externalProfileLinks,
    profileSettings:
      settings && typeof settings === "object" ? (settings as Record<string, unknown>) : null,
    isComplete: Boolean(d.IsComplete ?? d.is_complete ?? d.isComplete),
    createdAt: str(d.CreatedAt ?? d.created_at ?? d.createdAt),
    updatedAt: str(d.UpdatedAt ?? d.updated_at ?? d.updatedAt),
  };
}

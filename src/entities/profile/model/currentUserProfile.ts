import { unwrapDataPayload } from "@/shared/lib/api/platformMappers";

type Json = Record<string, unknown>;

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

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

export function formatMeLocation(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") {
    const t = value.trim();
    return t.length ? t : null;
  }
  if (typeof value !== "object") return null;
  const o = value as Json;
  const city = str(o.City ?? o.city).trim();
  const country = str(o.Country ?? o.country).trim();
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (country) return country;
  return null;
}

export function formatMeBirthDate(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value === "string") {
    const t = value.trim();
    return t.length ? t : null;
  }
  if (typeof value !== "object") return null;
  const o = value as Json;
  const y = o.Year ?? o.year;
  const m = o.Month ?? o.month;
  const day = o.Day ?? o.day;
  const year = Number(y);
  if (!Number.isFinite(year)) return null;
  const month = Number(m);
  const d = day != null ? Number(day) : NaN;
  if (Number.isFinite(month) && month >= 1 && month <= 12 && Number.isFinite(d) && d >= 1 && d <= 31) {
    return `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  if (Number.isFinite(month) && month >= 1 && month <= 12) {
    return `${MONTH_SHORT[month - 1]} ${year}`;
  }
  return String(year);
}

export function formatMeYearMonth(value: unknown): string {
  if (value == null) return "";
  if (typeof value === "string") {
    const t = value.trim();
    return t.length ? t : "";
  }
  if (typeof value !== "object") return "";
  const o = value as Json;
  const y = o.Year ?? o.year;
  const m = o.Month ?? o.month;
  const year = Number(y);
  if (!Number.isFinite(year)) return "";
  const month = Number(m);
  if (!Number.isFinite(month) || month < 1 || month > 12) return String(year);
  return `${MONTH_SHORT[month - 1]} ${year}`;
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
    userId: str(d.UserID ?? d.userId ?? d.user_id),
    username: optStr(d.Username ?? d.username),
    firstName: optStr(d.FirstName ?? d.first_name ?? d.firstName),
    lastName: optStr(d.LastName ?? d.last_name ?? d.lastName),
    avatarUrl: optStr(d.AvatarURL ?? d.avatar_url ?? d.avatarUrl),
    about: optStr(d.About ?? d.about),
    gender: optStr(d.Gender ?? d.gender),
    location: formatMeLocation(d.Location ?? d.location),
    address: optStr(d.Address ?? d.address),
    birthDate: (() => {
      const raw = d.BirthDate ?? d.birth_date ?? d.birthDate;
      return formatMeBirthDate(raw) ?? (typeof raw === "string" ? optStr(raw) : null);
    })(),
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

import { formatMeYearMonth, type CurrentUserProfile } from "./currentUserProfile";
import type { ProfileData, ProfileEducation } from "./types";
import { mapApiCertificationsToProfile } from "@/shared/lib/api/platformMappers";

type MeJson = Record<string, unknown>;

function sid(v: unknown): string {
  return v == null ? "" : String(v);
}

function mapMeEducationsToProfile(raw: unknown): ProfileEducation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, i) => {
    const o = item as MeJson;
    return {
      id: sid(o.ID ?? o.id) || `ed-me-${i}`,
      school: sid(o.School ?? o.school),
      degree: sid(o.Degree ?? o.degree),
      start: formatMeYearMonth(o.StartDate ?? o.start_date ?? o.startDate) || "—",
      end: formatMeYearMonth(o.EndDate ?? o.end_date ?? o.endDate) || "Present",
      gpa: (() => {
        const g = sid(o.Grade ?? o.gpa ?? o.grade).trim();
        return g || undefined;
      })(),
      specialization: (() => {
        const s = sid(o.FieldOfStudy ?? o.field_of_study ?? o.fieldOfStudy).trim();
        return s || undefined;
      })(),
    };
  });
}

function mapMeSkillsToTechSkills(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      const o = item as MeJson;
      return sid(o.Name ?? o.name).trim();
    })
    .filter((s) => s.length > 0);
}

export function isProfileRouteCurrentUser(
  routeUsername: string,
  me: CurrentUserProfile | null,
): boolean {
  if (!me) return false;
  const r = routeUsername.trim();
  if (!r) return false;
  const ru = r.toLowerCase();
  const un = me.username?.trim().toLowerCase();
  if (un && un === ru) return true;
  if (me.userId?.toLowerCase() === ru) return true;
  if (me.id?.toLowerCase() === ru) return true;
  return false;
}

export function mergeProfileWithMe(
  base: ProfileData,
  me: CurrentUserProfile | null,
  routeUsername: string,
): ProfileData {
  if (!me || !isProfileRouteCurrentUser(routeUsername, me)) {
    return base;
  }

  const first = me.firstName?.trim() ?? "";
  const last = me.lastName?.trim() ?? "";
  const fullName =
    [first, last].filter(Boolean).join(" ").trim() ||
    me.username?.trim() ||
    base.fullName;

  const avatar = me.avatarUrl?.trim();
  const username = me.username?.trim() || base.username;
  const fromMeEducation = mapMeEducationsToProfile(me.educations);
  const fromMeCertifications = mapApiCertificationsToProfile(me.certifications);
  const fromMeTechSkills = mapMeSkillsToTechSkills(me.skills);
  const about = me.about?.trim();

  return {
    ...base,
    username,
    fullName,
    avatarUrl: avatar || base.avatarUrl,
    location: me.location?.trim() || base.location,
    role: me.headline?.trim() || base.role,
    ...(about ? { about } : {}),
    education: fromMeEducation.length > 0 ? fromMeEducation : base.education,
    certifications: fromMeCertifications.length > 0 ? fromMeCertifications : base.certifications,
    techSkills: fromMeTechSkills.length > 0 ? fromMeTechSkills : base.techSkills,
    following: me.followingCount ?? base.following,
    followers: me.followersCount ?? base.followers,
  };
}

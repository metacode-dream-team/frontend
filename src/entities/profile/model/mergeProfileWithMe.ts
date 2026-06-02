import {
  formatMeLocation,
  formatMeYearMonth,
  type CurrentUserProfile,
} from "./currentUserProfile";
import type {
  ProfileContacts,
  ProfileData,
  ProfileEducation,
  ProfileExperience,
} from "./types";
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

function toWorkMode(raw: unknown): ProfileExperience["workMode"] {
  const value = sid(raw).trim().toLowerCase();
  if (value === "hybrid") return "Hybrid";
  if (value === "onsite" || value === "on-site") return "On-site";
  return "Remote";
}

function toEmploymentType(raw: unknown): string {
  const value = sid(raw).trim();
  if (!value) return "Full-time";
  return value
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function mapMeExperiencesToProfile(raw: unknown): ProfileExperience[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, i) => {
      const o = item as MeJson;
      const endRaw = o.EndDate ?? o.end_date ?? o.endDate;
      const isCurrent = Boolean(o.IsCurrent ?? o.is_current ?? o.isCurrent);
      const end = isCurrent
        ? "Present"
        : formatMeYearMonth(endRaw) || "Present";
      const location = formatMeLocation(o.Location ?? o.location) ?? "";
      const description = sid(o.Description ?? o.description).trim();
      return {
        id: sid(o.ID ?? o.id) || `exp-me-${i}`,
        title: sid(o.Title ?? o.title).trim() || "Role",
        company: sid(o.Company ?? o.company).trim(),
        employmentType: toEmploymentType(
          o.EmploymentType ?? o.employment_type ?? o.employmentType,
        ),
        workMode: toWorkMode(
          o.LocationType ?? o.location_type ?? o.locationType,
        ),
        location,
        start:
          formatMeYearMonth(o.StartDate ?? o.start_date ?? o.startDate) || "—",
        end,
        description: description || undefined,
      };
    })
    .filter((item) => item.title.length > 0);
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

function mapMeContactsToProfile(raw: unknown): ProfileContacts | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as MeJson;
  const email = sid(o.Email ?? o.email).trim();
  const phoneRaw = o.Phone ?? o.phone;
  const phone =
    phoneRaw && typeof phoneRaw === "object"
      ? sid((phoneRaw as MeJson).Value ?? (phoneRaw as MeJson).value).trim()
      : sid(phoneRaw).trim();
  const websitesRaw = o.Websites ?? o.websites;
  const websites = Array.isArray(websitesRaw)
    ? websitesRaw
        .map((item) => {
          const w = item as MeJson;
          const url = sid(w.URL ?? w.url).trim();
          if (!url) return null;
          return {
            type: sid(w.Type ?? w.type).trim() || "website",
            url,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
    : [];

  if (!email && !phone && websites.length === 0) {
    return null;
  }

  return {
    email: email || undefined,
    phone: phone || undefined,
    websites,
  };
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
  const fromMeExperience = mapMeExperiencesToProfile(me.experiences);
  const fromMeEducation = mapMeEducationsToProfile(me.educations);
  const fromMeCertifications = mapApiCertificationsToProfile(me.certifications);
  const fromMeTechSkills = mapMeSkillsToTechSkills(me.skills);
  const fromMeContacts = mapMeContactsToProfile(me.contacts);
  const about = me.about?.trim();

  return {
    ...base,
    username,
    fullName,
    avatarUrl: avatar || base.avatarUrl,
    location: me.location?.trim() || base.location,
    role: me.headline?.trim() || base.role,
    ...(about ? { about } : {}),
    ...(fromMeContacts ? { contacts: fromMeContacts } : {}),
    experience: fromMeExperience.length > 0 ? fromMeExperience : base.experience,
    education: fromMeEducation.length > 0 ? fromMeEducation : base.education,
    certifications: fromMeCertifications.length > 0 ? fromMeCertifications : base.certifications,
    techSkills: fromMeTechSkills.length > 0 ? fromMeTechSkills : base.techSkills,
    following: me.followingCount ?? 0,
    followers: me.followersCount ?? 0,
  };
}

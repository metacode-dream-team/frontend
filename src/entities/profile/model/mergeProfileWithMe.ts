import {
  formatMeLocation,
  formatMeYearMonth,
  type CurrentUserProfile,
} from "./currentUserProfile";
import type {
  ProfileContacts,
  ProfileContactPhone,
  ProfileData,
  ProfileEducation,
  ProfileExperience,
  ProfilePersonal,
  ProfileSpokenLanguage,
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

function mapMeSkillsToTechSkills(raw: unknown): ProfileData["techSkills"] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, i) => {
      const o = item as MeJson;
      const name = sid(o.Name ?? o.name).trim();
      if (!name) return null;
      return {
        id: sid(o.ID ?? o.id) || `skill-me-${i}`,
        name,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

function mapMePhoneToProfile(raw: unknown): ProfileContactPhone | undefined {
  if (!raw) return undefined;
  if (typeof raw === "object") {
    const o = raw as MeJson;
    const value = sid(o.Value ?? o.value).trim();
    if (!value) return undefined;
    return {
      type: sid(o.Type ?? o.type).trim() || "mobile",
      value,
    };
  }
  const value = sid(raw).trim();
  if (!value) return undefined;
  return { type: "mobile", value };
}

function mapMeContactsToProfile(raw: unknown): ProfileContacts | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as MeJson;
  const email = sid(o.Email ?? o.email).trim();
  const phone = mapMePhoneToProfile(o.Phone ?? o.phone);
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

  if (!email && !phone?.value && websites.length === 0) {
    return null;
  }

  return {
    email: email || undefined,
    phone,
    websites,
  };
}

function preferMeList<T>(meRaw: unknown, mapped: T[], fallback: T[]): T[] {
  return Array.isArray(meRaw) ? mapped : fallback;
}

function mapMeLanguagesToProfile(raw: unknown): ProfileSpokenLanguage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, i) => {
      const o = item as MeJson;
      const code = sid(o.Code ?? o.code).trim().toLowerCase();
      const level = sid(o.Level ?? o.level).trim().toLowerCase();
      if (!code || !level) return null;
      return {
        id: sid(o.ID ?? o.id) || `lang-me-${i}`,
        code,
        level,
      };
    })
    .filter((item): item is ProfileSpokenLanguage => item !== null);
}

function mapMePersonalToProfile(me: CurrentUserProfile): ProfilePersonal | null {
  const address = me.address?.trim();
  const gender = me.gender?.trim();
  const birthDate = me.birthDateParts ?? undefined;

  if (!address && !gender && !birthDate) {
    return null;
  }

  return {
    address: address || undefined,
    gender: gender || undefined,
    birthDate,
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
  const fromMePersonal = mapMePersonalToProfile(me);
  const fromMeLanguages = mapMeLanguagesToProfile(me.languages);

  return {
    ...base,
    username,
    fullName,
    avatarUrl: avatar || base.avatarUrl,
    location: me.location?.trim() || base.location,
    role: me.headline?.trim() || base.role,
    about: me.about?.trim() || undefined,
    contacts: fromMeContacts ?? undefined,
    personal: fromMePersonal ?? undefined,
    experience: preferMeList(me.experiences, fromMeExperience, base.experience),
    education: preferMeList(me.educations, fromMeEducation, base.education),
    certifications: preferMeList(
      me.certifications,
      fromMeCertifications,
      base.certifications,
    ),
    techSkills: preferMeList(me.skills, fromMeTechSkills, base.techSkills),
    spokenLanguages: preferMeList(me.languages, fromMeLanguages, base.spokenLanguages),
    following: me.followingCount ?? 0,
    followers: me.followersCount ?? 0,
  };
}

import type { ActivitySource } from "./stats";

export interface SkillGroup {
  level: "Fundamental" | "Intermediate" | "Advanced";
  items: Array<{
    name: string;
    count: number;
  }>;
}

export interface ProfileHeatmapDay {
  date: string;
  count: number;
}

export type HeatmapSourceTab = "all" | ActivitySource;

export interface ProfileHeatmapBySource {
  combinedMax: ProfileHeatmapDay[];
  github: ProfileHeatmapDay[];
  leetcode: ProfileHeatmapDay[];
  monkeytype: ProfileHeatmapDay[];
}

export type ProfileWorkMode = "Remote" | "Hybrid" | "On-site";

export interface ProfileExperience {
  id: string;
  title: string;
  company: string;
  employmentType: string;
  workMode: ProfileWorkMode;
  location: string;
  start: string;
  end: string;
  description?: string;
}

export interface ProfileEducation {
  id: string;
  school: string;
  degree: string;
  start: string;
  end: string;
  gpa?: string;
  specialization?: string;
  logoUrl?: string;
}

export interface ProfileCertification {
  id: string;
  title: string;
  issuer: string;
  issued: string;
  expires?: string;
  credentialUrl?: string;
  provider: "aws" | "huawei" | "google" | "other";
}

export interface ProfileSpokenLanguage {
  id: string;
  code: string;
  level: string;
}

export interface ProfileTechSkill {
  id: string;
  name: string;
}

export interface ProfileAchievement {
  id: string;
  title: string;
  description: string;
  iconUrl?: string;
  tone: "emerald" | "amber" | "violet";
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ProfileContactWebsite {
  type: string;
  url: string;
}

export interface ProfileContactPhone {
  type: string;
  value: string;
}

export interface ProfileBirthDate {
  year: number;
  month: number;
  day: number;
}

export interface ProfileContacts {
  email?: string;
  phone?: ProfileContactPhone;
  websites: ProfileContactWebsite[];
}

export interface ProfilePersonal {
  address?: string;
  birthDate?: ProfileBirthDate;
  gender?: string;
}

import type { ActivityStreak } from "./streak";

export interface ProfileVisibility {
  isOwner: boolean;
  isAccessible: boolean;
  isPrivate: boolean;
  followStatus: string;
  profileVisibility: string;
  canSeeBirthDate: boolean;
  canSeeContacts: boolean;
  canSeeLocation: boolean;
  canSeeIntegrations: boolean;
}

export interface ProfileData {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  about?: string;
  rank: number;
  role: string;
  location: string;
  following: number;
  followers: number;
  solved: number;
  totalProblems: number;
  attempting: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  achievements: ProfileAchievement[];
  currentStreak: number;
  maxStreak: number;
  /** Серия из `/v1/activity/streak` (GitHub + LeetCode + Monkeytype) */
  activityStreak?: ActivityStreak;
  contacts?: ProfileContacts;
  personal?: ProfilePersonal;
  spokenLanguages: ProfileSpokenLanguage[];
  languages: Array<{ name: string; solved: number }>;
  skills: SkillGroup[];
  heatmap: ProfileHeatmapDay[];
  heatmapBySource?: ProfileHeatmapBySource;
  experience: ProfileExperience[];
  education: ProfileEducation[];
  certifications: ProfileCertification[];
  techSkills: ProfileTechSkill[];
  visibility?: ProfileVisibility;
}

export interface ProfileIntroPayload {
  username?: string;
  first_name: string;
  last_name: string;
  headline: string;
  position_link?: string;
  school_link?: string;
  country: string;
  city: string;
}

export interface ProfileFillPayload {
  username: string;
  first_name: string;
  last_name: string;
  headline: string;
  country: string;
  city: string;
}

export interface ProfileAboutPayload {
  about: string;
}

export interface ProfileContactsPayload {
  email?: string;
  phone?: { type: string; value: string };
  websites: { type: string; url: string }[];
}

export interface ProfilePersonalPayload {
  address?: string;
  birth_date?: { year: number; month: number; day: number };
  gender?: string;
}

export interface ProfileYearMonth {
  year: number;
  month: number;
}

export interface ProfileCertificationPayload {
  name: string;
  issuer: string;
  issue_date: ProfileYearMonth;
  expire_date?: ProfileYearMonth;
  credential_url?: string;
}

export interface ProfileEducationPayload {
  school: string;
  degree: string;
  field_of_study?: string;
  start_date: ProfileYearMonth;
  end_date?: ProfileYearMonth;
  grade?: string;
  description?: string;
}

export interface ProfileExperienceLocationPayload {
  country: string;
  city: string;
}

export interface ProfileLanguagePayload {
  code: string;
  level: string;
}

export interface ProfileSkillPayload {
  name: string;
}

export interface ProfileExperiencePayload {
  title: string;
  employment_type: string;
  company: string;
  start_date: ProfileYearMonth;
  end_date?: ProfileYearMonth;
  is_current: boolean;
  location: ProfileExperienceLocationPayload;
  location_type: string;
  description?: string;
  profile_headline?: string;
}

import type { ActivitySource } from "@/shared/types/stats";

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

/** Диапазон теплокарты: текущий календарный год или скользящий год / вся история */
export type HeatmapRangeTab = "current" | "year";

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

import type { ActivityStreak } from "@/shared/types/streak";

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
  activityStreak?: ActivityStreak;
  contacts?: ProfileContacts;
  personal?: ProfilePersonal;
  spokenLanguages: ProfileSpokenLanguage[];
  languages: Array<{ name: string; solved: number }>;
  skills: SkillGroup[];
  heatmap: ProfileHeatmapDay[];
  /** Из `/v1/integration/profile`: max по дням + разбивка по GitHub / LeetCode / Monkeytype */
  heatmapBySource?: ProfileHeatmapBySource;
  experience: ProfileExperience[];
  education: ProfileEducation[];
  certifications: ProfileCertification[];
  techSkills: ProfileTechSkill[];
}

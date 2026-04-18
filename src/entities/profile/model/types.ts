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
  provider: "aws" | "huawei" | "google" | "other";
}

export interface ProfileAchievement {
  id: string;
  title: string;
  description: string;
  tone: "emerald" | "amber" | "violet";
  unlocked: boolean;
  unlockedAt?: string;
}

export interface ProfileData {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
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
  languages: Array<{ name: string; solved: number }>;
  skills: SkillGroup[];
  heatmap: ProfileHeatmapDay[];
  experience: ProfileExperience[];
  education: ProfileEducation[];
  certifications: ProfileCertification[];
  techSkills: string[];
}

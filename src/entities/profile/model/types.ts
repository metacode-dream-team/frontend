export interface CommunityStat {
  label: string;
  value: number;
  lastWeek: number;
}

export interface SkillGroup {
  level: "Fundamental" | "Intermediate" | "Advanced";
  items: Array<{
    name: string;
    count: number;
  }>;
}

export interface RecentSubmission {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  solvedAt: string;
}

export interface ProfileHeatmapDay {
  date: string;
  count: number;
}

export interface ProfileData {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  rank: number;
  following: number;
  followers: number;
  solved: number;
  totalProblems: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
  badges: number;
  currentStreak: number;
  maxStreak: number;
  communityStats: CommunityStat[];
  languages: Array<{ name: string; solved: number }>;
  skills: SkillGroup[];
  heatmap: ProfileHeatmapDay[];
  recentSubmissions: RecentSubmission[];
}

export type ActivitySource = "github" | "leetcode" | "monkeytype";

export interface ActivityDay {
  date: string;
  count: number;
  source: ActivitySource;
}

export interface GithubStats {
  commitsThisYear: number;
}

export interface LeetcodeStats {
  easy: number;
  medium: number;
  hard: number;
}

export interface MonkeytypeRecord {
  mode: "time" | "words";
  value: string;
  wpm: number;
  accuracy: number;
}

export interface MonkeytypeStats {
  records: MonkeytypeRecord[];
}

export interface RoadmapProgressSummary {
  title: string;
  progressPercent: number;
}

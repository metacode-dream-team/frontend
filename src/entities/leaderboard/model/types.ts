/**
 * Типы для Leaderboard
 */

export interface LeaderboardUser {
  id: string;
  rank: number;
  username: string;
  avatarUrl: string;
  githubCommits: number; // за текущий год
  leetcodeSolved: number; // total
  monkeytypeRecord: number; // wpm
  isCurrentUser: boolean;
}

export interface LeaderboardResponse {
  users: LeaderboardUser[];
  hasMore: boolean;
  currentUserRank?: number;
  currentUser?: LeaderboardUser;
}


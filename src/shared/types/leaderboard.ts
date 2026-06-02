export interface LeaderboardUser {
  id: string;
  rank: number;
  username: string;
  avatarUrl: string;
  githubCommits: number;
  leetcodeSolved: number;
  monkeytypeRecord: number;
  isCurrentUser: boolean;
}

export interface LeaderboardResponse {
  users: LeaderboardUser[];
  hasMore: boolean;
  currentUserRank?: number;
  currentUser?: LeaderboardUser;
}

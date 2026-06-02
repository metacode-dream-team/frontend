import type { LeaderboardResponse } from "@/shared/types/leaderboard";
import { integrationGet } from "./platformClient";
import { mapGlobalLeaderboardPayload } from "./leaderboardMappers";

export async function fetchGlobalLeaderboard(
  accessToken?: string | null,
): Promise<unknown> {
  return integrationGet<unknown>(
    "/v1/activity/leaderboard/global",
    accessToken,
  );
}

/**
 * Глобальный рейтинг (без пагинации — API отдаёт полный отсортированный список).
 */
export async function getLeaderboard(
  _page: number = 0,
  _limit: number = 20,
  _currentUserRank: number | null = null,
  accessToken?: string | null,
  currentUserId?: string | null,
): Promise<LeaderboardResponse> {
  const raw = await fetchGlobalLeaderboard(accessToken);
  const users = mapGlobalLeaderboardPayload(raw, currentUserId);

  const currentUser = users.find((u) => u.isCurrentUser);
  const currentUserRank = currentUser?.rank ?? undefined;

  return {
    users,
    hasMore: false,
    currentUserRank,
    currentUser,
  };
}

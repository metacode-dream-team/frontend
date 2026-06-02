/**
 * Хук для загрузки глобального leaderboard
 */

import { useEffect } from "react";
import { useAuthStore } from "@/entities/auth";
import { useLeaderboardStore } from "@/entities/leaderboard";
import { useProfileMeStore } from "@/entities/profile";
import { getLeaderboard } from "@/shared/lib/api/leaderboardApi";
import type { LeaderboardUser } from "@/shared/types/leaderboard";

export function useFetchLeaderboard() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const profileMe = useProfileMeStore((s) => s.profile);
  const currentUserId = profileMe?.userId ?? null;

  const {
    users,
    isLoading,
    hasMore,
    currentUserRank,
    currentUser,
    setUsers,
    setIsLoading,
    setHasMore,
    setCurrentUserRank,
    setCurrentUser,
    reset,
  } = useLeaderboardStore();

  useEffect(() => {
    void loadLeaderboard();
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, currentUserId]);

  const loadLeaderboard = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await getLeaderboard(
        0,
        20,
        null,
        accessToken,
        currentUserId,
      );
      setUsers(response.users);
      setHasMore(false);
      setCurrentUserRank(response.currentUserRank ?? null);
      setCurrentUser(response.currentUser ?? null);
    } catch (error) {
      console.error("[Leaderboard] Failed to load:", error);
      setUsers([]);
      setHasMore(false);
      setCurrentUserRank(null);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNextPage = () => {
    if (!hasMore || isLoading) return;
  };

  const topThree = users.filter((u) => u.rank <= 3);
  const podiumDisplayOrder = buildPodiumDisplayOrder(topThree);
  const tableUsers = users.filter((u) => u.rank > 3);

  return {
    users,
    topThree,
    podiumDisplayOrder,
    tableUsers,
    currentUserRank,
    currentUser,
    isLoading,
    hasMore,
    loadNextPage,
    reset,
  };
}

/** Визуальный порядок подиума: 2 — 1 — 3 */
export function buildPodiumDisplayOrder(
  topThree: LeaderboardUser[],
): LeaderboardUser[] {
  const byRank = new Map(topThree.map((u) => [u.rank, u]));
  return [2, 1, 3]
    .map((rank) => byRank.get(rank))
    .filter((u): u is LeaderboardUser => u != null);
}

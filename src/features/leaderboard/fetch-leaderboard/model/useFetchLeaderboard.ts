/**
 * Хук для загрузки данных leaderboard
 */

import { useEffect } from "react";
import { useLeaderboardStore } from "@/entities/leaderboard";
import { getLeaderboard } from "@/shared/lib/api/leaderboardApi";

const LIMIT = 20;

export function useFetchLeaderboard() {
  const {
    users,
    currentPage,
    hasMore,
    isLoading,
    currentUserRank,
    currentUser,
    setUsers,
    appendUsers,
    setCurrentPage,
    setHasMore,
    setIsLoading,
    setCurrentUserRank,
    setCurrentUser,
    reset,
  } = useLeaderboardStore();

  // Загрузка первой страницы при монтировании
  useEffect(() => {
    loadPage(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPage = async (page: number) => {
    if (isLoading || (!hasMore && page > 0)) {
      return;
    }

    setIsLoading(true);

    try {
      // При первой загрузке используем null, чтобы API сам установил ранг
      // При последующих загрузках используем сохраненный ранг
      const userRankForRequest = page === 0 ? null : currentUserRank;

      const response = await getLeaderboard(page, LIMIT, userRankForRequest);

      if (page === 0) {
        setUsers(response.users);
      } else {
        appendUsers(response.users);
      }

      setHasMore(response.hasMore);
      setCurrentPage(page);

      // Устанавливаем данные текущего пользователя, если они есть
      if (response.currentUserRank !== undefined) {
        setCurrentUserRank(response.currentUserRank);
      }
      if (response.currentUser) {
        setCurrentUser(response.currentUser);
      }
    } catch (error) {
      console.error("[Leaderboard] Failed to load page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNextPage = () => {
    if (hasMore && !isLoading) {
      loadPage(currentPage + 1);
    }
  };

  return {
    users,
    currentUserRank,
    currentUser,
    isLoading,
    hasMore,
    loadNextPage,
    reset,
  };
}


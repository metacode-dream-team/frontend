/**
 * Страница Leaderboard
 */

"use client";

import { useFetchLeaderboard } from "@/features/leaderboard/fetch-leaderboard";
import { InfiniteScrollTrigger } from "@/features/leaderboard/infinite-scroll";
import { LeaderboardTable } from "@/widgets/leaderboard-table";
import { CurrentUserBanner } from "@/widgets/current-user-banner";
import { TopPlayersCards } from "@/widgets/top-players";
import { cn } from "@/shared/lib/utils/cn";
import { useState } from "react";

export default function LeaderboardPage() {
  const {
    users,
    currentUser,
    currentUserRank,
    isLoading,
    hasMore,
    loadNextPage,
  } = useFetchLeaderboard();

  const [activeFilter, setActiveFilter] = useState<"all" | "24h" | "7d" | "30d">("all");

  // Получаем топ-3 игроков
  const topThree = users.filter((user) => user.rank <= 3);
  // Остальные пользователи (начиная с 4-го места)
  const restUsers = users.filter((user) => user.rank > 3);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Заголовок */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Leaderboard</h1>
          <p className="text-gray-400 text-sm">
            Глобальный рейтинг программистов по достижениям
          </p>
        </div>

        {/* Фильтры */}
        <div className="mb-6 flex items-center gap-4 flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveFilter("all")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeFilter === "all"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700",
              )}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter("24h")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeFilter === "24h"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700",
              )}
            >
              24h
            </button>
            <button
              onClick={() => setActiveFilter("7d")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeFilter === "7d"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700",
              )}
            >
              7D
            </button>
            <button
              onClick={() => setActiveFilter("30d")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                activeFilter === "30d"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700",
              )}
            >
              30D
            </button>
          </div>
          <div className="ml-auto">
            <button className="px-4 py-2 text-sm font-medium bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
              Show my place
            </button>
          </div>
        </div>

        {/* Топ-3 игроков */}
        {topThree.length > 0 && (
          <div className="mb-8">
            <TopPlayersCards topThree={topThree} />
          </div>
        )}

        {/* Таблица рейтинга */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
          <LeaderboardTable users={restUsers} isLoading={isLoading && restUsers.length === 0} />
        </div>

        {/* Триггер бесконечного скролла */}
        <InfiniteScrollTrigger
          onLoadMore={loadNextPage}
          hasMore={hasMore}
          isLoading={isLoading}
        />

        {/* Баннер текущего пользователя (sticky) */}
        <CurrentUserBanner
          currentUser={currentUser}
          currentUserRank={currentUserRank}
          visibleUsers={users}
        />
      </div>
    </div>
  );
}


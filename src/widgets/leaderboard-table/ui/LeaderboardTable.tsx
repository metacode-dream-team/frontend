/**
 * Таблица рейтинга пользователей
 */

import { Avatar } from "@/shared/ui/Avatar";
import { Skeleton } from "@/shared/ui/Skeleton";
import { cn } from "@/shared/lib/utils/cn";
import type { LeaderboardUser } from "@/entities/leaderboard";
import Image from "next/image";
import leetcodeIcon from "@/assets/Leetcode--Streamline-Simple-Icons (2).png";

interface LeaderboardTableProps {
  users: LeaderboardUser[];
  isLoading: boolean;
}

export function LeaderboardTable({
  users,
  isLoading,
}: LeaderboardTableProps) {
  if (!isLoading && users.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🏆</div>
        <p className="text-gray-400 text-lg font-medium">
          Рейтинг пуст
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Будьте первым в рейтинге!
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Place
            </th>
            <th className="text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Player name
            </th>
            <th className="text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden md:table-cell">
              <div className="flex items-center gap-2">
                <GitHubIcon className="w-5 h-5 text-gray-400" />
                <span>Commits</span>
              </div>
            </th>
            <th className="text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400 hidden lg:table-cell">
              <div className="flex items-center gap-2">
                <Image
                  src={leetcodeIcon}
                  alt="LeetCode"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>LeetCode</span>
              </div>
            </th>
            <th className="text-left py-4 px-4 text-xs font-semibold uppercase tracking-wider text-gray-400">
              <div className="flex items-center gap-2">
                <WPMIcon className="w-5 h-5 text-gray-400" />
                <span>WPM</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading && users.length === 0 ? (
            // Показываем 10 скелетонов при первой загрузке
            <>
              {Array.from({ length: 10 }).map((_, index) => (
                <LeaderboardRowSkeleton key={index} index={index} />
              ))}
            </>
          ) : (
            <>
              {users.map((user, index) => (
                <LeaderboardRow key={user.id} user={user} index={index} />
              ))}
              {isLoading && users.length > 0 && (
                <>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <LeaderboardRowSkeleton key={`loading-${index}`} index={users.length + index} />
                  ))}
                </>
              )}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

function LeaderboardRow({ user, index }: { user: LeaderboardUser; index: number }) {
  const isTopThree = user.rank <= 3;

  return (
    <tr
      className={cn(
        "border-b border-gray-800 hover:bg-gray-800/30 transition-colors group",
        user.isCurrentUser && "bg-purple-900/20",
      )}
      style={{
        animationDelay: `${index * 30}ms`,
        animation: "fadeInUp 0.4s ease-out forwards",
        opacity: 0,
      }}
    >
      {/* Place */}
      <td className="py-3 px-4">
        <span className="text-sm font-medium text-gray-400">
          {user.rank}
        </span>
      </td>

      {/* Player name */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <Avatar src={user.avatarUrl} alt={user.username} size="sm" />
          <span
            className={cn(
              "text-sm font-medium",
              user.isCurrentUser ? "text-purple-400" : "text-gray-200",
            )}
          >
            {user.username}
            {user.isCurrentUser && (
              <span className="ml-2 text-xs text-purple-500">(Вы)</span>
            )}
          </span>
        </div>
      </td>

      {/* GitHub */}
      <td className="py-3 px-4 hidden md:table-cell">
        <div className="flex items-center gap-2">
          <GitHubIcon className="w-5 h-5 text-gray-500" />
          <span className="text-sm text-gray-400">
            {user.githubCommits.toLocaleString()}
          </span>
        </div>
      </td>

      {/* LeetCode */}
      <td className="py-3 px-4 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <Image
            src={leetcodeIcon}
            alt="LeetCode"
            width={20}
            height={20}
            className="w-5 h-5"
          />
          <span className="text-sm text-gray-400">
            {user.leetcodeSolved}
          </span>
        </div>
      </td>

      {/* WPM */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <WPMIcon className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-300">
            {user.monkeytypeRecord}
          </span>
        </div>
      </td>
    </tr>
  );
}

// Официальная иконка GitHub (однотонная)
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

// Иконка молнии для WPM (однотонная)
function WPMIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M13 1l-12 12h8l-1 8 12-12h-8l1-8z" />
    </svg>
  );
}


function LeaderboardRowSkeleton({ index }: { index: number }) {
  return (
    <tr
      className="border-b border-gray-800"
      style={{
        animationDelay: `${index * 30}ms`,
        animation: "fadeInUp 0.4s ease-out forwards",
        opacity: 0,
      }}
    >
      <td className="py-3 px-4">
        <Skeleton className="h-4 w-8" />
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <Skeleton variant="circular" className="w-8 h-8" />
          <Skeleton className="h-4 w-24" />
        </div>
      </td>
      <td className="py-3 px-4 hidden md:table-cell">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-16" />
        </div>
      </td>
      <td className="py-3 px-4 hidden lg:table-cell">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-12" />
        </div>
      </td>
      <td className="py-3 px-4">
        <Skeleton className="h-4 w-12" />
      </td>
    </tr>
  );
}


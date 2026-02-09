/**
 * Липкий баннер с позицией текущего пользователя
 * Показывается, если пользователь не в видимой части списка
 */

import Image from "next/image";
import { Avatar } from "@/shared/ui/Avatar";
import { cn } from "@/shared/lib/utils/cn";
import type { LeaderboardUser } from "@/entities/leaderboard";
import leetcodeIcon from "@/assets/Leetcode--Streamline-Simple-Icons (2).png";

interface CurrentUserBannerProps {
  currentUser: LeaderboardUser | null;
  currentUserRank: number | null;
  visibleUsers: LeaderboardUser[];
}

export function CurrentUserBanner({
  currentUser,
  currentUserRank,
  visibleUsers,
}: CurrentUserBannerProps) {
  // Проверяем, находится ли текущий пользователь в видимом списке
  const isUserVisible = visibleUsers.some((user) => user.isCurrentUser);

  // Если пользователь виден в списке или нет данных о пользователе - не показываем баннер
  if (isUserVisible || !currentUser || currentUserRank === null) {
    return null;
  }

  return (
    <div className="sticky bottom-0 z-10 animate-slideUp">
      <div className="bg-gradient-to-r from-purple-900/95 via-pink-900/95 to-purple-900/95 backdrop-blur-xl border-t-2 border-purple-500/50 shadow-2xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-lg opacity-50 animate-pulse" />
                <Avatar src={currentUser.avatarUrl} alt={currentUser.username} size="lg" className="relative ring-2 ring-pink-500/50" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                    {currentUser.username}
                  </span>
                  <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full">
                    ВЫ
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-300">Ваша позиция:</span>
                  <span className="px-3 py-1 text-sm font-bold bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                    #{currentUserRank}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700">
                <GitHubIcon className="w-5 h-5 text-gray-400" />
                <span className="text-gray-400">Commits:</span>
                <span className="text-gray-200 font-semibold">{currentUser.githubCommits.toLocaleString()}</span>
              </div>
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700">
                <Image
                  src={leetcodeIcon}
                  alt="LeetCode"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span className="text-gray-400">LeetCode:</span>
                <span className="text-gray-200 font-semibold">{currentUser.leetcodeSolved}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-lg border border-gray-700">
                <WPMIcon className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">WPM:</span>
                <span className="text-gray-200 font-bold">
                  {currentUser.monkeytypeRecord}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}      </style>
    </div>
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


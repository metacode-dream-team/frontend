/**
 * Карточки топ-3 игроков
 */

import React from "react";
import Image from "next/image";
import { Avatar } from "@/shared/ui/Avatar";
import { cn } from "@/shared/lib/utils/cn";
import type { LeaderboardUser } from "@/entities/leaderboard";
import leetcodeIcon from "@/assets/Leetcode--Streamline-Simple-Icons (2).png";

interface TopPlayersCardsProps {
  topThree: LeaderboardUser[];
}

export function TopPlayersCards({ topThree }: TopPlayersCardsProps) {
  if (topThree.length === 0) {
    return null;
  }

  const trophyColors = [
    "text-yellow-400", // Gold
    "text-gray-300", // Silver
    "text-orange-600", // Bronze
  ];

  const cardStyles = [
    "border-yellow-500/30 bg-gradient-to-br from-yellow-900/20 to-yellow-800/10",
    "border-gray-400/30 bg-gradient-to-br from-gray-800/20 to-gray-700/10",
    "border-orange-600/30 bg-gradient-to-br from-orange-900/20 to-orange-800/10",
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {topThree.map((player, index) => {
        const position = index + 1;
        const isFirst = position === 1;

        return (
          <div
            key={player.id}
            className={cn(
              "relative rounded-xl border-2 p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl",
              cardStyles[index],
              isFirst && "md:order-2", // Первое место в центре
              position === 2 && "md:order-1", // Второе место слева
              position === 3 && "md:order-3", // Третье место справа
            )}
          >
            {/* Ранг */}
            <div className="absolute top-4 right-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center font-black text-lg border-2",
                  position === 1 && "bg-gradient-to-br from-yellow-400 to-yellow-600 border-yellow-300 text-black",
                  position === 2 && "bg-gradient-to-br from-gray-300 to-gray-500 border-gray-200 text-black",
                  position === 3 && "bg-gradient-to-br from-orange-400 to-orange-600 border-orange-300 text-black",
                )}
              >
                {position}
              </div>
            </div>

            {/* Трофей */}
            <div className="flex justify-center mb-4">
              <TrophyIcon position={position} />
            </div>

            {/* Аватар */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-50 animate-pulse" />
                <Avatar
                  src={player.avatarUrl}
                  alt={player.username}
                  size="lg"
                  className="relative ring-4 ring-purple-500/50"
                />
              </div>
            </div>

            {/* Имя пользователя */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-1">
                {player.username}
              </h3>
            </div>

            {/* Статистика */}
            <div className="space-y-3 mt-6">
              <StatItem
                label="Commits"
                value={player.githubCommits.toLocaleString()}
                icon={<GitHubIcon className="w-5 h-5" />}
              />
              <StatItem
                label="LeetCode"
                value={player.leetcodeSolved.toString()}
                icon={
                  <Image
                    src={leetcodeIcon}
                    alt="LeetCode"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                }
              />
              <StatItem
                label="WPM"
                value={player.monkeytypeRecord.toString()}
                icon={<WPMIcon className="w-5 h-5 text-gray-400" />}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}


function StatItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg border border-gray-700 bg-gray-800/30">
      <div className="flex items-center gap-2">
        <span className="text-gray-400">{icon}</span>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <span className="text-sm font-bold text-gray-200">{value}</span>
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

// Иконка кубка для топ-3
function TrophyIcon({ position }: { position: number }) {
  const trophyColors = [
    "text-yellow-400", // Gold
    "text-gray-300", // Silver
    "text-orange-600", // Bronze
  ];

  return (
    <div className={cn("w-20 h-20 flex items-center justify-center", trophyColors[position - 1])}>
      <svg
        fill="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Основная чаша кубка */}
        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
        {/* Ручки кубка */}
        <path d="M4 7c0-.55.45-1 1-1h1v2H5c-.55 0-1-.45-1-1zm15 0c0-.55-.45-1-1-1h-1v2h1c.55 0 1-.45 1-1z" opacity="0.8" />
        {/* Основание кубка */}
        <path d="M6 19h12v1H6v-1zm1-1h10v1H7v-1z" />
        {/* Верхняя часть (крышка) - разная для каждого места */}
        {position === 1 && (
          <circle cx="12" cy="6" r="1" fill="currentColor" />
        )}
        {position === 2 && (
          <rect x="11" y="5.5" width="2" height="1" fill="currentColor" />
        )}
        {position === 3 && (
          <path d="M12 5.5l-0.5 0.5h1l-0.5-0.5z" fill="currentColor" />
        )}
      </svg>
    </div>
  );
}



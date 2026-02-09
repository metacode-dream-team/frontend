/**
 * API для Leaderboard (с моками)
 */

import type { LeaderboardResponse, LeaderboardUser } from "@/entities/leaderboard";

// Моковые данные для генерации
const MOCK_USERNAMES = [
  "alex_dev",
  "code_master",
  "github_pro",
  "leet_solver",
  "typing_champ",
  "dev_ninja",
  "code_wizard",
  "hack_king",
  "script_lord",
  "byte_boss",
  "dev_hero",
  "code_legend",
  "git_guru",
  "leet_master",
  "type_speed",
  "code_ace",
  "dev_star",
  "hack_genius",
  "script_pro",
  "byte_king",
];

const MOCK_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=",
  "https://api.dicebear.com/7.x/personas/svg?seed=",
  "https://api.dicebear.com/7.x/bottts/svg?seed=",
];

/**
 * Генерирует мокового пользователя
 */
function generateMockUser(
  rank: number,
  isCurrentUser: boolean = false,
): LeaderboardUser {
  const usernameIndex = (rank - 1) % MOCK_USERNAMES.length;
  const username = isCurrentUser
    ? "you"
    : MOCK_USERNAMES[usernameIndex] + (rank > MOCK_USERNAMES.length ? rank : "");

  const avatarSeed = username + rank;
  const avatarBase =
    MOCK_AVATARS[(rank - 1) % MOCK_AVATARS.length] + avatarSeed;

  return {
    id: `user-${rank}`,
    rank,
    username,
    avatarUrl: avatarBase,
    githubCommits: Math.floor(Math.random() * 2000) + 100,
    leetcodeSolved: Math.floor(Math.random() * 500) + 10,
    monkeytypeRecord: Math.floor(Math.random() * 100) + 50,
    isCurrentUser,
  };
}

/**
 * Имитация задержки сети
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Получить страницу рейтинга
 * @param page - номер страницы (начинается с 0)
 * @param limit - количество пользователей на странице
 * @param currentUserRank - ранг текущего пользователя (для моков)
 */
export async function getLeaderboard(
  page: number,
  limit: number = 20,
  currentUserRank: number | null = null,
): Promise<LeaderboardResponse> {
  // Имитация задержки сети (500-1000мс)
  const delayMs = Math.floor(Math.random() * 500) + 500;
  await delay(delayMs);

  // Если currentUserRank не передан, устанавливаем его на позицию 150 (для демо)
  const mockCurrentUserRank = currentUserRank ?? 150;

  const startRank = page * limit + 1;
  const users: LeaderboardUser[] = [];

  // Генерируем пользователей для текущей страницы
  for (let i = 0; i < limit; i++) {
    const rank = startRank + i;
    const isCurrentUser = rank === mockCurrentUserRank;
    users.push(generateMockUser(rank, isCurrentUser));
  }

  // Определяем, есть ли еще данные
  // В моках будем считать, что есть 1000 пользователей
  const totalUsers = 1000;
  const hasMore = startRank + limit <= totalUsers;

  // Если текущий пользователь не на этой странице, добавляем его данные
  let currentUser: LeaderboardUser | undefined;
  if (
    mockCurrentUserRank < startRank || mockCurrentUserRank >= startRank + limit
  ) {
    currentUser = generateMockUser(mockCurrentUserRank, true);
  }

  return {
    users,
    hasMore,
    currentUserRank: mockCurrentUserRank,
    currentUser: currentUser ?? undefined,
  };
}


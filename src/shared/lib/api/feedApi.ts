/**
 * API для Activity Feed (с моками)
 * 
 * Для интеграции с реальным API:
 * 1. Замените функцию getFeed() на реальный запрос к бэкенду
 * 2. Используйте apiClient из @/shared/lib/api/client
 * 3. Сохраните интерфейс FeedResponse для совместимости
 * 
 * Пример интеграции:
 * ```typescript
 * import { apiClient } from "@/shared/lib/api/client";
 * import { useAuthStore } from "@/entities/auth";
 * 
 * export async function getFeed(
 *   cursor: string | null = null,
 *   limit: number = 20,
 * ): Promise<FeedResponse> {
 *   const { accessToken } = useAuthStore.getState();
 *   const params = new URLSearchParams();
 *   if (cursor) params.set("cursor", cursor);
 *   params.set("limit", limit.toString());
 *   
 *   return apiClient.get<FeedResponse>(
 *     `/v1/feed?${params.toString()}`,
 *     accessToken
 *   );
 * }
 * ```
 */

import type { FeedEvent, GroupedEvent } from "@/entities/event";

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
];

const MOCK_AVATARS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=",
  "https://api.dicebear.com/7.x/personas/svg?seed=",
  "https://api.dicebear.com/7.x/bottts/svg?seed=",
];

const MOCK_REPOSITORIES = [
  "awesome-project",
  "my-portfolio",
  "learning-react",
  "api-server",
  "frontend-app",
  "backend-service",
];

const MOCK_PROBLEMS = [
  { title: "Two Sum", difficulty: "Easy" as const, slug: "two-sum" },
  { title: "Add Two Numbers", difficulty: "Medium" as const, slug: "add-two-numbers" },
  { title: "Longest Substring", difficulty: "Medium" as const, slug: "longest-substring" },
  { title: "Median of Arrays", difficulty: "Hard" as const, slug: "median-of-arrays" },
  { title: "Reverse Linked List", difficulty: "Easy" as const, slug: "reverse-linked-list" },
];

const MOCK_ROADMAPS = [
  { title: "Fullstack React", id: "1", slug: "fullstack-react" },
  { title: "Backend Mastery", id: "2", slug: "backend-mastery" },
  { title: "System Design", id: "3", slug: "system-design" },
  { title: "DSA Fundamentals", id: "4", slug: "dsa-fundamentals" },
];

const MOCK_DISCUSSIONS = [
  { title: "Amazon SDE II Interview Experience", id: "1", slug: "amazon-sde-interview" },
  { title: "How to prepare for FAANG?", id: "2", slug: "faang-preparation" },
  { title: "Best practices for React", id: "3", slug: "react-best-practices" },
];

/**
 * Генерирует случайное событие
 */
function generateMockEvent(index: number): FeedEvent {
  const userId = `user-${Math.floor(Math.random() * MOCK_USERNAMES.length)}`;
  const username = MOCK_USERNAMES[Math.floor(Math.random() * MOCK_USERNAMES.length)];
  const avatarSeed = username + index;
  const avatarBase = MOCK_AVATARS[index % MOCK_AVATARS.length] + avatarSeed;

  // Создаем события с разными типами
  const eventTypes: FeedEvent["type"][] = [
    "GITHUB_COMMIT",
    "LEETCODE_SOLVE",
    "ROADMAP_CREATE",
    "ROADMAP_FAVORITE",
    "MONKEYTYPE_RECORD",
    "DISCUSSION_CREATE",
  ];

  const type = eventTypes[index % eventTypes.length];
  const now = new Date();
  const createdAt = new Date(now.getTime() - index * 3600000 - Math.random() * 3600000).toISOString();

  const baseEvent = {
    id: `event-${index}`,
    userId,
    username,
    userAvatar: avatarBase,
    createdAt,
    type,
  };

  switch (type) {
    case "GITHUB_COMMIT": {
      const repo = MOCK_REPOSITORIES[Math.floor(Math.random() * MOCK_REPOSITORIES.length)];
      return {
        ...baseEvent,
        type: "GITHUB_COMMIT",
        payload: {
          commitCount: Math.floor(Math.random() * 10) + 1,
          repository: repo,
          repositoryUrl: `https://github.com/${username}/${repo}`,
        },
      } as FeedEvent;
    }

    case "LEETCODE_SOLVE": {
      const problem = MOCK_PROBLEMS[Math.floor(Math.random() * MOCK_PROBLEMS.length)];
      return {
        ...baseEvent,
        type: "LEETCODE_SOLVE",
        payload: {
          problemTitle: problem.title,
          difficulty: problem.difficulty,
          problemSlug: problem.slug,
        },
      } as FeedEvent;
    }

    case "ROADMAP_CREATE": {
      const roadmap = MOCK_ROADMAPS[Math.floor(Math.random() * MOCK_ROADMAPS.length)];
      return {
        ...baseEvent,
        type: "ROADMAP_CREATE",
        payload: {
          roadmapTitle: roadmap.title,
          roadmapId: roadmap.id,
          roadmapSlug: roadmap.slug,
        },
      } as FeedEvent;
    }

    case "ROADMAP_FAVORITE": {
      const roadmap = MOCK_ROADMAPS[Math.floor(Math.random() * MOCK_ROADMAPS.length)];
      return {
        ...baseEvent,
        type: "ROADMAP_FAVORITE",
        payload: {
          roadmapTitle: roadmap.title,
          roadmapId: roadmap.id,
          roadmapSlug: roadmap.slug,
        },
      } as FeedEvent;
    }

    case "MONKEYTYPE_RECORD": {
      const modes = ["60s", "120s", "30s"];
      return {
        ...baseEvent,
        type: "MONKEYTYPE_RECORD",
        payload: {
          wpm: Math.floor(Math.random() * 50) + 80,
          mode: modes[Math.floor(Math.random() * modes.length)],
          accuracy: Math.floor(Math.random() * 10) + 90,
        },
      } as FeedEvent;
    }

    case "DISCUSSION_CREATE": {
      const discussion = MOCK_DISCUSSIONS[Math.floor(Math.random() * MOCK_DISCUSSIONS.length)];
      return {
        ...baseEvent,
        type: "DISCUSSION_CREATE",
        payload: {
          discussionTitle: discussion.title,
          discussionId: discussion.id,
          discussionSlug: discussion.slug,
        },
      } as FeedEvent;
    }

    default:
      throw new Error(`Unknown event type: ${type}`);
  }
}

/**
 * Имитация задержки сети
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export interface FeedResponse {
  events: FeedEvent[];
  hasMore: boolean;
  nextCursor?: string;
}

/**
 * Получить страницу ленты событий
 * @param cursor - курсор для пагинации (опционально)
 * @param limit - количество событий на странице
 */
export async function getFeed(
  cursor: string | null = null,
  limit: number = 20,
): Promise<FeedResponse> {
  // Имитация задержки сети (300-800мс)
  const delayMs = Math.floor(Math.random() * 500) + 300;
  await delay(delayMs);

  const startIndex = cursor ? parseInt(cursor, 10) : 0;
  const events: FeedEvent[] = [];

  // Генерируем события для текущей страницы
  for (let i = 0; i < limit; i++) {
    events.push(generateMockEvent(startIndex + i));
  }

  // Определяем, есть ли еще данные
  // В моках будем считать, что есть 200 событий
  const totalEvents = 200;
  const hasMore = startIndex + limit < totalEvents;
  const nextCursor = hasMore ? String(startIndex + limit) : undefined;

  return {
    events,
    hasMore,
    nextCursor,
  };
}

/**
 * Типы событий для Activity Feed
 */

export type EventType =
  | "GITHUB_COMMIT"
  | "LEETCODE_SOLVE"
  | "ROADMAP_CREATE"
  | "ROADMAP_FAVORITE"
  | "MONKEYTYPE_RECORD"
  | "DISCUSSION_CREATE";

/**
 * Базовый интерфейс события
 */
export interface BaseEvent {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  createdAt: string; // ISO Date
  type: EventType;
}

/**
 * GitHub событие: коммиты в репозиторий
 */
export interface GithubEvent extends BaseEvent {
  type: "GITHUB_COMMIT";
  payload: {
    commitCount: number;
    repository: string;
    repositoryUrl?: string;
  };
}

/**
 * LeetCode событие: решение задачи
 */
export interface LeetcodeEvent extends BaseEvent {
  type: "LEETCODE_SOLVE";
  payload: {
    problemTitle: string;
    difficulty: "Easy" | "Medium" | "Hard";
    problemSlug?: string;
  };
}

/**
 * Roadmap событие: создание роадмапа
 */
export interface RoadmapCreateEvent extends BaseEvent {
  type: "ROADMAP_CREATE";
  payload: {
    roadmapTitle: string;
    roadmapId: string;
    roadmapSlug?: string;
  };
}

/**
 * Roadmap событие: добавление в избранное
 */
export interface RoadmapFavoriteEvent extends BaseEvent {
  type: "ROADMAP_FAVORITE";
  payload: {
    roadmapTitle: string;
    roadmapId: string;
    roadmapSlug?: string;
  };
}

/**
 * Monkeytype событие: новый рекорд WPM
 */
export interface MonkeytypeEvent extends BaseEvent {
  type: "MONKEYTYPE_RECORD";
  payload: {
    wpm: number;
    mode: string; // например "60s", "120s"
    accuracy?: number;
  };
}

/**
 * Discussion событие: создание дискуссии
 */
export interface DiscussionEvent extends BaseEvent {
  type: "DISCUSSION_CREATE";
  payload: {
    discussionTitle: string;
    discussionId: string;
    discussionSlug?: string;
  };
}

/**
 * Union type для всех типов событий
 */
export type FeedEvent =
  | GithubEvent
  | LeetcodeEvent
  | RoadmapCreateEvent
  | RoadmapFavoriteEvent
  | MonkeytypeEvent
  | DiscussionEvent;

/**
 * Группированное событие (для отображения нескольких действий одного пользователя)
 */
export interface GroupedEvent {
  userId: string;
  username: string;
  userAvatar: string;
  events: FeedEvent[];
  createdAt: string; // Время первого события в группе
}


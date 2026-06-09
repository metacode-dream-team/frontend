export const DISCUSSION_CATEGORIES = [
  { id: "general", label: "Общее" },
  { id: "help", label: "Помощь" },
  { id: "showcase", label: "Проекты" },
  { id: "feedback", label: "Отзывы" },
] as const;

export type DiscussionCategory = (typeof DISCUSSION_CATEGORIES)[number]["id"];

export const DISCUSSION_SORT_OPTIONS = [
  { id: "top", label: "Топ" },
  { id: "new", label: "Новые" },
  { id: "comments", label: "Обсуждаемые" },
] as const;

export type DiscussionSort = (typeof DISCUSSION_SORT_OPTIONS)[number]["id"];

export const REACTION_KINDS = [
  { id: "like", emoji: "👍", label: "Нравится" },
  { id: "love", emoji: "❤️", label: "Супер" },
  { id: "funny", emoji: "😂", label: "Смешно" },
  { id: "fire", emoji: "🔥", label: "Огонь" },
  { id: "insight", emoji: "💡", label: "Полезно" },
] as const;

export type ReactionKind = (typeof REACTION_KINDS)[number]["id"];

export type ReactionCounts = Record<ReactionKind, number>;

export function emptyReactions(): ReactionCounts {
  return { like: 0, love: 0, funny: 0, fire: 0, insight: 0 };
}

export interface DiscussionAuthor {
  id: string;
  username: string;
  avatarUrl: string;
}

export interface DiscussionPost {
  id: string;
  title: string;
  body: string;
  category: DiscussionCategory;
  author: DiscussionAuthor;
  createdAt: string;
  reactions: ReactionCounts;
  userReactions: Record<string, ReactionKind>;
}

export interface DiscussionComment {
  id: string;
  postId: string;
  author: DiscussionAuthor;
  body: string;
  createdAt: string;
  reactions: ReactionCounts;
  userReactions: Record<string, ReactionKind>;
}

export interface DiscussionData {
  posts: DiscussionPost[];
  commentsByPostId: Record<string, DiscussionComment[]>;
}

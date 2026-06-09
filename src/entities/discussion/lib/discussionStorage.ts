import type { DiscussionData, DiscussionPost } from "../model/types";
import { emptyReactions } from "../model/types";

const STORAGE_KEY = "metacode-discussions-v1";

function avatarSeed(seed: string): string {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}`;
}

const SEED_POSTS: DiscussionPost[] = [
  {
    id: "welcome-metacode",
    title: "Добро пожаловать в MetaCode!",
    body:
      "Это пространство для обсуждений между разработчиками. Делитесь опытом, задавайте вопросы и показывайте свои проекты.\n\n" +
      "Создайте свой пост или оставьте комментарий под существующим.",
    category: "general",
    author: {
      id: "system",
      username: "MetaCode",
      avatarUrl: avatarSeed("metacode"),
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    reactions: { like: 42, love: 18, funny: 2, fire: 7, insight: 15 },
    userReactions: {},
  },
  {
    id: "leetcode-streak-tips",
    title: "Как держать streak на LeetCode?",
    body:
      "Делитесь своими лайфхаками: сколько задач в день решаете, как не выгораете и что помогает не пропускать дни.",
    category: "help",
    author: {
      id: "user-demo-1",
      username: "algo_ninja",
      avatarUrl: avatarSeed("algo_ninja"),
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    reactions: { like: 12, love: 3, funny: 0, fire: 5, insight: 9 },
    userReactions: {},
  },
  {
    id: "go-pet-project",
    title: "Показываю pet-project на Go + Mongo",
    body:
      "Сделал сервис геймификации активности. Архитектура: handlers → service → repository. Буду рад фидбеку по структуре пакетов.",
    category: "showcase",
    author: {
      id: "user-demo-2",
      username: "gopher_dev",
      avatarUrl: avatarSeed("gopher_dev"),
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    reactions: { like: 8, love: 6, funny: 1, fire: 11, insight: 4 },
    userReactions: {},
  },
];

function defaultData(): DiscussionData {
  return {
    posts: SEED_POSTS,
    commentsByPostId: {
      "welcome-metacode": [
        {
          id: "c-welcome-1",
          postId: "welcome-metacode",
          author: {
            id: "user-demo-1",
            username: "algo_ninja",
            avatarUrl: avatarSeed("algo_ninja"),
          },
          body: "Отличная идея — наконец-то место, где можно обсудить прогресс, а не только смотреть на ачивки.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
          reactions: { like: 5, love: 2, funny: 0, fire: 0, insight: 1 },
          userReactions: {},
        },
        {
          id: "c-welcome-2",
          postId: "welcome-metacode",
          author: {
            id: "user-demo-2",
            username: "gopher_dev",
            avatarUrl: avatarSeed("gopher_dev"),
          },
          body: "Жду раздел с вопросами по интеграциям GitHub и LeetCode.",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 40).toISOString(),
          reactions: { like: 3, love: 0, funny: 0, fire: 1, insight: 2 },
          userReactions: {},
        },
      ],
    },
  };
}

export function loadDiscussionData(): DiscussionData {
  if (typeof window === "undefined") return defaultData();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData();
    const parsed = JSON.parse(raw) as DiscussionData;
    if (!Array.isArray(parsed.posts)) return defaultData();
    return {
      posts: parsed.posts,
      commentsByPostId: parsed.commentsByPostId ?? {},
    };
  } catch {
    return defaultData();
  }
}

export function saveDiscussionData(data: DiscussionData): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore quota errors
  }
}

export function normalizePostReactions(post: DiscussionPost): DiscussionPost {
  return {
    ...post,
    reactions: { ...emptyReactions(), ...post.reactions },
    userReactions: post.userReactions ?? {},
  };
}

import type { DiscussionComment, DiscussionData, DiscussionPost, VoteKind } from "../model/types";

const STORAGE_KEY = "metacode-discussions-v1";

type LegacyReactions = Partial<Record<"like" | "love" | "funny" | "fire" | "insight", number>>;

type StoredPost = DiscussionPost & {
  reactions?: LegacyReactions;
  userReactions?: Record<string, string>;
};

type StoredComment = DiscussionComment & {
  reactions?: LegacyReactions;
  userReactions?: Record<string, string>;
};

function avatarSeed(seed: string): string {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}`;
}

function migrateVotes(item: StoredPost | StoredComment): {
  upvotes: number;
  downvotes: number;
  userVotes: Record<string, VoteKind>;
} {
  if (typeof item.upvotes === "number" && typeof item.downvotes === "number") {
    return {
      upvotes: item.upvotes,
      downvotes: item.downvotes,
      userVotes: item.userVotes ?? {},
    };
  }

  const reactions = item.reactions ?? {};
  const upvotes =
    (reactions.like ?? 0) +
    (reactions.love ?? 0) +
    (reactions.funny ?? 0) +
    (reactions.fire ?? 0) +
    (reactions.insight ?? 0);

  const userVotes: Record<string, VoteKind> = {};
  if (item.userReactions) {
    for (const userId of Object.keys(item.userReactions)) {
      userVotes[userId] = "up";
    }
  }

  return { upvotes, downvotes: 0, userVotes };
}

function normalizePost(post: StoredPost): DiscussionPost {
  const votes = migrateVotes(post);
  const { reactions: _r, userReactions: _ur, ...rest } = post;
  return { ...rest, ...votes };
}

function normalizeComment(comment: StoredComment): DiscussionComment {
  const votes = migrateVotes(comment);
  const { reactions: _r, userReactions: _ur, ...rest } = comment;
  return { ...rest, ...votes };
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
    upvotes: 84,
    downvotes: 3,
    commentCount: 0,
    userVotes: {},
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
    upvotes: 29,
    downvotes: 2,
    commentCount: 0,
    userVotes: {},
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
    upvotes: 30,
    downvotes: 1,
    commentCount: 0,
    userVotes: {},
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
          upvotes: 8,
          downvotes: 0,
          userVotes: {},
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
          upvotes: 6,
          downvotes: 1,
          userVotes: {},
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
    const parsed = JSON.parse(raw) as {
      posts?: StoredPost[];
      commentsByPostId?: Record<string, StoredComment[]>;
    };
    if (!Array.isArray(parsed.posts)) return defaultData();

    const commentsByPostId: Record<string, DiscussionComment[]> = {};
    for (const [postId, comments] of Object.entries(parsed.commentsByPostId ?? {})) {
      commentsByPostId[postId] = (comments ?? []).map(normalizeComment);
    }

    return {
      posts: parsed.posts.map(normalizePost),
      commentsByPostId,
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

export function normalizePostVotes(post: DiscussionPost): DiscussionPost {
  return normalizePost(post as StoredPost);
}

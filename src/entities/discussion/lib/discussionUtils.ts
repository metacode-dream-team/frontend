import type {
  DiscussionCategory,
  DiscussionComment,
  DiscussionPost,
  DiscussionSort,
  ReactionCounts,
  ReactionKind,
} from "../model/types";

export function reactionScore(reactions: ReactionCounts): number {
  return (
    reactions.like +
    reactions.love * 2 +
    reactions.funny +
    reactions.fire * 2 +
    reactions.insight * 2
  );
}

export function totalReactions(reactions: ReactionCounts): number {
  return (
    reactions.like + reactions.love + reactions.funny + reactions.fire + reactions.insight
  );
}

export function commentCount(
  postId: string,
  commentsByPostId: Record<string, DiscussionComment[]>,
): number {
  return commentsByPostId[postId]?.length ?? 0;
}

function compareByTopEngagement(
  a: DiscussionPost,
  b: DiscussionPost,
  commentsByPostId: Record<string, DiscussionComment[]>,
): number {
  const scoreDiff = reactionScore(b.reactions) - reactionScore(a.reactions);
  if (scoreDiff !== 0) return scoreDiff;

  const commentDiff = commentCount(b.id, commentsByPostId) - commentCount(a.id, commentsByPostId);
  if (commentDiff !== 0) return commentDiff;

  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

export function getTopPosts(
  posts: DiscussionPost[],
  commentsByPostId: Record<string, DiscussionComment[]>,
  options: {
    category: DiscussionCategory | "all";
    limit?: number;
  },
): DiscussionPost[] {
  const result = posts.filter((post) => {
    if (options.category !== "all" && post.category !== options.category) return false;
    return (
      reactionScore(post.reactions) > 0 || commentCount(post.id, commentsByPostId) > 0
    );
  });

  return [...result]
    .sort((a, b) => compareByTopEngagement(a, b, commentsByPostId))
    .slice(0, options.limit ?? 6);
}

export function filterAndSortPosts(
  posts: DiscussionPost[],
  commentsByPostId: Record<string, DiscussionComment[]>,
  options: {
    query: string;
    category: DiscussionCategory | "all";
    sort: DiscussionSort;
  },
): DiscussionPost[] {
  const q = options.query.trim().toLowerCase();

  let result = posts.filter((post) => {
    if (options.category !== "all" && post.category !== options.category) return false;
    if (!q) return true;
    return (
      post.title.toLowerCase().includes(q) ||
      post.body.toLowerCase().includes(q) ||
      post.author.username.toLowerCase().includes(q)
    );
  });

  result = [...result].sort((a, b) => {
    if (options.sort === "new") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (options.sort === "comments") {
      const ca = commentCount(a.id, commentsByPostId);
      const cb = commentCount(b.id, commentsByPostId);
      if (cb !== ca) return cb - ca;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return compareByTopEngagement(a, b, commentsByPostId);
  });

  return result;
}

export function toggleReaction(
  reactions: ReactionCounts,
  userReactions: Record<string, ReactionKind>,
  userId: string,
  kind: ReactionKind,
): { reactions: ReactionCounts; userReactions: Record<string, ReactionKind> } {
  const nextReactions = { ...reactions };
  const nextUserReactions = { ...userReactions };
  const prev = nextUserReactions[userId];

  if (prev === kind) {
    nextReactions[kind] = Math.max(0, nextReactions[kind] - 1);
    delete nextUserReactions[userId];
    return { reactions: nextReactions, userReactions: nextUserReactions };
  }

  if (prev) {
    nextReactions[prev] = Math.max(0, nextReactions[prev] - 1);
  }

  nextReactions[kind] += 1;
  nextUserReactions[userId] = kind;
  return { reactions: nextReactions, userReactions: nextUserReactions };
}

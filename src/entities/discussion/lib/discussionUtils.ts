import type {
  DiscussionCategory,
  DiscussionComment,
  DiscussionPost,
  DiscussionSort,
  VoteKind,
} from "../model/types";

export function voteScore(upvotes: number, downvotes: number): number {
  return upvotes - downvotes;
}

export function commentCount(
  post: DiscussionPost,
  commentsByPostId: Record<string, DiscussionComment[]>,
): number {
  if (typeof post.commentCount === "number") return post.commentCount;
  return commentsByPostId[post.id]?.length ?? 0;
}

function compareByTopEngagement(
  a: DiscussionPost,
  b: DiscussionPost,
  commentsByPostId: Record<string, DiscussionComment[]>,
): number {
  const scoreDiff = voteScore(b.upvotes, b.downvotes) - voteScore(a.upvotes, a.downvotes);
  if (scoreDiff !== 0) return scoreDiff;

  const commentDiff = commentCount(b, commentsByPostId) - commentCount(a, commentsByPostId);
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
      voteScore(post.upvotes, post.downvotes) > 0 ||
      commentCount(post, commentsByPostId) > 0
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
      const ca = commentCount(a, commentsByPostId);
      const cb = commentCount(b, commentsByPostId);
      if (cb !== ca) return cb - ca;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return compareByTopEngagement(a, b, commentsByPostId);
  });

  return result;
}

export function toggleVote(
  upvotes: number,
  downvotes: number,
  userVotes: Record<string, VoteKind>,
  userId: string,
  kind: VoteKind,
): { upvotes: number; downvotes: number; userVotes: Record<string, VoteKind> } {
  const nextUserVotes = { ...userVotes };
  const prev = nextUserVotes[userId];
  let nextUpvotes = upvotes;
  let nextDownvotes = downvotes;

  if (prev === kind) {
    if (kind === "up") nextUpvotes = Math.max(0, nextUpvotes - 1);
    else nextDownvotes = Math.max(0, nextDownvotes - 1);
    delete nextUserVotes[userId];
    return { upvotes: nextUpvotes, downvotes: nextDownvotes, userVotes: nextUserVotes };
  }

  if (prev === "up") nextUpvotes = Math.max(0, nextUpvotes - 1);
  if (prev === "down") nextDownvotes = Math.max(0, nextDownvotes - 1);

  if (kind === "up") nextUpvotes += 1;
  else nextDownvotes += 1;

  nextUserVotes[userId] = kind;
  return { upvotes: nextUpvotes, downvotes: nextDownvotes, userVotes: nextUserVotes };
}

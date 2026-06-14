export const DISCUSSION_CATEGORIES = [
  { id: "common", label: "General" },
  { id: "support", label: "Help" },
  { id: "project", label: "Showcase" },
  { id: "review", label: "Feedback" },
] as const;

export type DiscussionCategory = (typeof DISCUSSION_CATEGORIES)[number]["id"];

export const DISCUSSION_SORT_OPTIONS = [
  { id: "top", label: "Top" },
  { id: "new", label: "New" },
  { id: "comments", label: "Most discussed" },
] as const;

export type DiscussionSort = (typeof DISCUSSION_SORT_OPTIONS)[number]["id"];

export type VoteKind = "up" | "down";

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
  upvotes: number;
  downvotes: number;
  commentCount: number;
  userVotes: Record<string, VoteKind>;
}

export interface DiscussionComment {
  id: string;
  postId: string;
  author: DiscussionAuthor;
  body: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVotes: Record<string, VoteKind>;
}

export interface DiscussionData {
  posts: DiscussionPost[];
  commentsByPostId: Record<string, DiscussionComment[]>;
}

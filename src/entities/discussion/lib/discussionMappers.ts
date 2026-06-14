import { extractArrayPayload } from "@/shared/lib/api/platformMappers";
import type {
  DiscussionAuthor,
  DiscussionCategory,
  DiscussionComment,
  DiscussionPost,
  VoteKind,
} from "../model/types";

type Json = Record<string, unknown>;

const LEGACY_CATEGORY_ALIASES: Record<string, DiscussionCategory> = {
  general: "common",
  help: "support",
  showcase: "project",
  feedback: "review",
};

function str(v: unknown, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  return String(v);
}

function avatarFallback(seed: string): string {
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed || "user")}`;
}

function mapAuthor(raw: Json | undefined, authorId?: string): DiscussionAuthor {
  const user = (raw?.user as Json | undefined) ?? raw ?? {};
  const id = str(user.user_id ?? user.userId ?? user.UserID ?? authorId ?? user.id, "unknown");
  const username = str(user.username ?? user.Username, "developer").trim() || "developer";
  const avatarUrl =
    str(user.avatar_url ?? user.avatarUrl ?? user.AvatarURL, "").trim() ||
    avatarFallback(username);

  return { id, username, avatarUrl };
}

function mapUserVotes(
  currentUserId: string | null | undefined,
  isUpvoted: boolean,
  isDownvoted: boolean,
): Record<string, VoteKind> {
  if (!currentUserId) return {};
  if (isUpvoted) return { [currentUserId]: "up" };
  if (isDownvoted) return { [currentUserId]: "down" };
  return {};
}

export function normalizeDiscussionCategory(raw: unknown): DiscussionCategory {
  const key = str(raw, "").toLowerCase();
  if (key === "common" || key === "support" || key === "project" || key === "review") {
    return key;
  }
  return LEGACY_CATEGORY_ALIASES[key] ?? "common";
}

function mapCategory(raw: unknown): DiscussionCategory {
  return normalizeDiscussionCategory(raw);
}

export function mapDiscussionFromApi(
  raw: unknown,
  currentUserId?: string | null,
): DiscussionPost | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Json;
  const id = str(o.id ?? o.ID, "").trim();
  if (!id) return null;

  const author = mapAuthor(o, str(o.authorId ?? o.author_id, ""));
  const isUpvoted = o.is_upvoted === true || o.isUpvoted === true;
  const isDownvoted = o.is_downvoted === true || o.isDownvoted === true;

  return {
    id,
    title: str(o.title ?? o.Title, "").trim() || "Untitled",
    body: str(o.content ?? o.Content ?? o.body, ""),
    category: mapCategory(o.category ?? o.Category),
    author,
    createdAt: str(o.created_at ?? o.createdAt, new Date().toISOString()),
    upvotes: Number(o.upvotes ?? o.Upvotes ?? 0) || 0,
    downvotes: Number(o.downvotes ?? o.Downvotes ?? 0) || 0,
    commentCount: Number(o.comment_count ?? o.commentCount ?? 0) || 0,
    userVotes: mapUserVotes(currentUserId, isUpvoted, isDownvoted),
  };
}

export function mapCommentFromApi(
  raw: unknown,
  currentUserId?: string | null,
): DiscussionComment | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Json;
  const id = str(o.id ?? o.ID, "").trim();
  const postId = str(o.discussion_id ?? o.discussionId ?? o.DiscussionID, "").trim();
  if (!id || !postId) return null;

  const author = mapAuthor(o, str(o.author_id ?? o.authorId, ""));
  const isUpvoted = o.is_upvoted === true || o.isUpvoted === true;
  const isDownvoted = o.is_downvoted === true || o.isDownvoted === true;

  return {
    id,
    postId,
    author,
    body: str(o.content ?? o.Content ?? o.body, ""),
    createdAt: str(o.created_at ?? o.createdAt, new Date().toISOString()),
    upvotes: Number(o.upvotes ?? o.Upvotes ?? 0) || 0,
    downvotes: Number(o.downvotes ?? o.Downvotes ?? 0) || 0,
    userVotes: mapUserVotes(currentUserId, isUpvoted, isDownvoted),
  };
}

export function mapDiscussionListFromApi(
  raw: unknown,
  currentUserId?: string | null,
): DiscussionPost[] {
  const list = extractArrayPayload(raw);
  const out: DiscussionPost[] = [];
  for (const item of list) {
    const mapped = mapDiscussionFromApi(item, currentUserId);
    if (mapped) out.push(mapped);
  }
  return out;
}

export function mapCommentListFromApi(
  raw: unknown,
  currentUserId?: string | null,
): DiscussionComment[] {
  const list = extractArrayPayload(raw);
  const out: DiscussionComment[] = [];
  for (const item of list) {
    const mapped = mapCommentFromApi(item, currentUserId);
    if (mapped) out.push(mapped);
  }
  return out;
}

import type { DiscussionCategory } from "@/entities/discussion/model/types";
import { integrationGet, integrationPost } from "./platformClient";
import { unwrapDataPayload } from "./platformMappers";

type Json = Record<string, unknown>;

const LIST_LIMIT = 100;
const COMMENTS_LIMIT = 100;

export async function fetchDiscussions(
  accessToken?: string | null,
  options?: { limit?: number; offset?: number },
): Promise<unknown> {
  const limit = options?.limit ?? LIST_LIMIT;
  const offset = options?.offset ?? 0;
  const q = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  const raw = await integrationGet<unknown>(
    `/v1/engagement/discussions?${q.toString()}`,
    accessToken,
  );
  return unwrapDataPayload(raw);
}

export async function fetchDiscussionById(
  id: string,
  accessToken?: string | null,
): Promise<unknown> {
  const raw = await integrationGet<unknown>(
    `/v1/engagement/discussions/${encodeURIComponent(id)}`,
    accessToken,
  );
  return unwrapDataPayload(raw);
}

export async function searchDiscussions(
  accessToken: string | null | undefined,
  options: {
    search?: string;
    category?: DiscussionCategory | "all";
    sort?: "top" | "new" | "comments";
    limit?: number;
    offset?: number;
  },
): Promise<unknown> {
  const params = new URLSearchParams({
    limit: String(options.limit ?? LIST_LIMIT),
    offset: String(options.offset ?? 0),
  });

  if (options.search?.trim()) {
    params.set("search", options.search.trim());
  }

  if (options.category && options.category !== "all") {
    params.set("category", options.category);
  }

  const sortBy =
    options.sort === "comments"
      ? "most_discussed"
      : options.sort === "new"
        ? "time"
        : options.sort === "top"
          ? "top"
          : "";
  if (sortBy) params.set("sort_by", sortBy);

  const raw = await integrationGet<unknown>(
    `/v1/engagement/discussions/search?${params.toString()}`,
    accessToken,
  );
  return unwrapDataPayload(raw);
}

export async function createDiscussion(
  accessToken: string,
  body: { title: string; content: string; category: DiscussionCategory },
): Promise<unknown> {
  const raw = await integrationPost<unknown>(
    "/v1/engagement/discussions",
    {
      title: body.title,
      content: body.content,
      category: body.category,
    },
    accessToken,
  );
  return unwrapDataPayload(raw);
}

export async function fetchDiscussionComments(
  discussionId: string,
  accessToken?: string | null,
): Promise<unknown> {
  const q = new URLSearchParams({
    limit: String(COMMENTS_LIMIT),
    offset: "0",
  });
  const raw = await integrationGet<unknown>(
    `/v1/engagement/discussions/${encodeURIComponent(discussionId)}/comments?${q.toString()}`,
    accessToken,
  );
  return unwrapDataPayload(raw);
}

export async function createDiscussionComment(
  accessToken: string,
  discussionId: string,
  content: string,
): Promise<unknown> {
  const raw = await integrationPost<unknown>(
    `/v1/engagement/discussions/${encodeURIComponent(discussionId)}/comments`,
    { content },
    accessToken,
  );
  return unwrapDataPayload(raw);
}

export async function voteDiscussion(
  accessToken: string,
  discussionId: string,
  kind: "up" | "down",
): Promise<void> {
  const action = kind === "up" ? "upvote" : "downvote";
  await integrationPost<Json>(
    `/v1/engagement/discussions/${encodeURIComponent(discussionId)}/${action}`,
    {},
    accessToken,
  );
}

export async function voteComment(
  accessToken: string,
  commentId: string,
  kind: "up" | "down",
): Promise<void> {
  const action = kind === "up" ? "upvote" : "downvote";
  await integrationPost<Json>(
    `/v1/engagement/comments/${encodeURIComponent(commentId)}/${action}`,
    {},
    accessToken,
  );
}

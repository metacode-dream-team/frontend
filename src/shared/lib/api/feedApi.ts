import type { FeedEvent } from "@/shared/types/event";
import { mapEngagementFeedPayload } from "./feedMappers";
import { platformGet } from "./platformClient";

export interface FeedResponse {
  events: FeedEvent[];
  hasMore: boolean;
  nextCursor?: string;
}

export async function fetchEngagementFeed(
  accessToken?: string | null,
): Promise<unknown> {
  return platformGet<unknown>("/v1/engagement/feed", accessToken);
}

/**
 * Загрузка ленты engagement (без пагинации на текущем API).
 */
export async function getFeed(
  _cursor: string | null = null,
  _limit: number = 20,
  accessToken?: string | null,
): Promise<FeedResponse> {
  const raw = await fetchEngagementFeed(accessToken);
  const events = mapEngagementFeedPayload(raw);
  return {
    events,
    hasMore: false,
  };
}

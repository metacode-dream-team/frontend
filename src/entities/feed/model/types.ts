/**
 * Типы для Feed
 */

import type { FeedEvent, GroupedEvent } from "@/entities/event";

export interface FeedState {
  events: FeedEvent[];
  groupedEvents: GroupedEvent[];
  isLoading: boolean;
  hasMore: boolean;
  nextCursor: string | null;
}


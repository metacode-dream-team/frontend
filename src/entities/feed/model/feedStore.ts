/**
 * Zustand store для Feed
 */

import { create } from "zustand";
import type { FeedState } from "./types";
import type { FeedEvent, GroupedEvent } from "@/entities/event";

interface FeedStore extends FeedState {
  // Actions
  setEvents: (events: FeedEvent[]) => void;
  appendEvents: (events: FeedEvent[]) => void;
  setGroupedEvents: (events: GroupedEvent[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setHasMore: (hasMore: boolean) => void;
  setNextCursor: (cursor: string | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState: FeedState = {
  events: [],
  groupedEvents: [],
  isLoading: false,
  hasMore: true,
  nextCursor: null,
  error: null,
};

export const useFeedStore = create<FeedStore>((set) => ({
  ...initialState,

  setEvents: (events) => set({ events }),

  appendEvents: (events) =>
    set((state) => ({
      events: [...state.events, ...events],
    })),

  setGroupedEvents: (groupedEvents) => set({ groupedEvents }),

  setIsLoading: (isLoading) => set({ isLoading }),

  setHasMore: (hasMore) => set({ hasMore }),

  setNextCursor: (nextCursor) => set({ nextCursor }),

  setError: (error) => set({ error }),

  reset: () => set(initialState),
}));


/**
 * Хук для загрузки данных feed
 */

import { useEffect } from "react";
import { useAuthStore } from "@/entities/auth";
import { useFeedStore } from "@/entities/feed";
import { getFeed } from "@/shared/lib/api/feedApi";
import { groupEvents } from "@/shared/lib/utils/groupEvents";

export function useFetchFeed() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const {
    events,
    groupedEvents,
    isLoading,
    hasMore,
    setEvents,
    setGroupedEvents,
    setIsLoading,
    setHasMore,
    setNextCursor,
    reset,
  } = useFeedStore();

  useEffect(() => {
    void loadPage();
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const loadPage = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await getFeed(null, 20, accessToken);
      setEvents(response.events);
      setGroupedEvents(groupEvents(response.events));
      setHasMore(false);
      setNextCursor(null);
    } catch (error) {
      console.error("[Feed] Failed to load:", error);
      setEvents([]);
      setGroupedEvents([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNextPage = () => {
    if (!hasMore || isLoading) return;
  };

  return {
    events,
    groupedEvents,
    isLoading,
    hasMore,
    loadNextPage,
    reset,
  };
}

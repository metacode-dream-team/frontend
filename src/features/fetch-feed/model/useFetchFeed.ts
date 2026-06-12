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
    setError,
    error,
    reset,
  } = useFeedStore();

  useEffect(() => {
    void loadPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const loadPage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getFeed(null, 20, accessToken);
      setEvents(response.events);
      setGroupedEvents(groupEvents(response.events));
      setHasMore(false);
      setNextCursor(null);
    } catch (err) {
      console.error("[Feed] Failed to load:", err);
      const message = err instanceof Error ? err.message : "Failed to load feed";
      setError(message);
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
    error,
    loadNextPage,
    reload: loadPage,
    reset,
  };
}

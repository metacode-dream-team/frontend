/**
 * Хук для загрузки данных feed
 */

import { useEffect, useMemo } from "react";
import { useFeedStore } from "@/entities/feed";
import { getFeed } from "@/shared/lib/api/feedApi";
import { groupEvents } from "@/shared/lib/utils/groupEvents";

export function useFetchFeed() {
  const {
    events,
    groupedEvents,
    isLoading,
    hasMore,
    nextCursor,
    setEvents,
    appendEvents,
    setGroupedEvents,
    setIsLoading,
    setHasMore,
    setNextCursor,
    reset,
  } = useFeedStore();

  // Загрузка первой страницы при монтировании
  useEffect(() => {
    loadPage(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Пересчитываем группировку при изменении событий
  useEffect(() => {
    if (events.length > 0) {
      const grouped = groupEvents(events);
      setGroupedEvents(grouped);
    }
  }, [events, setGroupedEvents]);

  const loadPage = async (cursor: string | null) => {
    if (isLoading || (!hasMore && cursor !== null)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await getFeed(cursor, 20);

      if (cursor === null) {
        // Первая загрузка
        setEvents(response.events);
      } else {
        // Подгрузка следующей страницы
        appendEvents(response.events);
      }

      setHasMore(response.hasMore);
      setNextCursor(response.nextCursor || null);
    } catch (error) {
      console.error("[Feed] Failed to load page:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadNextPage = () => {
    if (hasMore && !isLoading && nextCursor) {
      loadPage(nextCursor);
    } else if (hasMore && !isLoading && events.length === 0) {
      // Если нет курсора, но есть события, используем количество событий как курсор
      loadPage(String(events.length));
    }
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


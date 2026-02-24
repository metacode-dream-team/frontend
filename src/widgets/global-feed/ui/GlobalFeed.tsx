/**
 * Виджет глобальной ленты событий
 */

import { useEffect, useRef } from "react";
import { useFetchFeed } from "@/features/fetch-feed";
import { EventCard } from "@/entities/event/ui/EventCard";
import { GroupedEventCard } from "@/entities/event/ui/GroupedEventCard";
import { EventCardSkeleton } from "@/entities/event/ui/EventCardSkeleton";
import { cn } from "@/shared/lib/utils/cn";
import type { GroupedEvent } from "@/entities/event";

interface GlobalFeedProps {
  className?: string;
  useGrouping?: boolean; // Использовать ли группировку событий
}

export function GlobalFeed({ className, useGrouping = true }: GlobalFeedProps) {
  const { groupedEvents, events, isLoading, hasMore, loadNextPage } = useFetchFeed();
  const triggerRef = useRef<HTMLDivElement>(null);

  // Бесконечный скролл
  useEffect(() => {
    const trigger = triggerRef.current;
    if (!trigger || !hasMore || isLoading) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasMore && !isLoading) {
          loadNextPage();
        }
      },
      {
        rootMargin: "200px", // Начинаем загрузку за 200px до видимости
      },
    );

    observer.observe(trigger);

    return () => {
      if (trigger) {
        observer.unobserve(trigger);
      }
    };
  }, [hasMore, isLoading, loadNextPage]);

  // Определяем, что показывать
  const displayEvents = useGrouping ? groupedEvents : events;
  const isEmpty = !isLoading && displayEvents.length === 0;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Пустое состояние */}
      {isEmpty && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📰</div>
          <p className="text-gray-400 text-lg font-medium">Лента пуста</p>
          <p className="text-gray-500 text-sm mt-2">
            Здесь будут отображаться события пользователей
          </p>
        </div>
      )}

      {/* Скелетоны при первой загрузке */}
      {isLoading && displayEvents.length === 0 && (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* События */}
      {displayEvents.length > 0 && (
        <div className="space-y-4">
          {useGrouping
            ? groupedEvents.map((groupedEvent) => (
                <GroupedEventCard key={groupedEvent.userId + groupedEvent.createdAt} groupedEvent={groupedEvent} />
              ))
            : events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}

          {/* Скелетоны при подгрузке */}
          {isLoading && displayEvents.length > 0 && (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <EventCardSkeleton key={`loading-${index}`} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Триггер бесконечного скролла */}
      {hasMore && (
        <div
          ref={triggerRef}
          className="h-24 flex items-center justify-center"
          aria-hidden="true"
        >
          {isLoading && (
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-2">
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-pink-500 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <span className="text-sm text-gray-400 font-medium">Загрузка событий...</span>
            </div>
          )}
        </div>
      )}

      {/* Конец ленты */}
      {!hasMore && displayEvents.length > 0 && (
        <div className="py-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-purple-500/20">
            <span className="text-sm text-gray-400">🏁</span>
            <span className="text-sm text-gray-400">Вы просмотрели все события</span>
          </div>
        </div>
      )}
    </div>
  );
}


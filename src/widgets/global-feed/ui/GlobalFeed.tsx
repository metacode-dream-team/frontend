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
    <div className={cn(className)}>
      {isEmpty && (
        <p className="py-16 text-center text-sm text-zinc-500">Пока нет событий.</p>
      )}

      {isLoading && displayEvents.length === 0 && (
        <div className="divide-y divide-zinc-800/60">
          {Array.from({ length: 5 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      )}

      {displayEvents.length > 0 && (
        <div className="divide-y divide-zinc-800/60">
          {useGrouping
            ? groupedEvents.map((groupedEvent) => (
                <GroupedEventCard key={groupedEvent.userId + groupedEvent.createdAt} groupedEvent={groupedEvent} />
              ))
            : events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}

          {isLoading &&
            displayEvents.length > 0 &&
            Array.from({ length: 2 }).map((_, index) => (
              <EventCardSkeleton key={`loading-${index}`} />
            ))}
        </div>
      )}

      {hasMore && (
        <div ref={triggerRef} className="h-16" aria-hidden="true">
          {isLoading && displayEvents.length > 0 && (
            <p className="py-4 text-center text-xs text-zinc-600">Загрузка…</p>
          )}
        </div>
      )}

      {!hasMore && displayEvents.length > 0 && (
        <p className="py-8 text-center text-xs text-zinc-600">Конец ленты</p>
      )}
    </div>
  );
}


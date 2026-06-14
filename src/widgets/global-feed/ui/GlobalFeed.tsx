/**
 * Виджет глобальной ленты событий
 */

"use client";

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
  const { groupedEvents, events, isLoading, hasMore, error, reload, loadNextPage } = useFetchFeed();
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
      {error && (
        <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-6 text-center">
          <p className="text-sm text-red-300">Failed to load feed</p>
          <p className="mt-1 text-xs text-zinc-500">{error}</p>
          <button
            type="button"
            onClick={() => void reload()}
            className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-700"
          >
            Try again
          </button>
        </div>
      )}

      {!error && isEmpty && (
        <p className="py-16 text-center text-sm text-zinc-500">No events yet.</p>
      )}

      {!error && isLoading && displayEvents.length === 0 && (
        <div className="divide-y divide-zinc-800/60">
          {Array.from({ length: 5 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!error && displayEvents.length > 0 && (
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
            <p className="py-4 text-center text-xs text-zinc-600">Loading…</p>
          )}
        </div>
      )}

      {!hasMore && displayEvents.length > 0 && (
        <p className="py-8 text-center text-xs text-zinc-600">End of feed</p>
      )}
    </div>
  );
}


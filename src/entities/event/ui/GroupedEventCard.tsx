/**
 * Компонент карточки группированного события
 * Отображает несколько событий одного пользователя вместе
 */

import Link from "next/link";
import { Avatar } from "@/shared/ui/Avatar";
import { EventCard } from "./EventCard";
import { formatTimeAgo } from "@/shared/lib/utils/formatTime";
import { cn } from "@/shared/lib/utils/cn";
import type { GroupedEvent } from "../model/types";

interface GroupedEventCardProps {
  groupedEvent: GroupedEvent;
  className?: string;
}

export function GroupedEventCard({ groupedEvent, className }: GroupedEventCardProps) {
  const isMultiple = groupedEvent.events.length > 1;

  if (!isMultiple) {
    return <EventCard event={groupedEvent.events[0]!} className={className} />;
  }

  return (
    <div className={cn(className)}>
      <div className="flex gap-3 sm:gap-4">
        <Link href={`/profile/${groupedEvent.userId}`} className="shrink-0 pt-0.5">
          <Avatar src={groupedEvent.userAvatar} alt={groupedEvent.username} size="sm" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm">
            <Link
              href={`/profile/${groupedEvent.userId}`}
              className="font-medium text-zinc-200 hover:text-white"
            >
              {groupedEvent.username}
            </Link>
            <span className="text-zinc-500">{groupedEvent.events.length} действий</span>
          </div>
          <p className="mt-0.5 text-xs text-zinc-600">{formatTimeAgo(groupedEvent.createdAt)}</p>
        </div>
      </div>

      <div className="mt-2 divide-y divide-zinc-800/40 border-t border-zinc-800/40 pl-11">
        {groupedEvent.events.map((event) => (
          <EventCard key={event.id} event={event} omitAvatar className="py-3 hover:bg-transparent" />
        ))}
      </div>
    </div>
  );
}


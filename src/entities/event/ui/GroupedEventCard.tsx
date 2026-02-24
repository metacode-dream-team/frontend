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

  return (
    <div className={cn("space-y-2", className)}>
      {/* Заголовок группы */}
      <div className="flex items-center gap-3 px-4">
        <Link href={`/profile/${groupedEvent.userId}`} className="flex-shrink-0">
          <Avatar src={groupedEvent.userAvatar} alt={groupedEvent.username} size="md" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${groupedEvent.userId}`}
              className="font-semibold text-white hover:text-purple-400 transition-colors"
            >
              {groupedEvent.username}
            </Link>
            {isMultiple && (
              <span className="text-sm text-gray-400">
                выполнил {groupedEvent.events.length} действий
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatTimeAgo(groupedEvent.createdAt)}
          </div>
        </div>
      </div>

      {/* События в группе */}
      <div className="space-y-1">
        {groupedEvent.events.map((event) => (
          <EventCard key={event.id} event={event} className="ml-12" />
        ))}
      </div>
    </div>
  );
}


/**
 * Базовый компонент карточки события
 */

import Link from "next/link";
import { Avatar } from "@/shared/ui/Avatar";
import { EventTypeIcon } from "./EventTypeIcon";
import { formatTimeAgo } from "@/shared/lib/utils/formatTime";
import { cn } from "@/shared/lib/utils/cn";
import type { FeedEvent } from "../model/types";

interface EventCardProps {
  event: FeedEvent;
  className?: string;
}

export function EventCard({ event, className }: EventCardProps) {
  const content = renderEventContent(event);

  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-lg border border-gray-800 bg-gray-900/50 hover:bg-gray-900 transition-colors",
        className,
      )}
    >
      {/* Аватар */}
      <Link href={`/profile/${event.userId}`} className="flex-shrink-0">
        <Avatar src={event.userAvatar} alt={event.username} size="md" />
      </Link>

      {/* Контент */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-3">
          {/* Иконка типа события */}
          <div className="flex-shrink-0 mt-1">
            <EventTypeIcon type={event.type} />
          </div>

          {/* Текст события */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href={`/profile/${event.userId}`}
                className="font-semibold text-white hover:text-purple-400 transition-colors"
              >
                {event.username}
              </Link>
              <span className="text-gray-400">{content.text}</span>
            </div>

            {/* Дополнительная информация */}
            {content.details && (
              <div className="mt-1 text-sm text-gray-300">{content.details}</div>
            )}

            {/* Время */}
            <div className="mt-2 text-xs text-gray-500">
              {formatTimeAgo(event.createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Рендерит контент события в зависимости от типа
 */
function renderEventContent(event: FeedEvent): {
  text: React.ReactNode;
  details?: React.ReactNode;
} {
  switch (event.type) {
    case "GITHUB_COMMIT":
      return {
        text: (
          <>
            совершил{" "}
            <span className="text-purple-400 font-medium">
              {event.payload.commitCount} коммит
              {event.payload.commitCount > 1 ? "ов" : ""}
            </span>{" "}
            в репозиторий
          </>
        ),
        details: (
          <Link
            href={event.payload.repositoryUrl || `#`}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {event.payload.repository}
          </Link>
        ),
      };

    case "LEETCODE_SOLVE":
      const difficultyColors = {
        Easy: "text-green-400",
        Medium: "text-yellow-400",
        Hard: "text-red-400",
      };
      return {
        text: (
          <>
            решил задачу{" "}
            <Link
              href={event.payload.problemSlug ? `/problems/${event.payload.problemSlug}` : `#`}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              {event.payload.problemTitle}
            </Link>
          </>
        ),
        details: (
          <span className={cn("font-medium", difficultyColors[event.payload.difficulty])}>
            {event.payload.difficulty}
          </span>
        ),
      };

    case "ROADMAP_CREATE":
      return {
        text: (
          <>
            создал новый роадмап{" "}
            <Link
              href={event.payload.roadmapSlug ? `/roadmaps/${event.payload.roadmapSlug}` : `#`}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              {event.payload.roadmapTitle}
            </Link>
          </>
        ),
      };

    case "ROADMAP_FAVORITE":
      return {
        text: (
          <>
            добавил в избранное роадмап{" "}
            <Link
              href={event.payload.roadmapSlug ? `/roadmaps/${event.payload.roadmapSlug}` : `#`}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              {event.payload.roadmapTitle}
            </Link>
          </>
        ),
      };

    case "MONKEYTYPE_RECORD":
      return {
        text: (
          <>
            установил новый рекорд:{" "}
            <span className="text-yellow-400 font-bold">{event.payload.wpm} WPM</span>
          </>
        ),
        details: (
          <span className="text-gray-400">
            режим {event.payload.mode}
            {event.payload.accuracy && ` • точность ${event.payload.accuracy}%`}
          </span>
        ),
      };

    case "DISCUSSION_CREATE":
      return {
        text: (
          <>
            создал дискуссию{" "}
            <Link
              href={event.payload.discussionSlug ? `/discussions/${event.payload.discussionSlug}` : `#`}
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              {event.payload.discussionTitle}
            </Link>
          </>
        ),
      };

    default:
      return { text: "выполнил действие" };
  }
}


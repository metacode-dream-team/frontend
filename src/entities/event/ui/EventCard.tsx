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
  /** Строка внутри группы: без аватара и имени (они в шапке группы) */
  omitAvatar?: boolean;
}

export function EventCard({ event, className, omitAvatar = false }: EventCardProps) {
  const content = renderEventContent(event);

  return (
    <article
      className={cn(
        "flex gap-3 py-4 transition-colors hover:bg-zinc-900/25 sm:gap-4",
        className,
      )}
    >
      {!omitAvatar && (
        <Link href={`/profile/${event.userId}`} className="shrink-0 pt-0.5">
          <Avatar src={event.userAvatar} alt={event.username} size="sm" />
        </Link>
      )}

      <div className="flex min-w-0 flex-1 gap-2.5 sm:gap-3">
        <div className="mt-0.5 shrink-0">
          <EventTypeIcon type={event.type} className="rounded-md bg-zinc-800/50 p-1.5 [&_svg]:size-4" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm leading-snug text-zinc-400">
            <span className="text-zinc-500">{formatTimeAgo(event.createdAt)}</span>
            {!omitAvatar && (
              <>
                {" "}
                <Link
                  href={`/profile/${event.userId}`}
                  className="font-medium text-zinc-200 hover:text-white"
                >
                  {event.username}
                </Link>
              </>
            )}
            {" "}
            {content.text}
          </p>

          {content.details && (
            <div className="mt-1 text-sm leading-snug text-zinc-500">{content.details}</div>
          )}
        </div>
      </div>
    </article>
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
            <span className="font-medium text-zinc-300">
              {event.payload.commitCount} коммит
              {event.payload.commitCount > 1 ? "ов" : ""}
            </span>{" "}
            в репозиторий
          </>
        ),
        details: (
          <Link
            href={event.payload.repositoryUrl || `#`}
            className="text-blue-500 hover:text-blue-400"
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
              className="font-medium text-blue-500 hover:text-blue-400"
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
              className="font-medium text-blue-500 hover:text-blue-400"
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
              className="font-medium text-blue-500 hover:text-blue-400"
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
              className="font-medium text-blue-500 hover:text-blue-400"
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


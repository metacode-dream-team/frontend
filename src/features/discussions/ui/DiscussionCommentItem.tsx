"use client";

import Link from "next/link";
import { Avatar } from "@/shared/ui/Avatar";
import { formatTimeAgo } from "@/shared/lib/utils/formatTime";
import { cn } from "@/shared/lib/utils/cn";
import type { DiscussionComment, ReactionKind } from "@/entities/discussion";
import { ReactionBar } from "./ReactionBar";

interface DiscussionCommentItemProps {
  comment: DiscussionComment;
  index: number;
  currentUserId?: string | null;
  onToggleReaction?: (commentId: string, kind: ReactionKind) => void;
  className?: string;
}

function profileHref(username: string): string {
  const slug = username.trim();
  return slug ? `/profile/${encodeURIComponent(slug)}` : "/profile";
}

export function DiscussionCommentItem({
  comment,
  index,
  currentUserId,
  onToggleReaction,
  className,
}: DiscussionCommentItemProps) {
  const activeKind = currentUserId ? comment.userReactions[currentUserId] ?? null : null;

  return (
    <article
      className={cn(
        "border border-zinc-800/70 bg-zinc-950/40 px-4 py-3 sm:px-5 sm:py-4",
        className,
      )}
    >
      <div className="flex gap-3">
        <Link href={profileHref(comment.author.username)} className="shrink-0">
          <Avatar src={comment.author.avatarUrl} alt={comment.author.username} size="sm" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <Link
              href={profileHref(comment.author.username)}
              className="text-sm font-medium text-zinc-200 hover:text-white"
            >
              {comment.author.username}
            </Link>
            <span className="text-xs text-zinc-600">{formatTimeAgo(comment.createdAt)}</span>
          </div>

          <ReactionBar
            reactions={comment.reactions}
            activeKind={activeKind}
            onToggle={onToggleReaction ? (kind) => onToggleReaction(comment.id, kind) : undefined}
            compact
            className="mt-2"
          />

          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
            {comment.body}
          </p>
        </div>
        <span className="shrink-0 self-end text-xs text-zinc-600">#{index + 1}</span>
      </div>
    </article>
  );
}

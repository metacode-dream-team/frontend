"use client";

import { voteScore, type VoteKind } from "@/entities/discussion";
import { cn } from "@/shared/lib/utils/cn";

interface ReactionBarProps {
  upvotes: number;
  downvotes: number;
  isUpvoted?: boolean;
  isDownvoted?: boolean;
  onVote?: (kind: VoteKind) => void;
  compact?: boolean;
  className?: string;
}

export function ReactionBar({
  upvotes,
  downvotes,
  isUpvoted = false,
  isDownvoted = false,
  onVote,
  compact = false,
  className,
}: ReactionBarProps) {
  const interactive = Boolean(onVote);
  const score = voteScore(upvotes, downvotes);

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      <button
        type="button"
        title="Нравится"
        disabled={!interactive}
        onClick={() => onVote?.("up")}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border text-xs transition-colors",
          compact ? "px-1.5 py-0.5" : "px-2 py-1",
          interactive && "cursor-pointer hover:border-emerald-500/40 hover:bg-emerald-950/30",
          !interactive && "cursor-default",
          isUpvoted
            ? "border-emerald-500/60 bg-emerald-950/40 text-emerald-100"
            : "border-zinc-700/80 bg-zinc-900/60 text-zinc-300",
        )}
      >
        <span aria-hidden>👍</span>
        {upvotes > 0 ? <span className="tabular-nums">{upvotes}</span> : null}
      </button>

      <button
        type="button"
        title="Не нравится"
        disabled={!interactive}
        onClick={() => onVote?.("down")}
        className={cn(
          "inline-flex items-center gap-1 rounded-md border text-xs transition-colors",
          compact ? "px-1.5 py-0.5" : "px-2 py-1",
          interactive && "cursor-pointer hover:border-rose-500/40 hover:bg-rose-950/30",
          !interactive && "cursor-default",
          isDownvoted
            ? "border-rose-500/60 bg-rose-950/40 text-rose-100"
            : "border-zinc-700/80 bg-zinc-900/60 text-zinc-300",
        )}
      >
        <span aria-hidden>👎</span>
        {downvotes > 0 ? <span className="tabular-nums">{downvotes}</span> : null}
      </button>

      {!compact ? (
        <span
          className={cn(
            "ml-1 text-[11px] tabular-nums",
            score > 0 ? "text-emerald-400" : score < 0 ? "text-rose-400" : "text-zinc-500",
          )}
        >
          {score > 0 ? `+${score}` : score} очков
        </span>
      ) : null}
    </div>
  );
}

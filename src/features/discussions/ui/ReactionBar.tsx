"use client";

import { REACTION_KINDS, totalReactions, type ReactionKind } from "@/entities/discussion";
import { cn } from "@/shared/lib/utils/cn";

interface ReactionBarProps {
  reactions: Record<ReactionKind, number>;
  activeKind?: ReactionKind | null;
  onToggle?: (kind: ReactionKind) => void;
  compact?: boolean;
  className?: string;
}

export function ReactionBar({
  reactions,
  activeKind,
  onToggle,
  compact = false,
  className,
}: ReactionBarProps) {
  const total = totalReactions(reactions);
  const interactive = Boolean(onToggle);

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {REACTION_KINDS.map((kind) => {
        const count = reactions[kind.id];
        const active = activeKind === kind.id;
        if (!interactive && count === 0) return null;

        return (
          <button
            key={kind.id}
            type="button"
            title={kind.label}
            disabled={!interactive}
            onClick={() => onToggle?.(kind.id)}
            className={cn(
              "inline-flex items-center gap-1 rounded-md border text-xs transition-colors",
              compact ? "px-1.5 py-0.5" : "px-2 py-1",
              interactive && "cursor-pointer hover:border-violet-500/40 hover:bg-violet-950/30",
              !interactive && "cursor-default",
              active
                ? "border-violet-500/60 bg-violet-950/40 text-violet-100"
                : "border-zinc-700/80 bg-zinc-900/60 text-zinc-300",
            )}
          >
            <span aria-hidden>{kind.emoji}</span>
            {count > 0 ? <span className="tabular-nums">{count}</span> : null}
          </button>
        );
      })}
      {!compact && total > 0 ? (
        <span className="ml-1 text-[11px] text-zinc-500">{total} реакций</span>
      ) : null}
    </div>
  );
}

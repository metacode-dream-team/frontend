"use client";

import { useState } from "react";

import { cn } from "@/shared/lib/utils/cn";

import { SolvedProgressRing } from "./solved-progress-ring";

type DifficultyTone = "easy" | "medium" | "hard";

interface SolvedProgressCardProps {
  solved: number;
  total: number;
  attempting: number;
  easySolved: number;
  easyTotal: number;
  mediumSolved: number;
  mediumTotal: number;
  hardSolved: number;
  hardTotal: number;
}

export function SolvedProgressCard(props: SolvedProgressCardProps) {
  const [focusedZone, setFocusedZone] = useState<DifficultyTone | null>(null);

  return (
    <div
      className="flex w-full flex-1 flex-col items-center gap-3 max-lg:gap-4 lg:flex-row lg:items-center lg:gap-0.5 xl:min-h-0"
      onMouseLeave={() => setFocusedZone(null)}
    >
      <div className="shrink-0 max-lg:mx-auto xl:ml-4">
        <SolvedProgressRing {...props} focusedZone={focusedZone} />
      </div>
      <div className="grid w-full max-w-[320px] grid-cols-3 gap-1.5 max-lg:max-w-none max-lg:px-1 lg:ml-auto lg:flex lg:w-[36%] lg:min-w-[88px] lg:max-w-[116px] lg:flex-col lg:gap-1.5 sm:max-w-[128px] sm:gap-2 xl:mr-4">
        <DifficultyStat
          label="EASY"
          tone="easy"
          solved={props.easySolved}
          total={props.easyTotal}
          active={focusedZone === "easy"}
          onHover={() => setFocusedZone("easy")}
        />
        <DifficultyStat
          label="MED."
          tone="medium"
          solved={props.mediumSolved}
          total={props.mediumTotal}
          active={focusedZone === "medium"}
          onHover={() => setFocusedZone("medium")}
        />
        <DifficultyStat
          label="HARD"
          tone="hard"
          solved={props.hardSolved}
          total={props.hardTotal}
          active={focusedZone === "hard"}
          onHover={() => setFocusedZone("hard")}
        />
      </div>
    </div>
  );
}

function DifficultyStat({
  label,
  tone,
  solved,
  total,
  active,
  onHover,
}: {
  label: string;
  tone: DifficultyTone;
  solved: number;
  total: number;
  active?: boolean;
  onHover: () => void;
}) {
  const labelClass =
    tone === "easy" ? "text-emerald-400" : tone === "medium" ? "text-amber-300" : "text-rose-400";

  const activeRingClass =
    tone === "easy"
      ? "ring-emerald-500/45"
      : tone === "medium"
        ? "ring-amber-400/45"
        : "ring-rose-400/45";

  return (
    <div
      role="presentation"
      onMouseEnter={onHover}
      onFocus={onHover}
      onTouchStart={onHover}
      className={cn(
        "cursor-default rounded-lg bg-zinc-800/80 px-2 py-2.5 text-center transition-all duration-300 ease-out max-lg:min-h-11 max-lg:py-3 lg:py-2",
        "hover:scale-[1.02] hover:bg-zinc-800",
        active && "scale-[1.04] bg-zinc-700/90 ring-1",
        active && activeRingClass,
      )}
    >
      <p className={`text-[10px] font-semibold tracking-wide ${labelClass}`}>{label}</p>
      <p className="mt-0.5 text-sm font-bold tabular-nums text-white">
        {solved}
        <span className="text-xs font-semibold text-zinc-500">/{total}</span>
      </p>
    </div>
  );
}

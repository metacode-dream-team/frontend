import { cn } from "@/shared/lib/utils/cn";

interface StreakBadgeProps {
  count: number;
  /** Активность засчитана сегодня — огонёк «горит» */
  activeToday: boolean;
  className?: string;
}

function FlameIcon({ lit }: { lit: boolean }) {
  return (
    <img
      src="/fire.svg"
      alt=""
      width={14}
      height={14}
      className={cn(
        "shrink-0",
        lit
          ? "[filter:invert(55%)_sepia(95%)_saturate(1400%)_hue-rotate(350deg)_brightness(105%)]"
          : "opacity-45 brightness-0 invert",
      )}
      aria-hidden
    />
  );
}

export function StreakBadge({ count, activeToday, className }: StreakBadgeProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-1 tabular-nums", className)}
      title={activeToday ? `${count} day streak` : "No activity today"}
      aria-label={`Streak: ${count}${activeToday ? ", active today" : ""}`}
    >
      <FlameIcon lit={activeToday} />
      <span
        className={cn(
          "text-sm font-medium leading-none",
          activeToday ? "text-zinc-200" : "text-zinc-400",
        )}
      >
        {count}
      </span>
    </span>
  );
}

"use client";

import { useMemo, type ReactNode } from "react";
import type { ProfileHeatmapDay } from "@/entities/profile";
import {
  countToHeatmapLevel,
  HEATMAP_MAX_COUNT,
  heatmapCountClass,
  heatmapLevelClass,
  heatmapLevelRange,
} from "@/shared/lib/utils/calendarHeatmapLevels";

interface SubmissionHeatmapProps {
  heatmap: ProfileHeatmapDay[];
  currentStreak: number;
  maxStreak: number;
}

export function SubmissionHeatmap({ heatmap, currentStreak, maxStreak }: SubmissionHeatmapProps) {
  const totalYearSubmissions = heatmap.reduce((acc, day) => acc + day.count, 0);
  const activeDays = heatmap.filter((day) => day.count > 0).length;

  const heatmapLayout = useMemo(() => {
    const points = [...heatmap].sort((a, b) => a.date.localeCompare(b.date));
    const firstDate = new Date(`${points[0]?.date ?? ""}T00:00:00`);
    const leadingEmpty = Number.isNaN(firstDate.getTime()) ? 0 : firstDate.getDay();

    const cells: Array<{ date: string; count: number } | null> = [
      ...Array.from({ length: leadingEmpty }, () => null),
      ...points,
    ];

    const weekCount = Math.ceil(cells.length / 7);
    const monthLabels: Array<{ label: string; column: number }> = [];

    points.forEach((point, index) => {
      const date = new Date(`${point.date}T00:00:00`);
      if (Number.isNaN(date.getTime())) return;

      if (index === 0 || date.getDate() === 1) {
        const column = Math.floor((leadingEmpty + index) / 7);
        const label = date.toLocaleString("en-US", { month: "short" });
        const alreadyAdded = monthLabels.some((item) => item.column === column);
        if (!alreadyAdded) {
          monthLabels.push({ label, column });
        }
      }
    });

    return { cells, weekCount, monthLabels };
  }, [heatmap]);

  return (
    <ProfileHeatmapCard
      title={`${totalYearSubmissions} submissions in the past one year`}
      metaRight={
        <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-xs text-zinc-500">
            <span>
              Total active days: <span className="font-medium text-zinc-300">{activeDays}</span>
            </span>
            <span>
              Current streak: <span className="font-medium text-zinc-300">{currentStreak}</span>
            </span>
            <span>
              Max streak: <span className="font-medium text-zinc-300">{maxStreak}</span>
            </span>
          </div>
          <label className="sr-only" htmlFor="heatmap-range">
            Time range
          </label>
          <select
            id="heatmap-range"
            defaultValue="current"
            className="rounded-lg bg-zinc-950 px-2 py-1.5 text-xs text-zinc-300 outline-none transition-colors hover:bg-zinc-800/80 focus-visible:ring-2 focus-visible:ring-[#9900FF]/40"
          >
            <option value="current">Current</option>
            <option value="year">Past year</option>
          </select>
        </div>
      }
    >
      <div className="overflow-x-auto rounded-xl bg-black/40 p-3">
        <div className="min-w-[760px]">
          <div className="grid grid-flow-col grid-rows-7 gap-[3px]">
            {heatmapLayout.cells.map((day, index) => {
              if (!day) {
                return <div key={`empty-${index}`} className="h-3 w-3 rounded-sm opacity-0" />;
              }
              const level = countToHeatmapLevel(day.count);
              return (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} · level ${level} (${heatmapLevelRange(level)}) · cap ${HEATMAP_MAX_COUNT}`}
                  className={`h-3 w-3 rounded-sm ${heatmapCountClass(day.count, "zinc")} transition-opacity hover:opacity-90`}
                />
              );
            })}
          </div>

          <div className="relative mt-3 h-6">
            {heatmapLayout.monthLabels.map((month) => {
              const left =
                heatmapLayout.weekCount > 1 ? (month.column / (heatmapLayout.weekCount - 1)) * 100 : 0;

              return (
                <span
                  key={`${month.label}-${month.column}`}
                  className="absolute -translate-x-1/2 text-[11px] text-zinc-500"
                  style={{ left: `${left}%` }}
                >
                  {month.label}
                </span>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-end gap-2 text-[11px] text-zinc-500">
            <span>Less</span>
            <div className="flex gap-1">
              {([0, 1, 2, 3, 4] as const).map((lv) => (
                <span
                  key={lv}
                  className={`h-3 w-3 rounded-sm ${heatmapLevelClass(lv, "zinc")}`}
                  title={heatmapLevelRange(lv)}
                />
              ))}
            </div>
            <span>More</span>
            <span className="text-zinc-600">(max {HEATMAP_MAX_COUNT})</span>
          </div>
        </div>
      </div>
    </ProfileHeatmapCard>
  );
}

function ProfileHeatmapCard({
  title,
  metaRight,
  children,
}: {
  title: string;
  metaRight: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-zinc-900/55 p-5 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-[2px]">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
        {metaRight}
      </div>
      {children}
    </section>
  );
}

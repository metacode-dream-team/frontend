"use client";

import { useMemo, useState } from "react";
import type { ActivityDay } from "@/entities/stats";
import {
  ActivitySourceFilter,
  type ActivityFilterValue,
} from "@/features/filter-activity-calendar";
import {
  countToHeatmapLevel,
  HEATMAP_MAX_COUNT,
  heatmapCountClass,
  heatmapLevelClass,
  heatmapLevelRange,
} from "@/shared/lib/utils/calendarHeatmapLevels";

interface ActivityHeatmapProps {
  data: ActivityDay[];
}

function lastDays(days: number): string[] {
  const now = new Date();
  const list: string[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    list.push(d.toISOString().slice(0, 10));
  }

  return list;
}

export function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const [filter, setFilter] = useState<ActivityFilterValue>("all");

  const daily = useMemo(() => {
    const map = new Map<string, number>();

    for (const item of data) {
      if (filter !== "all" && item.source !== filter) continue;
      map.set(item.date, (map.get(item.date) ?? 0) + item.count);
    }

    return map;
  }, [data, filter]);

  const cells = useMemo(() => {
    return lastDays(365).map((date) => ({ date, count: daily.get(date) ?? 0 }));
  }, [daily]);

  const total = cells.reduce((acc, item) => acc + item.count, 0);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <ActivitySourceFilter value={filter} onChange={setFilter} />
        <p className="text-xs text-slate-400">Total: {total}</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/50 p-3">
        <div className="grid min-w-[760px] grid-flow-col grid-rows-7 gap-1">
          {cells.map((cell) => {
            const level = countToHeatmapLevel(cell.count);
            return (
              <div
                key={cell.date}
                title={`${cell.date}: ${cell.count} · level ${level} (${heatmapLevelRange(level)}) · cap ${HEATMAP_MAX_COUNT}`}
                className={`h-3 w-3 rounded-sm ${heatmapCountClass(cell.count, "emerald")}`}
              />
            );
          })}
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-end gap-2 text-[11px] text-slate-500">
          <span>Less</span>
          <div className="flex gap-1">
            {([0, 1, 2, 3, 4] as const).map((lv) => (
              <span
                key={lv}
                className={`h-3 w-3 rounded-sm ${heatmapLevelClass(lv, "emerald")}`}
                title={heatmapLevelRange(lv)}
              />
            ))}
          </div>
          <span>More</span>
          <span className="text-slate-600">(max {HEATMAP_MAX_COUNT})</span>
        </div>
      </div>
    </div>
  );
}

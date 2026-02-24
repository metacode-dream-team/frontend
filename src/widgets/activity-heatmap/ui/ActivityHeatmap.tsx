"use client";

import { useMemo, useState } from "react";
import type { ActivityDay } from "@/entities/stats";
import {
  ActivitySourceFilter,
  type ActivityFilterValue,
} from "@/features/filter-activity-calendar";

interface ActivityHeatmapProps {
  data: ActivityDay[];
}

function getIntensityClass(count: number): string {
  if (count === 0) return "bg-slate-800";
  if (count <= 2) return "bg-emerald-900";
  if (count <= 5) return "bg-emerald-700";
  if (count <= 8) return "bg-emerald-500";
  return "bg-emerald-300";
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
          {cells.map((cell) => (
            <div
              key={cell.date}
              title={`${cell.date}: ${cell.count}`}
              className={`h-3 w-3 rounded-sm ${getIntensityClass(cell.count)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

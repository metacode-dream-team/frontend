"use client";

import { useMemo, type ReactNode } from "react";
import {
  type HeatmapSourceTab,
  type ProfileHeatmapBySource,
  type ProfileHeatmapDay,
  useSubmissionHeatmapStore,
} from "@/entities/profile";
import {
  countToHeatmapLevel,
  HEATMAP_MAX_COUNT,
  INTEGRATION_HEATMAP_CAP,
  heatmapCountClass,
  heatmapLevelClass,
  heatmapLevelRange,
} from "@/shared/lib/utils/calendarHeatmapLevels";

const SOURCE_TABS: { id: HeatmapSourceTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "github", label: "GitHub" },
  { id: "leetcode", label: "LeetCode" },
  { id: "monkeytype", label: "Monkeytype" },
];

interface SubmissionHeatmapProps {
  /** Стабильный ключ профиля (например username) для изоляции выбора вкладки в store */
  profileKey: string;
  heatmap: ProfileHeatmapDay[];
  /** Интеграция: max по дням + ряды по источнику; иначе только `heatmap` и шкала 30 */
  heatmapBySource?: ProfileHeatmapBySource;
  currentStreak: number;
  maxStreak: number;
}

type HeatmapCell = { date: string; count: number } | null;

interface MonthBlock {
  key: string;
  label: string;
  cells: HeatmapCell[];
}

function parseLocalDay(ymd: string): Date | null {
  const d = new Date(`${ymd}T12:00:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toYmd(y: number, m0: number, day: number): string {
  return `${y}-${String(m0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildMonthBlocks(points: ProfileHeatmapDay[]): MonthBlock[] {
  if (points.length === 0) return [];

  const sorted = [...points].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map<string, number>();
  for (const p of sorted) {
    byDate.set(p.date, p.count);
  }

  const first = parseLocalDay(sorted[0]!.date);
  const last = parseLocalDay(sorted[sorted.length - 1]!.date);
  if (!first || !last) return [];

  const blocks: MonthBlock[] = [];
  const cursor = new Date(first.getFullYear(), first.getMonth(), 1);
  const endAnchor = new Date(last.getFullYear(), last.getMonth(), 1);

  while (cursor.getTime() <= endAnchor.getTime()) {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    const dim = new Date(y, m + 1, 0).getDate();
    const startPad = new Date(y, m, 1).getDay();

    const cells: HeatmapCell[] = [];
    for (let i = 0; i < startPad; i++) {
      cells.push(null);
    }
    for (let day = 1; day <= dim; day++) {
      const date = toYmd(y, m, day);
      cells.push({ date, count: byDate.get(date) ?? 0 });
    }
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    blocks.push({
      key: `${y}-${String(m + 1).padStart(2, "0")}`,
      label: cursor.toLocaleString("en-US", { month: "short" }),
      cells,
    });

    cursor.setMonth(cursor.getMonth() + 1);
  }

  return blocks;
}

function disambiguateMonthLabels(blocks: MonthBlock[]): MonthBlock[] {
  const yearsByLabel = new Map<string, Set<number>>();
  for (const b of blocks) {
    const y = Number(b.key.slice(0, 4));
    let set = yearsByLabel.get(b.label);
    if (!set) {
      set = new Set<number>();
      yearsByLabel.set(b.label, set);
    }
    set.add(y);
  }
  return blocks.map((b) => {
    const y = Number(b.key.slice(0, 4));
    const set = yearsByLabel.get(b.label);
    if (!set || set.size <= 1) return b;
    return { ...b, label: `${b.label} '${String(y).slice(-2)}` };
  });
}

function selectHeatmapForTab(
  tab: HeatmapSourceTab,
  fallback: ProfileHeatmapDay[],
  bySource?: ProfileHeatmapBySource,
): ProfileHeatmapDay[] {
  if (!bySource) return fallback;
  if (tab === "all") return bySource.combinedMax;
  return bySource[tab];
}

export function SubmissionHeatmap({
  profileKey,
  heatmap,
  heatmapBySource,
  currentStreak,
  maxStreak,
}: SubmissionHeatmapProps) {
  const sourceTab = useSubmissionHeatmapStore(
    (s) => s.tabByProfileKey[profileKey] ?? "all",
  );
  const setSourceTab = useSubmissionHeatmapStore((s) => s.setSourceTab);

  const cap = heatmapBySource ? INTEGRATION_HEATMAP_CAP[sourceTab] : HEATMAP_MAX_COUNT;

  const activeHeatmap = useMemo(
    () => selectHeatmapForTab(sourceTab, heatmap, heatmapBySource),
    [heatmap, heatmapBySource, sourceTab],
  );

  const totalYearSubmissions = activeHeatmap.reduce((acc, day) => acc + day.count, 0);
  const activeDays = activeHeatmap.filter((day) => day.count > 0).length;

  const monthBlocks = useMemo(
    () => disambiguateMonthLabels(buildMonthBlocks(activeHeatmap)),
    [activeHeatmap],
  );

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
      {heatmapBySource ? (
        <div className="mb-3 flex flex-wrap gap-1" role="tablist" aria-label="Activity source">
          {SOURCE_TABS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={sourceTab === id}
              onClick={() => {
                setSourceTab(profileKey, id);
              }}
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9900FF]/40 ${
                sourceTab === id
                  ? "bg-zinc-100 text-zinc-900"
                  : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      ) : null}
      <div className="w-full rounded-xl bg-black/40 px-1.5 py-2 sm:px-2 sm:py-3">
        {monthBlocks.length === 0 ? (
          <p className="py-6 text-center text-sm text-zinc-500">No activity in this period.</p>
        ) : (
          <div className="flex w-full min-w-0 justify-center overflow-x-auto pb-0.5 [-webkit-overflow-scrolling:touch]">
            <div className="flex min-w-min flex-nowrap items-end justify-center gap-x-1 sm:gap-x-1.5 md:gap-x-2">
              {monthBlocks.map((block) => (
                <div
                  key={block.key}
                  className="flex shrink-0 flex-col items-center justify-end gap-1"
                >
                  <div className="grid w-max grid-flow-col grid-rows-7 gap-px sm:gap-0.5 md:gap-[2px] lg:gap-[3px]">
                    {block.cells.map((cell, index) => {
                      if (!cell) {
                        return (
                          <div
                            key={`${block.key}-pad-${index}`}
                            className="pointer-events-none size-[3px] shrink-0 select-none rounded-[1px] opacity-0 sm:size-1.5 md:size-2 lg:size-2.5 xl:size-3"
                            aria-hidden
                          />
                        );
                      }
                      const level = countToHeatmapLevel(cell.count, cap);
                      return (
                        <div
                          key={cell.date}
                          title={`${cell.date}: ${cell.count} · level ${level} (${heatmapLevelRange(level, cap)}) · cap ${cap}`}
                          className={`size-[3px] shrink-0 rounded-[1px] sm:size-1.5 md:size-2 lg:size-2.5 xl:size-3 ${heatmapCountClass(cell.count, "zinc", cap)} transition-opacity hover:opacity-90`}
                        />
                      );
                    })}
                  </div>
                  <span className="whitespace-nowrap text-center text-[9px] font-medium leading-none tracking-tight text-zinc-500 sm:text-[10px] md:text-[11px]">
                    {block.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 flex flex-wrap items-center justify-end gap-1.5 text-[9px] text-zinc-500 sm:mt-4 sm:gap-2 sm:text-[10px] md:text-[11px]">
          <span>Less</span>
          <div className="flex gap-px sm:gap-0.5">
            {([0, 1, 2, 3, 4] as const).map((lv) => (
              <span
                key={lv}
                className={`size-[3px] rounded-[1px] sm:size-1.5 md:size-2 lg:size-2.5 xl:size-3 ${heatmapLevelClass(lv, "zinc")}`}
                title={heatmapLevelRange(lv, cap)}
              />
            ))}
          </div>
          <span>More</span>
          <span className="text-zinc-600">(max {cap})</span>
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

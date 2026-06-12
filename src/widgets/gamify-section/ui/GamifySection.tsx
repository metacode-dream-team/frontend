"use client";

import { useState, useMemo } from "react";
import { generateActivityData } from "@/shared/lib/api/mockActivityData";
import {
  countToHeatmapLevel,
  heatmapCountClass,
  heatmapLevelClass,
  heatmapLevelRange,
  INTEGRATION_HEATMAP_CAP,
} from "@/shared/lib/utils/calendarHeatmapLevels";

const CARD_STYLE =
  "rounded-2xl bg-neutral-900/50 backdrop-blur-xl p-6 shadow-xl";

const PLATFORM_BREAKDOWN = [
  {
    platform: "GitHub",
    value: "42 commits",
    detail: "Last 30 days across connected repos",
    progress: 72,
    barClass: "from-emerald-600 to-emerald-400",
  },
  {
    platform: "LeetCode",
    value: "18 solved",
    detail: "3 easy · 9 medium · 6 hard",
    progress: 58,
    barClass: "from-violet-600 to-purple-500",
  },
  {
    platform: "Monkeytype",
    value: "118 WPM",
    detail: "96% accuracy · 15s mode",
    progress: 81,
    barClass: "from-orange-600 to-orange-400",
  },
] as const;

const ACHIEVEMENTS = [
  {
    id: "streak",
    title: "50-day solving streak",
    description: "At least one accepted solution every day for 50 days.",
    tone: "bg-emerald-500/20 text-emerald-400",
  },
  {
    id: "first",
    title: "First acceptance",
    description: "Your first accepted submission on LeetCode.",
    tone: "bg-violet-500/20 text-violet-400",
  },
  {
    id: "wpm",
    title: "100 WPM club",
    description: "Reached 100+ words per minute on Monkeytype.",
    tone: "bg-orange-500/20 text-orange-400",
  },
] as const;

function StreakPreviewCard() {
  return (
    <div className={CARD_STYLE}>
      <p className="text-sm font-medium text-zinc-400">Daily streak</p>
      <div className="mt-3 flex items-center gap-3">
        <img
          src="/fire.svg"
          alt=""
          width={28}
          height={28}
          className="shrink-0 [filter:invert(55%)_sepia(95%)_saturate(1400%)_hue-rotate(350deg)_brightness(105%)]"
          aria-hidden
        />
        <p className="text-4xl font-bold tabular-nums text-white">12</p>
      </div>
      <p className="mt-2 text-sm text-zinc-500">
        Active today — commit, solve, or practice to keep it going.
      </p>
    </div>
  );
}

function PlatformBreakdown() {
  return (
    <div className="mt-8 space-y-5">
      {PLATFORM_BREAKDOWN.map((item) => (
        <div
          key={item.platform}
          className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-4 py-4 sm:px-5"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-white">{item.platform}</p>
              <p className="mt-0.5 text-xs text-zinc-500">{item.detail}</p>
            </div>
            <p className="text-lg font-bold tabular-nums text-zinc-100">{item.value}</p>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-800">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${item.barClass}`}
              style={{ width: `${item.progress}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

const HEATMAP_MONTHS = 9;
const DEMO_HEATMAP_DATA = generateActivityData(HEATMAP_MONTHS * 31);

type HeatmapCell = { date: string; count: number } | null;

type MonthBlock = {
  key: string;
  label: string;
  cells: HeatmapCell[];
};

function toYmd(y: number, m0: number, day: number): string {
  return `${y}-${String(m0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildContributionMonthBlocks(
  byDate: Map<string, number>,
  months = HEATMAP_MONTHS,
): MonthBlock[] {
  const now = new Date();
  const endAnchor = new Date(now.getFullYear(), now.getMonth(), 1);
  const startAnchor = new Date(
    endAnchor.getFullYear(),
    endAnchor.getMonth() - (months - 1),
    1,
  );

  const blocks: MonthBlock[] = [];
  const cursor = new Date(startAnchor.getFullYear(), startAnchor.getMonth(), 1);

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
  for (const block of blocks) {
    const year = Number(block.key.slice(0, 4));
    let set = yearsByLabel.get(block.label);
    if (!set) {
      set = new Set<number>();
      yearsByLabel.set(block.label, set);
    }
    set.add(year);
  }

  return blocks.map((block) => {
    const year = Number(block.key.slice(0, 4));
    const set = yearsByLabel.get(block.label);
    if (!set || set.size <= 1) return block;
    return { ...block, label: `${block.label} '${String(year).slice(-2)}` };
  });
}

function ContributionHeatmapCard({
  heatmapData,
}: {
  heatmapData: { date: string; source: string; count: number }[];
}) {
  const [source, setSource] = useState<"github" | "leetcode">("github");
  return (
    <div className={`${CARD_STYLE} mt-6`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-bold text-white">Contribution Heatmap</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Activity across connected platforms over the last {HEATMAP_MONTHS} months.
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5 self-start sm:self-center">
          {(["github", "leetcode"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`min-h-11 rounded-md px-3 py-2 text-xs font-medium transition-colors sm:min-h-0 sm:px-2.5 sm:py-1 ${
                source === s
                  ? "bg-zinc-100 text-zinc-900"
                  : "bg-zinc-800/80 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              }`}
            >
              {s === "github" ? "GitHub" : "LeetCode"}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 w-full">
        <ContributionHeatmap data={heatmapData} source={source} />
      </div>
    </div>
  );
}

function ContributionHeatmap({
  data,
  source,
}: {
  data: { date: string; source: string; count: number }[];
  source: "github" | "leetcode";
}) {
  const cap = INTEGRATION_HEATMAP_CAP[source];

  const monthBlocks = useMemo(() => {
    const byDate = new Map<string, number>();
    for (const item of data) {
      if (item.source !== source) continue;
      byDate.set(item.date, (byDate.get(item.date) ?? 0) + item.count);
    }
    return disambiguateMonthLabels(buildContributionMonthBlocks(byDate));
  }, [data, source]);

  return (
    <div className="w-full space-y-4">
      <div className="overflow-x-auto pb-1 snap-x snap-mandatory scroll-smooth [-webkit-overflow-scrolling:touch]">
        <div className="flex w-full min-w-max flex-nowrap items-end justify-between px-4 sm:px-6">
          {monthBlocks.map((block) => (
            <div
              key={block.key}
              className="flex shrink-0 snap-center flex-col items-center justify-end gap-2"
            >
              <div className="grid w-max grid-flow-col grid-rows-7 gap-1 sm:gap-1.5">
                {block.cells.map((cell, index) => {
                  if (!cell) {
                    return (
                      <div
                        key={`${block.key}-pad-${index}`}
                        className="pointer-events-none size-3 shrink-0 select-none rounded-sm opacity-0 sm:size-3.5 md:size-4"
                        aria-hidden
                      />
                    );
                  }
                  const level = countToHeatmapLevel(cell.count, cap);
                  return (
                    <div
                      key={cell.date}
                      title={`${cell.date}: ${cell.count} · level ${level} (${heatmapLevelRange(level, cap)})`}
                      className={`size-3 shrink-0 rounded-sm sm:size-3.5 md:size-4 ${heatmapCountClass(cell.count, "zinc", cap)} transition-opacity hover:opacity-90`}
                    />
                  );
                })}
              </div>
              <span className="whitespace-nowrap text-center text-[10px] font-medium leading-none text-zinc-500 sm:text-xs">
                {block.label}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-end gap-1.5 text-[10px] text-zinc-500 sm:text-[11px]">
        <span>Less</span>
        <div className="flex gap-1">
          {([0, 1, 2, 3, 4] as const).map((lv) => (
            <span
              key={lv}
              className={`size-3 rounded-sm sm:size-3.5 ${heatmapLevelClass(lv, "zinc")}`}
              title={heatmapLevelRange(lv, cap)}
            />
          ))}
        </div>
        <span>More</span>
        <span className="text-zinc-600">(max {cap})</span>
      </div>
    </div>
  );
}

export function GamifySection() {
  return (
    <section className="bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Gamify Your Growth</h2>
          <p className="mt-3 text-zinc-400">
            GitHub commits, LeetCode solves, and Monkeytype sessions — synced into one profile.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Platform activity - large left card */}
          <div className={`${CARD_STYLE} lg:col-span-2`}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Platform Activity</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  Live stats pulled from your connected GitHub, LeetCode, and Monkeytype accounts.
                </p>
              </div>
              <span className="rounded-full bg-emerald-600/20 px-3 py-1 text-xs font-medium text-emerald-400">
                Synced
              </span>
            </div>
            <PlatformBreakdown />
          </div>

          {/* Right column: streak + achievements */}
          <div className="flex flex-col gap-6">
            <StreakPreviewCard />

            <div className={`${CARD_STYLE} flex-1`}>
              <h3 className="text-lg font-bold text-white">Achievements</h3>
              <p className="mt-1 text-sm text-zinc-500">Unlocked from your platform activity.</p>
              <div className="mt-4 space-y-3">
                {ACHIEVEMENTS.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 rounded-xl bg-zinc-950/50 p-3"
                  >
                    <span
                      className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${a.tone}`}
                      aria-hidden
                    >
                      ✓
                    </span>
                    <div>
                      <p className="font-semibold text-white">{a.title}</p>
                      <p className="text-xs text-zinc-500">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Heatmap - full width */}
        <ContributionHeatmapCard heatmapData={DEMO_HEATMAP_DATA} />
      </div>
    </section>
  );
}

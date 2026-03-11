"use client";

import { useState, useMemo } from "react";
import { generateActivityData } from "@/shared/lib/api/dashboardApi";

const CARD_STYLE =
  "rounded-2xl bg-neutral-900/50 backdrop-blur-xl p-6 shadow-xl";

// Mock radar data: Frontend, Backend, DevOps, Security, Algorithms, Soft Skills (0-100)
const RADAR_DIMENSIONS = [
  { label: "Frontend", value: 85 },
  { label: "Backend", value: 72 },
  { label: "DevOps", value: 58 },
  { label: "Security", value: 65 },
  { label: "Algorithms", value: 90 },
  { label: "Soft Skills", value: 78 },
];

// Простые SVG-иконки для достижений
const AchievementIcons = {
  bug: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  ),
  speed: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
      <path d="M4.5,5 L19.5,5 C20.8807119,5 22,6.11928813 22,7.5 L22,15.5 C22,16.8807119 20.8807119,18 19.5,18 L4.5,18 C3.11928813,18 2,16.8807119 2,15.5 L2,7.5 C2,6.11928813 3.11928813,5 4.5,5 Z M4.5,6 C3.67157288,6 3,6.67157288 3,7.5 L3,15.5 C3,16.3284271 3.67157288,17 4.5,17 L19.5,17 C20.3284271,17 21,16.3284271 21,15.5 L21,7.5 C21,6.67157288 20.3284271,6 19.5,6 L4.5,6 Z M5.5,9 C5.22385763,9 5,8.77614237 5,8.5 C5,8.22385763 5.22385763,8 5.5,8 L6.5,8 C6.77614237,8 7,8.22385763 7,8.5 C7,8.77614237 6.77614237,9 6.5,9 L5.5,9 Z M8.5,9 C8.22385763,9 8,8.77614237 8,8.5 C8,8.22385763 8.22385763,8 8.5,8 L9.5,8 C9.77614237,8 10,8.22385763 10,8.5 C10,8.77614237 9.77614237,9 9.5,9 L8.5,9 Z M11.5,9 C11.2238576,9 11,8.77614237 11,8.5 C11,8.22385763 11.2238576,8 11.5,8 L12.5,8 C12.7761424,8 13,8.22385763 13,8.5 C13,8.77614237 12.7761424,9 12.5,9 L11.5,9 Z M14.5,9 C14.2238576,9 14,8.77614237 14,8.5 C14,8.22385763 14.2238576,8 14.5,8 L15.5,8 C15.7761424,8 16,8.22385763 16,8.5 C16,8.77614237 15.7761424,9 15.5,9 L14.5,9 Z M17.5,9 C17.2238576,9 17,8.77614237 17,8.5 C17,8.22385763 17.2238576,8 17.5,8 L18.5,8 C18.7761424,8 19,8.22385763 19,8.5 C19,8.77614237 18.7761424,9 18.5,9 L17.5,9 Z M5.5,12 C5.22385763,12 5,11.7761424 5,11.5 C5,11.2238576 5.22385763,11 5.5,11 L6.5,11 C6.77614237,11 7,11.2238576 7,11.5 C7,11.7761424 6.77614237,12 6.5,12 L5.5,12 Z M8.5,12 C8.22385763,12 8,11.7761424 8,11.5 C8,11.2238576 8.22385763,11 8.5,11 L9.5,11 C9.77614237,11 10,11.2238576 10,11.5 C10,11.7761424 9.77614237,12 9.5,12 L8.5,12 Z M11.5,12 C11.2238576,12 11,11.7761424 11,11.5 C11,11.2238576 11.2238576,11 11.5,11 L12.5,11 C12.7761424,11 13,11.2238576 13,11.5 C13,11.7761424 12.7761424,12 12.5,12 L11.5,12 Z M14.5,12 C14.2238576,12 14,11.7761424 14,11.5 C14,11.2238576 14.2238576,11 14.5,11 L15.5,11 C15.7761424,11 16,11.2238576 16,11.5 C16,11.7761424 15.7761424,12 15.5,12 L14.5,12 Z M17.5,12 C17.2238576,12 17,11.7761424 17,11.5 C17,11.2238576 17.2238576,11 17.5,11 L18.5,11 C18.7761424,11 19,11.2238576 19,11.5 C19,11.7761424 18.7761424,12 18.5,12 L17.5,12 Z M5.5,15 C5.22385763,15 5,14.7761424 5,14.5 C5,14.2238576 5.22385763,14 5.5,14 L6.5,14 C6.77614237,14 7,14.2238576 7,14.5 C7,14.7761424 6.77614237,15 6.5,15 L5.5,15 Z M8.5,15 C8.22385763,15 8,14.7761424 8,14.5 C8,14.2238576 8.22385763,14 8.5,14 L15.5,14 C15.7761424,14 16,14.2238576 16,14.5 C16,14.7761424 15.7761424,15 15.5,15 L8.5,15 Z M17.5,15 C17.2238576,15 17,14.7761424 17,14.5 C17,14.2238576 17.2238576,14 17.5,14 L18.5,14 C18.7761424,14 19,14.2238576 19,14.5 C19,14.7761424 18.7761424,15 18.5,15 L17.5,15 Z" />
    </svg>
  ),
  target: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
};

const ACHIEVEMENTS = [
  {
    id: "1",
    title: "Bug Smasher",
    description: "Closed 50 issues on GitHub",
    icon: "bug",
    iconColor: "text-amber-400",
  },
  {
    id: "2",
    title: "Speed Demon",
    description: "Reached 120 WPM on Monkeytype",
    icon: "speed",
    iconColor: "text-blue-400",
  },
  {
    id: "3",
    title: "Algorithm Ace",
    description: "Solved 10 Hard problems in 24h",
    icon: "target",
    iconColor: "text-purple-400",
  },
];

function RadarChart({ data }: { data: { label: string; value: number }[] }) {
  const size = 340;
  const center = size / 2;
  const maxRadius = center - 50;
  const points = data.length;
  const gridStroke = "rgba(115,115,115,0.4)";

  const getPoint = (index: number, value: number) => {
    const angle = (index * 360) / points - 90;
    const rad = (angle * Math.PI) / 180;
    const r = (value / 100) * maxRadius;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad),
    };
  };

  const polygonPoints = data
    .map((d, i) => getPoint(i, d.value))
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  // 5 concentric rings (20%, 40%, 60%, 80%, 100%)
  const gridLevels = [1, 2, 3, 4, 5];

  return (
    <div className="relative" style={{ width: size, height: size + 50 }}>
      <svg width={size} height={size} className="mx-auto">
        {/* 5 concentric hexagonal rings */}
        {gridLevels.map((level) => (
          <polygon
            key={level}
            points={data
              .map((_, i) => getPoint(i, (level / 5) * 100))
              .map((p) => `${p.x},${p.y}`)
              .join(" ")}
            fill="none"
            stroke={gridStroke}
            strokeWidth="1"
          />
        ))}
        {/* Axis lines */}
        {data.map((_, i) => {
          const p = getPoint(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={p.x}
              y2={p.y}
              stroke={gridStroke}
              strokeWidth="1"
            />
          );
        })}
        {/* Solid purple fill — без неона, чётко видно данные */}
        <polygon points={polygonPoints} fill="rgb(88,28,135)" fillOpacity="0.65" />
        {/* Labels */}
        {data.map((d, i) => {
          const p = getPoint(i, 108);
          return (
            <text
              key={i}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              className="fill-zinc-400 text-xs"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function ContributionHeatmapCard({
  heatmapData,
}: {
  heatmapData: { date: string; source: string; count: number }[];
}) {
  const [source, setSource] = useState<"github" | "leetcode">("github");
  return (
    <div className={`${CARD_STYLE} mt-6`}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white">Contribution Heatmap</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Aggregate activity across all connected platforms over the last year.
          </p>
        </div>
        <div className="flex shrink-0 gap-1.5 self-center">
          {(["github", "leetcode"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSource(s)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                source === s ? "bg-purple-600 text-white" : "bg-white/5 text-zinc-400 hover:text-white"
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
  const { grid, maxCount, monthLabels } = useMemo(() => {
    const byDate: Record<string, number> = {};
    data
      .filter((d) => d.source === source)
      .forEach((d) => {
        byDate[d.date] = (byDate[d.date] || 0) + d.count;
      });
    const max = Math.max(...Object.values(byDate), 1);

    const start = new Date();
    start.setDate(start.getDate() - 364);
    const grid: number[][] = Array.from({ length: 7 }, () => Array(53).fill(0));
    const monthLabels: { col: number; label: string }[] = [];
    let lastMonth = -1;

    for (let i = 0; i <= 364; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const count = byDate[key] || 0;
      const col = Math.min(52, Math.floor(i / 7));
      const row = d.getDay();
      grid[row][col] = count;

      const m = d.getMonth();
      if (m !== lastMonth) {
        monthLabels.push({ col, label: MONTHS[m] });
        lastMonth = m;
      }
    }
    return { grid, maxCount: max, monthLabels };
  }, [data, source]);

  const colors = [
    "bg-zinc-800",
    "bg-purple-900/60",
    "bg-purple-600/70",
    "bg-purple-500",
    "bg-purple-400",
  ];

  return (
    <div className="w-full space-y-3">
      <div className="grid w-full gap-[3px] pb-2" style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))" }}>
        {Array.from({ length: 53 }).map((_, col) => (
          <div key={col} className="flex flex-col gap-[3px]">
            {Array.from({ length: 7 }).map((_, row) => {
              const count = grid[row]?.[col] ?? 0;
              const level = Math.min(4, maxCount > 0 ? Math.ceil((count / maxCount) * 4) : 0);
              return (
                <div
                  key={`${col}-${row}`}
                  className={`aspect-square w-full max-w-full rounded-sm ${colors[level]} transition-colors`}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div
        className="grid w-full text-[10px] text-zinc-500"
        style={{ gridTemplateColumns: "repeat(53, minmax(0, 1fr))" }}
      >
        {Array.from({ length: 53 }).map((_, col) => {
          const label = monthLabels.find((ml) => ml.col === col);
          return (
            <span key={col} className="truncate">
              {label?.label ?? ""}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function GamifySection() {
  const heatmapData = useMemo(() => generateActivityData(365), []);

  return (
    <section className="bg-black py-20 px-6 text-white">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">Gamify Your Growth</h2>
          <p className="mt-3 text-zinc-400">
            Track every commit, solve, and keystroke with our automated data engine.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Developer Skill Radar - large left card */}
          <div className={`${CARD_STYLE} lg:col-span-2`}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Developer Skill Radar</h3>
                <p className="mt-1 text-sm text-zinc-400">
                  A comprehensive breakdown of your technical proficiency across 6 dimensions.
                </p>
              </div>
              <span className="rounded-full bg-purple-600/30 px-3 py-1 text-xs font-medium text-purple-400">
                Active Analysis
              </span>
            </div>
            <div className="mt-8 flex justify-center">
              <RadarChart data={RADAR_DIMENSIONS} />
            </div>
          </div>

          {/* Right column: XP + Achievements */}
          <div className="flex flex-col gap-6">
            {/* XP Progress Card */}
            <div className={CARD_STYLE}>
              <div className="flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-purple-400 shrink-0"
                >
                  <path d="M12,23a8,8,0,0,1-8-8A9.55,9.55,0,0,1,6.12,9.07,12.25,12.25,0,0,0,8.67,1.94a1,1,0,0,1,1.42-.85,10.24,10.24,0,0,1,6.14,8.38,5.57,5.57,0,0,0,.59-1,1,1,0,0,1,.8-.65,1,1,0,0,1,.95.41C18.72,8.41,20,10.33,20,15A7.91,7.91,0,0,1,12,23ZM10.51,3.6a14.22,14.22,0,0,1-2.73,6.6A7.52,7.52,0,0,0,6,15a6,6,0,0,0,6,6,5.87,5.87,0,0,0,6-6,16.14,16.14,0,0,0-.44-4A7.93,7.93,0,0,1,15.7,12.7a1,1,0,0,1-1.53-1A7.76,7.76,0,0,0,10.51,3.6Z" />
                </svg>
                <span className="font-medium text-purple-400">7 Day Streak</span>
              </div>
              <p className="mt-2 text-3xl font-bold text-white">1,450 XP</p>
              <p className="mt-1 text-sm text-zinc-400">Keep pushing to reach Level 12</p>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-purple-600 to-violet-500"
                  style={{ width: "68%" }}
                />
              </div>
            </div>

            {/* Recent Achievements */}
            <div className={`${CARD_STYLE} flex-1`}>
              <h3 className="text-lg font-bold text-white">Recent Achievements</h3>
              <div className="mt-4 space-y-3">
                {ACHIEVEMENTS.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-start gap-3 rounded-xl bg-neutral-900/50 p-3"
                  >
                    <span className={`shrink-0 ${a.iconColor}`}>
                      {AchievementIcons[a.icon as keyof typeof AchievementIcons]}
                    </span>
                    <div>
                      <p className="font-semibold text-white">{a.title}</p>
                      <p className="text-xs text-zinc-400">{a.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contribution Heatmap - full width */}
        <ContributionHeatmapCard heatmapData={heatmapData} />
      </div>
    </section>
  );
}

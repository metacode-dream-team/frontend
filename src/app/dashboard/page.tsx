"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { ConnectPlatformsModal } from "@/features/connect-accounts";

const CARD =
  "rounded-2xl border border-zinc-800/50 bg-[#09090b] p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.04)_inset]";

const CARD_SOFT =
  "rounded-2xl border border-zinc-800/40 bg-[#09090b] p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]";

const RADAR_SKILLS = [
  { label: "Logic", value: 92 },
  { label: "Speed", value: 78 },
  { label: "Consistency", value: 88 },
  { label: "Impact", value: 95 },
  { label: "Arch", value: 84 },
];

type FeatRarity = "Epic" | "Rare" | "Uncommon" | "Common";

type FeatSlot =
  | {
      kind: "feat";
      title: string;
      time: string;
      rarity: FeatRarity;
      icon: "code" | "bolt" | "link" | "clock" | "pulse";
    }
  | { kind: "empty" };

const FEAT_GRID: FeatSlot[] = [
  {
    kind: "feat",
    title: "Clean Coder",
    time: "2h ago",
    rarity: "Rare",
    icon: "code",
  },
  {
    kind: "feat",
    title: "Speed Demon",
    time: "Oct 12",
    rarity: "Epic",
    icon: "bolt",
  },
  {
    kind: "feat",
    title: "Social Lite",
    time: "Sep 03",
    rarity: "Common",
    icon: "link",
  },
  {
    kind: "feat",
    title: "Daily Grind",
    time: "Aug 20",
    rarity: "Uncommon",
    icon: "clock",
  },
  {
    kind: "feat",
    title: "Bug Hunter",
    time: "Jul 01",
    rarity: "Rare",
    icon: "pulse",
  },
  { kind: "empty" },
  { kind: "empty" },
  { kind: "empty" },
];

const RANKINGS = [
  { rank: 1, name: "alex_flow", level: 72, power: "1.2M", highlight: false },
  { rank: 2, name: "sarah_code", level: 68, power: "950K", highlight: false },
  { rank: 3, name: "marcus_dev", level: 65, power: "890K", highlight: false },
  { rank: 4, name: "elena_ts", level: 54, power: "720K", highlight: false },
  {
    rank: 42,
    name: "Felix (You)",
    level: 42,
    power: "342K",
    highlight: true,
  },
];

function rarityPillClass(r: FeatRarity) {
  if (r === "Epic") {
    return "border-violet-500/30 bg-violet-950/50 text-violet-200/95";
  }
  if (r === "Rare") {
    return "border-sky-500/25 bg-sky-950/35 text-sky-200/90";
  }
  if (r === "Uncommon") {
    return "border-emerald-500/20 bg-emerald-950/25 text-emerald-200/85";
  }
  return "border-zinc-700/50 bg-zinc-900/60 text-zinc-400";
}

function FeatTileIcon({
  kind,
}: {
  kind: "code" | "bolt" | "link" | "clock" | "pulse";
}) {
  const cls = "h-4 w-4 text-violet-400/90";
  if (kind === "code") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
      </svg>
    );
  }
  if (kind === "bolt") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    );
  }
  if (kind === "link") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    );
  }
  if (kind === "clock") {
    return (
      <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    );
  }
  return (
    <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}

function RadarChart({
  data,
  size = 200,
}: {
  data: { label: string; value: number }[];
  size?: number;
}) {
  const center = size / 2;
  const maxR = center - 32;
  const n = data.length;
  const maxVal = 100;

  const getPoint = (i: number, val: number) => {
    const angle = (i * 360) / n - 90;
    const rad = (angle * Math.PI) / 180;
    const r = (val / maxVal) * maxR;
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) };
  };

  const points = data.map((d, i) => getPoint(i, d.value));
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} className="mx-auto shrink-0">
      <defs>
        <linearGradient id="dashRadarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(168,85,247,0.45)" />
          <stop offset="100%" stopColor="rgba(168,85,247,0.08)" />
        </linearGradient>
        <filter id="dashRadarGlow" x="-15%" y="-15%" width="130%" height="130%">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {[0.2, 0.4, 0.6, 0.8, 1].map((level) => (
        <polygon
          key={level}
          points={data
            .map((_, i) => getPoint(i, level * maxVal))
            .map((p) => `${p.x},${p.y}`)
            .join(" ")}
          fill="none"
          stroke="rgba(63,63,70,0.6)"
          strokeWidth="1"
        />
      ))}
      {data.map((_, i) => {
        const p = getPoint(i, maxVal);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={p.x}
            y2={p.y}
            stroke="rgba(63,63,70,0.6)"
            strokeWidth="1"
          />
        );
      })}
      <polygon
        points={polygonPoints}
        fill="url(#dashRadarFill)"
        stroke="#a855f7"
        strokeWidth="2"
        filter="url(#dashRadarGlow)"
      />
      {data.map((d, i) => {
        const p = getPoint(i, maxVal * 1.12);
        return (
          <text
            key={i}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-zinc-500 text-[10px] font-semibold uppercase tracking-wide"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

function generateWeightedHeatmapGrid(): number[][] {
  const grid: number[][] = Array.from({ length: 7 }, () => Array(53).fill(0));
  const start = new Date();
  start.setDate(start.getDate() - 364);

  for (let i = 0; i <= 364; i++) {
    const col = Math.min(52, Math.floor(i / 7));
    const row = new Date(start.getTime() + i * 86400000).getDay();
    const monthProgress = i / 365;
    const weight = 0.3 + 0.7 * Math.sin(monthProgress * Math.PI);
    const roll = Math.random();
    const level =
      roll < weight * 0.4
        ? 0
        : roll < weight * 0.7
          ? 1
          : roll < weight * 0.9
            ? 2
            : roll < weight
              ? 3
              : 4;
    grid[row][col] = Math.max(grid[row][col], level);
  }
  return grid;
}

/** Level 0 visible on black; higher levels read clearly at a glance */
const HEATMAP_COLORS = [
  "#3f3f46",
  "#5b21b6",
  "#7c3aed",
  "#a855f7",
  "#ddd6fe",
];

export default function DashboardPage() {
  const heatmapGrid = useMemo(() => generateWeightedHeatmapGrid(), []);
  const [connectOpen, setConnectOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    if (window.location.hash === "#neural-links") {
      const el = document.getElementById("neural-links");
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const openConnect = useCallback(() => setConnectOpen(true), []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-100">
      <div className="mx-auto max-w-7xl space-y-5 px-4 py-8 pb-16 lg:space-y-6 lg:px-6">
        {/* Top row: profile + main progress */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,340px)_1fr] lg:items-stretch">
          <section className={`${CARD} flex flex-col`}>
            <div className="flex gap-4">
              <div className="relative shrink-0">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-900 text-xl font-bold text-white ring-2 ring-violet-500/50 ring-offset-2 ring-offset-[#0c0c0e] shadow-[0_0_24px_rgba(168,85,247,0.35)]"
                  aria-hidden
                >
                  FH
                </div>
                <span className="absolute -bottom-1 -left-1 rounded-md bg-violet-600 px-2 py-0.5 text-[10px] font-bold tracking-wide text-white shadow-lg">
                  LVL 42
                </span>
                <span
                  className="absolute -right-0.5 -bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#0c0c0e] bg-emerald-500"
                  title="Online"
                  aria-label="Online"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold leading-tight text-white sm:text-xl">
                  Felix &apos;Neo&apos; Henderson
                </h1>
                <p className="mt-2 inline-flex rounded-full border border-violet-500/35 bg-violet-950/40 px-3 py-0.5 text-xs font-semibold text-violet-200">
                  Full Stack Architect
                </p>
                <p className="mt-3 text-xs text-zinc-500">Joined March 2024</p>
              </div>
            </div>
          </section>

          <section className={`${CARD} flex flex-col justify-center`}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              Main progress system
            </p>
            <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  34,250{" "}
                  <span className="text-lg font-semibold text-zinc-500">
                    / 45,000 XP
                  </span>
                </p>
                <div className="mt-3 h-3 w-full max-w-xl overflow-hidden rounded-full bg-zinc-900">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-[0_0_16px_rgba(168,85,247,0.5)]"
                    style={{ width: "76%" }}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-6 sm:justify-end">
                <div className="flex items-start gap-2">
                  <span className="text-orange-400" aria-hidden>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      Current streak
                    </p>
                    <p className="text-sm font-bold text-white">18 Days</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-amber-400" aria-hidden>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      Global rank
                    </p>
                    <p className="text-sm font-bold text-white">#1,245</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Neural Skill (fixed share) + Contribution Flux (same card height on lg) */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,clamp(260px,34%,380px))_minmax(0,1fr)] lg:items-stretch">
          <section className={`${CARD} flex h-full min-h-0 flex-col`}>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-violet-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
              <h2 className="text-base font-bold text-white">
                Neural Skill Profile
              </h2>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Relative strengths across five dimensions.
            </p>
            <div className="mt-5 flex min-h-0 flex-1 flex-col items-center justify-center py-2">
              <RadarChart data={RADAR_SKILLS} size={208} />
            </div>
          </section>

          <section className={`${CARD} flex h-full min-h-0 min-w-0 flex-col`}>
            <div className="flex shrink-0 flex-wrap items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-5 w-5 shrink-0 text-violet-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                </svg>
                <div>
                  <h2 className="text-base font-bold text-white">
                    Contribution Flux
                  </h2>
                  <p className="text-xs text-zinc-500">
                    Synchronized GitHub activity matrix
                  </p>
                </div>
              </div>
              <Link
                href="/leaderboard"
                className="text-xs font-semibold text-violet-400 transition-colors hover:text-violet-300"
              >
                Year view ›
              </Link>
            </div>
            <div className="mt-2 flex shrink-0 flex-wrap items-center justify-between gap-2">
              <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                Last 365 days
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <span>Less</span>
                {HEATMAP_COLORS.map((c) => (
                  <span
                    key={c}
                    className="h-2.5 w-2.5 rounded-sm ring-1 ring-zinc-700/40"
                    style={{ backgroundColor: c }}
                    aria-hidden
                  />
                ))}
                <span>More</span>
              </div>
            </div>
            {/* Full-width grid: fills card, readable contrast */}
            <div className="mt-4 min-h-0 w-full flex-1">
              <div
                className="grid w-full gap-[3px] rounded-lg bg-black/40 p-2 ring-1 ring-zinc-800/60 [grid-template-columns:repeat(53,minmax(0,1fr))] [grid-template-rows:repeat(7,minmax(0,1fr))] [aspect-ratio:53/7] min-h-[72px] max-h-[200px] sm:max-h-[240px] lg:max-h-[280px]"
                role="img"
                aria-label="Contribution activity over the last year"
              >
                {Array.from({ length: 7 * 53 }).map((_, i) => {
                  const row = Math.floor(i / 53);
                  const col = i % 53;
                  const level = heatmapGrid[row]?.[col] ?? 0;
                  return (
                    <div
                      key={i}
                      className="min-h-0 min-w-0 rounded-[3px]"
                      style={{ backgroundColor: HEATMAP_COLORS[level] }}
                    />
                  );
                })}
              </div>
            </div>
          </section>
        </div>

        {/* Three bottom cards — minimal */}
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-5">
          <section id="neural-links" className={`${CARD_SOFT} scroll-mt-24`}>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-violet-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
              <h2 className="text-sm font-bold tracking-tight text-white">
                Neural Links
              </h2>
            </div>
            <p className="mt-1 text-xs text-zinc-500">Live data synchronization</p>
            <ul className="mt-5 divide-y divide-zinc-800/60">
              <li className="flex items-center justify-between gap-3 py-3 first:pt-0">
                <div className="flex min-w-0 items-center gap-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-violet-400"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">GitHub</p>
                    <p className="text-[11px] text-emerald-400/85">Connected</p>
                  </div>
                </div>
                <p className="shrink-0 text-[10px] font-semibold tracking-wide text-zinc-500">
                  1,240 COMMITS
                </p>
              </li>
              <li className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center text-violet-400" aria-hidden>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m16 18 6-6-6-6M8 6l-6 6 6 6" />
                    </svg>
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">LeetCode</p>
                    <p className="text-[11px] text-emerald-400/85">Connected</p>
                  </div>
                </div>
                <p className="shrink-0 text-[10px] font-semibold tracking-wide text-zinc-500">
                  452 SOLVED
                </p>
              </li>
              <li className="flex items-center justify-between gap-3 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-violet-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h.01M12 14h.01M16 14h.01" />
                  </svg>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">Monkeytype</p>
                    <p className="text-[11px] text-violet-300/80">Syncing</p>
                  </div>
                </div>
                <p className="shrink-0 text-[10px] font-semibold tracking-wide text-zinc-500">
                  112 WPM PEAK
                </p>
              </li>
            </ul>
            <button
              type="button"
              onClick={openConnect}
              className="mt-5 w-full rounded-lg border border-zinc-700/80 bg-zinc-900/40 py-2.5 text-xs font-semibold tracking-wide text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800/50 hover:text-white"
            >
              Connect New Source +
            </button>
          </section>

          <section className={`${CARD_SOFT}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-violet-400"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
                </svg>
                <div>
                  <h2 className="text-sm font-bold tracking-tight text-white">
                    Unlocked Feats
                  </h2>
                  <p className="text-xs text-zinc-500">8 / 24 Milestones achieved</p>
                </div>
              </div>
              <Link
                href="/leaderboard"
                className="shrink-0 text-xs font-medium text-violet-400/95 hover:text-violet-300"
              >
                View All
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {FEAT_GRID.map((slot, idx) =>
                slot.kind === "empty" ? (
                  <div
                    key={`empty-${idx}`}
                    className="flex min-h-[92px] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800/50 bg-zinc-950/30 shadow-[inset_0_1px_0_0_rgba(168,85,247,0.06)]"
                  >
                    <svg
                      className="h-4 w-4 text-zinc-700"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden
                    >
                      <path d="m18 15-6-6-6 6" />
                    </svg>
                  </div>
                ) : (
                  <div
                    key={slot.title}
                    className="flex min-h-[92px] flex-col rounded-lg border border-zinc-800/50 bg-zinc-950/40 px-2 pb-2 pt-2 shadow-[inset_0_1px_0_0_rgba(168,85,247,0.12)]"
                  >
                    <div className="flex justify-center text-violet-400/90">
                      <FeatTileIcon kind={slot.icon} />
                    </div>
                    <p className="mt-2 line-clamp-2 text-center text-[10px] font-semibold leading-tight text-white">
                      {slot.title}
                    </p>
                    <p className="mt-1 text-center text-[9px] text-zinc-500">
                      {slot.time}
                    </p>
                    <span
                      className={`mt-auto inline-flex justify-center rounded-full border px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide ${rarityPillClass(slot.rarity)}`}
                    >
                      {slot.rarity}
                    </span>
                  </div>
                ),
              )}
            </div>
          </section>

          <section className={`${CARD_SOFT}`}>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-violet-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path d="M12 20v-6M6 20V10M18 20V4" />
              </svg>
              <div>
                <h2 className="text-sm font-bold tracking-tight text-white">
                  Regional Rankings
                </h2>
                <p className="text-xs text-zinc-500">Northern Hemisphere / Tier A</p>
              </div>
            </div>
            <div className="mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-800/80 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    <th className="pb-2 pr-2 font-semibold">Rank</th>
                    <th className="pb-2 font-semibold">Hunter</th>
                    <th className="pb-2 text-right font-semibold">Level</th>
                    <th className="pb-2 text-right font-semibold">Power</th>
                  </tr>
                </thead>
                <tbody>
                  {RANKINGS.map((row) => (
                    <tr
                      key={row.rank}
                      className={
                        row.highlight
                          ? "bg-violet-600/20 text-white"
                          : "border-b border-zinc-800/40 text-zinc-400 last:border-0"
                      }
                    >
                      <td className="py-2 pr-2 align-middle font-semibold tabular-nums text-zinc-300">
                        {row.rank === 1 ? (
                          <span className="text-amber-400" title="Gold">
                            ●
                          </span>
                        ) : row.rank === 2 ? (
                          <span className="text-zinc-300" title="Silver">
                            ●
                          </span>
                        ) : row.rank === 3 ? (
                          <span className="text-amber-800/90" title="Bronze">
                            ●
                          </span>
                        ) : (
                          row.rank
                        )}
                      </td>
                      <td className="max-w-[120px] py-2 align-middle">
                        <div className="flex items-center gap-2">
                          <div
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9px] font-bold ${
                              row.highlight
                                ? "bg-violet-500/30 text-violet-100"
                                : "bg-zinc-800 text-zinc-400"
                            }`}
                          >
                            {row.highlight
                              ? row.name
                                  .replace(" (You)", "")
                                  .slice(0, 2)
                                  .toUpperCase()
                              : row.name
                                  .split(/[_\s]/)
                                  .map((w) => w[0])
                                  .join("")
                                  .slice(0, 2)
                                  .toUpperCase()}
                          </div>
                          <span
                            className={
                              row.highlight
                                ? "truncate font-medium text-white"
                                : "truncate font-medium text-zinc-300"
                            }
                          >
                            {row.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 text-right align-middle tabular-nums text-zinc-400">
                        Lvl {row.level}
                      </td>
                      <td className="py-2 text-right align-middle text-sm font-bold tabular-nums text-white">
                        {row.power}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <Link
                href="/leaderboard"
                className="text-xs font-medium text-white/90 underline-offset-4 hover:text-violet-300 hover:underline"
              >
                Open Global Matrix ›
              </Link>
            </div>
          </section>
        </div>
      </div>

      <ConnectPlatformsModal open={connectOpen} onOpenChange={setConnectOpen} />
    </div>
  );
}

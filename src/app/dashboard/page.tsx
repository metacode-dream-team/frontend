"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import leetcodeImg from "@/assets/Leetcode--Streamline-Simple-Icons (2).png";

const CARD = "rounded-2xl border border-[#1e1e1e] p-5";
const CARD_BG = "#111";


const RADAR_SKILLS = [
  { label: "Frontend", value: 120 },
  { label: "Backend", value: 95 },
  { label: "Algorithms", value: 88 },
  { label: "DevOps", value: 72 },
  { label: "Security", value: 45 },
];

const BADGES = [
  { id: "1", icon: "⚡", label: "BUG HUNTER", border: "purple", earned: true, solid: false },
  { id: "2", icon: "🔥", label: "EARLY BIRD", border: "orange", earned: true, solid: false },
  { id: "3", icon: "🏆", label: "CODE NINJA", border: "purple", earned: true, solid: true },
  { id: "4", icon: "⌨", label: "WPM KING", border: "purple", earned: false, solid: false },
  { id: "5", icon: "🍺", label: "PR MASTER", border: "gray", earned: false, solid: false },
  { id: "6", icon: "L", label: "LEETcode", border: "gray", earned: false, solid: false },
  { id: "7", icon: "〜", label: "SOCIAL LITE", border: "gray", earned: false, solid: false },
];

function RadarChart({ data }: { data: { label: string; value: number }[] }) {
  const size = 180;
  const center = size / 2;
  const maxR = center - 30;
  const n = data.length;

  const getPoint = (i: number, val: number) => {
    const angle = (i * 360) / n - 90;
    const rad = (angle * Math.PI) / 180;
    const r = (val / 120) * maxR;
    return { x: center + r * Math.cos(rad), y: center + r * Math.sin(rad) };
  };

  const points = data.map((d, i) => getPoint(i, d.value));
  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={size} height={size} className="mx-auto">
      <defs>
        <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(124,58,237,0.5)" />
          <stop offset="100%" stopColor="rgba(124,58,237,0.1)" />
        </linearGradient>
      </defs>
      {[1, 2, 3, 4, 5].map((level) => (
        <polygon
          key={level}
          points={data.map((_, i) => getPoint(i, (level / 5) * 100)).map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth="1"
        />
      ))}
      {data.map((_, i) => {
        const p = getPoint(i, 100);
        return <line key={i} x1={center} y1={center} x2={p.x} y2={p.y} stroke="#2a2a2a" strokeWidth="1" />;
      })}
      <polygon points={polygonPoints} fill="url(#radarFill)" stroke="#7c3aed" strokeWidth="1.5" />
      {data.map((d, i) => {
        const p = getPoint(i, 108);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" className="fill-[#9ca3af] text-[10px]">
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}

function LeetcodeIconSmall({ className }: { className?: string }) {
  return (
    <Image
      src={leetcodeImg}
      alt="LC"
      width={20}
      height={20}
      className={`object-contain ${className ?? ""}`}
      style={{ filter: "invert(27%) sepia(98%) saturate(2000%) hue-rotate(258deg)" }}
    />
  );
}

// Weighted random heatmap — more activity in middle months
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
    const level = roll < weight * 0.4 ? 0 : roll < weight * 0.7 ? 1 : roll < weight * 0.9 ? 2 : roll < weight ? 3 : 4;
    grid[row][col] = Math.max(grid[row][col], level);
  }
  return grid;
}

const HEATMAP_COLORS = ["#1a1a2e", "#3b1fa8", "#5b21b6", "#7c3aed", "#a855f7"];

export default function DashboardPage() {
  const heatmapGrid = useMemo(() => generateWeightedHeatmapGrid(), []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#080808" }}>
      <div className="mx-auto max-w-[1100px] space-y-4 px-4 py-6">
        {/* SECTION 1 — User Profile Header */}
        <div
          className={`${CARD} flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`}
          style={{ backgroundColor: CARD_BG }}
        >
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="h-16 w-16 rounded-full" style={{ backgroundColor: "#2a2a2a" }} />
              <span
                className="absolute -bottom-1 -left-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                style={{ backgroundColor: "#7c3aed" }}
              >
                Lvl 42
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white sm:text-[22px]">Welcome back, Alex ✦</h1>
              <p className="text-sm text-[#6b7280]">System Architect • 1,240 XP to Level 43</p>
              <p className="mt-1 text-[10px] font-medium uppercase" style={{ color: "#7c3aed" }}>
                LEVEL 42
              </p>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: "#222" }}>
                <div
                  className="h-full rounded-full"
                  style={{ backgroundColor: "#7c3aed", width: "75%" }}
                />
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#6b7280]">TOTAL POINTS</p>
            <p className="text-2xl font-bold text-white sm:text-[28px]">84,230 XP</p>
            <p className="text-sm text-[#6b7280]">7,500 / 10,000 XP</p>
          </div>
        </div>

        {/* SECTION 2 — Two Column Row */}
        <div className="grid gap-4 lg:grid-cols-[65%_1fr]">
          {/* Global Performance */}
          <div className={`${CARD}`} style={{ backgroundColor: CARD_BG }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
                <h2 className="font-bold text-white">Global Performance</h2>
              </div>
              <button
                className="flex items-center gap-1 rounded-full border border-[#2a2a2a] px-3 py-1.5 text-xs text-[#9ca3af]"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                Last Year <span>›</span>
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" />
                </svg>
                Coding Activity (Last 365 Days)
              </div>
              <div className="flex items-center gap-1 text-[10px] text-[#6b7280]">
                Less
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: HEATMAP_COLORS[i] }}
                  />
                ))}
                More
              </div>
            </div>
            <div className="mt-4 w-full overflow-x-auto pb-4">
              <div className="flex gap-[2px]" style={{ width: "max-content" }}>
                {Array.from({ length: 53 }).map((_, col) => (
                  <div key={col} className="flex flex-col gap-[2px]">
                    {Array.from({ length: 7 }).map((_, row) => {
                      const level = heatmapGrid[row]?.[col] ?? 0;
                      return (
                        <div
                          key={`${col}-${row}`}
                          className="h-[9px] w-[9px] rounded-sm shrink-0"
                          style={{ backgroundColor: HEATMAP_COLORS[level] }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 border-t border-[#1e1e1e] pt-4">
              {[
                { icon: "🔥", label: "LONGEST STREAK", value: "14 Days" },
                { icon: "⚡", label: "AVG DAILY TIME", value: "4.2 hrs" },
                { icon: "🧩", label: "PROJECTS DONE", value: "28" },
                { icon: "👥", label: "PEER RATING", value: "4.9/5" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="flex items-center gap-1 text-[10px] uppercase text-[#6b7280]">
                    {s.icon} {s.label}
                  </p>
                  <p className="mt-1 font-bold text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skill Breakdown */}
          <div className={`${CARD} flex flex-col`} style={{ backgroundColor: CARD_BG }}>
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M6 9v6m12-6v6M6 15a6 6 0 0 0 12 0" />
                <path d="M6 21h12" />
              </svg>
              <h2 className="font-bold text-white">Skill Breakdown</h2>
            </div>
            <div className="my-6 flex flex-1 items-center justify-center">
              <RadarChart data={RADAR_SKILLS} />
            </div>
            <div className="space-y-2 border-t border-[#1e1e1e] pt-4">
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7280]">Strongest</span>
                <span className="font-bold text-white">Frontend (120)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7280]">Weakest</span>
                <span className="font-bold text-[#ef4444]">Security (45)</span>
              </div>
              <Link
                href="/roadmaps"
                className="mt-4 block w-full rounded-lg py-2.5 text-center text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                View Skill Tree
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 3 — Three Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className={`${CARD}`} style={{ backgroundColor: CARD_BG }}>
            <div className="flex justify-between">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white" className="opacity-80">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
              </svg>
              <span className="text-xs text-[#6b7280]">GitHub</span>
            </div>
            <p className="mt-4 text-4xl font-bold text-white">2,842</p>
            <p className="text-sm text-[#6b7280]">
              Contributions this year <span className="text-[#22c55e]">↗ +12%</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#9ca3af]">
              <span>PULL REQUESTS: 154</span>
              <span>REVIEWS: 89</span>
            </div>
          </div>

          <div className={`${CARD}`} style={{ backgroundColor: CARD_BG }}>
            <div className="flex justify-between">
              <LeetcodeIconSmall />
              <span className="text-xs text-[#6b7280]">LeetCode</span>
            </div>
            <p className="mt-4 text-4xl font-bold text-white">452</p>
            <p className="text-sm text-[#6b7280]">
              Problems Solved <span className="text-[#22c55e]">↗ +5%</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#9ca3af]">
              <span>EASY/MED/HARD: 120/280/52</span>
              <span>CONTEST RANK: 1,840</span>
            </div>
          </div>

          <div className={`${CARD}`} style={{ backgroundColor: CARD_BG }}>
            <div className="flex justify-between">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h.01M12 14h.01M16 14h.01" />
              </svg>
              <span className="text-xs text-[#6b7280]">Monkeytype</span>
            </div>
            <p className="mt-4 text-4xl font-bold text-white">124</p>
            <p className="text-sm text-[#6b7280]">
              Avg WPM Speed <span className="text-[#22c55e]">↗ +8%</span>
            </p>
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-[#9ca3af]">
              <span>ACCURACY: 98.5%</span>
              <span>CONSISTENCY: 74%</span>
            </div>
          </div>
        </div>

        {/* SECTION 4 — Recent Achievements */}
        <div className={`${CARD}`} style={{ backgroundColor: CARD_BG }}>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold text-white">Recent Achievements</h2>
              <p className="text-sm text-[#6b7280]">You earned 3 new badges this week!</p>
            </div>
            <Link href="/achievements" className="text-sm font-medium" style={{ color: "#7c3aed" }}>
              All Badges ›
            </Link>
          </div>
          <div className="mt-6 flex flex-wrap justify-between gap-6">
            {BADGES.map((b) => (
              <div key={b.id} className="flex flex-col items-center">
                <div
                  className="flex h-[60px] w-[60px] items-center justify-center rounded-full text-2xl"
                  style={{
                    backgroundColor: "#1a1a1a",
                    border: `2px ${b.solid ? "solid" : "dashed"} ${b.border === "purple" ? "#7c3aed" : b.border === "orange" ? "#f97316" : "#4b5563"}`,
                    opacity: b.earned ? 1 : 0.6,
                    filter: b.earned ? "saturate(1.2) brightness(1.05)" : "none",
                  }}
                >
                  {b.icon}
                </div>
                <p className="mt-2 text-[10px] uppercase text-[#6b7280]">{b.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

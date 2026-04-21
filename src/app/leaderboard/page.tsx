"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import leetcodeImg from "@/assets/Leetcode--Streamline-Simple-Icons (2).png";
import firstAvatar from "@/assets/profile/first.jpg";
import leader1 from "@/assets/profile/1 leader.jpg";
import leader2 from "@/assets/profile/2 leader.png";
import leader3 from "@/assets/profile/3 leader.jpg";
import leader4 from "@/assets/profile/4 leader.jpg";
import leader5 from "@/assets/profile/5 leader.jpg";
import leader7 from "@/assets/profile/7 leader.jpg";
import leader8 from "@/assets/profile/8 leader.jpg";
import leader9 from "@/assets/profile/9 leader.jpg";
import leader10 from "@/assets/profile/10 leader.jpg";
import leaderExtra from "@/assets/profile/leader.jpg";

const PAGE_SIZE = 7;
const TOTAL_DEVELOPERS = { weekly: 1340, monthly: 2840, alltime: 12500 };

const PODIUM_DATA = [
  {
    rank: 2,
    name: "BekSKeks",
    level: 68,
    badges: ["LeetCode Guru","Femboy Boss"],
    xp: "115,200",
    stats: { github: 880, leetcode: 122, wpm: 195 },
    accent: "silver",
    avatar: leader2,
  },
  {
    rank: 1,
    name: "Sayanchiksa",
    level: 72,
    badges: ["Open Source Legend", "Algorithm Master","Steve Jobs' son"],
    xp: "128,450",
    stats: { github: 1630, leetcode: 450, wpm: 125 },
    accent: "gold",
    elevated: true,
    avatar: leaderExtra,
  },
  {
    rank: 3,
    name: "Marcus Thorne",
    level: 65,
    badges: ["Keyboard Warrior"],
    xp: "108,900",
    stats: { github: 2150, leetcode: 260, wpm: 183 },
    accent: "bronze",
    avatar: leader3,
  },
];

const ALL_TABLE_ROWS = [
  { id: "4", rank: 4, name: "Elena Rodriguez", level: 54, github: 840, leetcode: 310, wpm: 95, badge: "Mainlainer", xp: "92,400", trend: "Steady", avatar: leader1 },
  { id: "5", rank: 5, name: "James Wilson", level: 51, github: 1200, leetcode: 150, wpm: 115, badge: "TypeScript Wizard", xp: "88,100", trend: "+1UP", avatar: leader4 },
  { id: "6", rank: 6, name: "Amiya Sato", level: 49, github: 630, leetcode: 420, wpm: 88, badge: "Competition Coder", xp: "81,200", trend: "DOWN", avatar: leader5 },
  { id: "7", rank: 7, name: "David Kim", level: 43, github: 450, leetcode: 120, wpm: 155, badge: "Soul Speed", xp: "75,800", trend: "+120MS", avatar: leader7 },
  { id: "8", rank: 8, name: "Lisa Varna", level: 45, github: 1100, leetcode: 85, wpm: 322, badge: "AI Artisan", xp: "88,000", trend: "+2UP", avatar: leader8 },
  { id: "9", rank: 9, name: "Tom Hiddleston", level: 42, github: 300, leetcode: 200, wpm: 90, badge: "Login Pro", xp: "84,200", trend: "Steady", avatar: leader9 },
  { id: "10", rank: 10, name: "Zoe Kravitz", level: 40, github: 560, leetcode: 180, wpm: 115, badge: "Backend Honey", xp: "59,800", trend: "+7 Down", avatar: leader10 },
  { id: "11", rank: 11, name: "Alex Morgan", level: 48, github: 720, leetcode: 280, wpm: 102, badge: "Full Stack", xp: "78,500", trend: "+3UP", avatar: leader7 },
  { id: "12", rank: 12, name: "Jordan Lee", level: 46, github: 890, leetcode: 190, wpm: 118, badge: "DevOps Pro", xp: "72,100", trend: "Steady", avatar: leader1 },
  { id: "13", rank: 13, name: "Sam Taylor", level: 44, github: 540, leetcode: 350, wpm: 95, badge: "Algo Expert", xp: "68,900", trend: "DOWN", avatar: leader4 },
];

const CUP_COLORS = { gold: "#FFD700", silver: "#C0C0C0", bronze: "#CD7F32" } as const;

function CupIcon({ rank }: { rank: 1 | 2 | 3 }) {
  const stroke = rank === 1 ? CUP_COLORS.gold : rank === 2 ? CUP_COLORS.silver : CUP_COLORS.bronze;
  return (
    <svg width="14" height="14" viewBox="0 0 62 64" fill="none" stroke={stroke} strokeWidth="2">
      <path d="M11.5,4H0.1c0,0-2.4,30,24.5,30" />
      <path d="M49.1,4h10.8c0,0,2.5,30-23.6,30" />
      <path d="M19.2,55v-2c0-1.1,0.9-2,2.1-2l4.1-1c2-5,2.4-7.9,2.1-12h-1c-1.2,0-2.1-0.9-2.1-2.1v-3.1C13.3,28,11,10.4,11,0h39c0,10.5-2.3,28.1-13.4,32.8v3.1c0,1.2-1,2.1-2.1,2.1h-0.8c-0.3,4.1,0,7.1,2,12l5.1,1c1.1,0,2.1,0.9,2.1,2v2" />
      <path d="M15.8,4.2c0,0,0.5,17.9,6.9,22.8" />
      <path d="M39,55h6.1c1.1,0,3.9,5,3.9,5c0,1.1-0.9,2-1.9,2H15c-1.1,0-1.9-0.9-1.9-2c0,0,2.8-5,3.9-5h6.1" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
    </svg>
  );
}

function LeetcodeIcon({ className }: { className?: string }) {
  return (
    <Image
      src={leetcodeImg}
      alt="LeetCode"
      width={14}
      height={14}
      className={`shrink-0 object-contain ${className ?? ""}`}
    />
  );
}

function KeyboardIcon({ className }: { className?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
    </svg>
  );
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState<"weekly" | "monthly" | "alltime">("weekly");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [badgeFilter, setBadgeFilter] = useState<string | null>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const profileMe = useProfileMeStore((s) => s.profile);

  const currentUserDisplayName = useMemo(() => {
    if (!profileMe) return "DevUser";
    const full = [profileMe.firstName, profileMe.lastName].filter(Boolean).join(" ").trim();
    return full || profileMe.username || "DevUser";
  }, [profileMe]);

  const allBadges = useMemo(
    () => [...new Set(ALL_TABLE_ROWS.map((r) => r.badge))].sort(),
    []
  );

  const filteredRows = useMemo(() => {
    let rows = ALL_TABLE_ROWS;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      rows = rows.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.badge.toLowerCase().includes(q)
      );
    }
    if (badgeFilter) {
      rows = rows.filter((r) => r.badge === badgeFilter);
    }
    return rows;
  }, [searchQuery, badgeFilter]);

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, currentPage]);

  const totalPages = Math.ceil(filteredRows.length / PAGE_SIZE);
  const totalCount = TOTAL_DEVELOPERS[activeTab];
  const startItem = (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, filteredRows.length);

  const handleTabChange = (tab: "weekly" | "monthly" | "alltime") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterBadge = (badge: string | null) => {
    setBadgeFilter(badge);
    setShowFilterMenu(false);
    setCurrentPage(1);
  };

  const handleRowClick = (id: string) => {
    window.location.href = `/profile/${id}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* 1. Top pill button */}
        <div className="mb-6 flex justify-center">
          <span
            className="rounded-full border px-4 py-1.5 text-sm font-medium text-zinc-300"
            style={{ borderColor: "#7c3aed", boxShadow: "0 0 12px rgba(124,58,237,0.3)" }}
          >
            The Arena
          </span>
        </div>

        {/* 2. Heading */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Global Leaderboard</h1>
          <p className="mt-3 max-w-2xl mx-auto text-zinc-500">
            Compete with the top developers worldwide. Earn XP by coding, solving challenges, and
            contributing to open source.
          </p>
        </div>

        {/* 3. Podium cards */}
        <div className="mb-16 flex flex-col items-center justify-center gap-6 lg:flex-row lg:items-end lg:gap-8">
          {PODIUM_DATA.map((p) => (
            <div
              key={p.rank}
              className={`w-full max-w-[280px] rounded-2xl p-6 transition-all ${
                p.elevated ? "lg:-mt-8 lg:scale-105" : ""
              }`}
              style={{
                backgroundColor: "#111",
                border: p.elevated ? "1.5px solid #7c3aed" : "1px solid #1e1e1e",
                boxShadow: p.elevated ? "0 0 20px rgba(124,58,237,0.5)" : "none",
              }}
            >
              <div className="mb-4 flex items-center gap-2">
                <CupIcon rank={p.rank as 1 | 2 | 3} />
                <span
                  className="text-xs font-semibold uppercase"
                  style={{
                    color: p.accent === "gold" ? CUP_COLORS.gold : p.accent === "silver" ? CUP_COLORS.silver : CUP_COLORS.bronze,
                  }}
                >
                  Rank {p.rank}
                </span>
              </div>
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <Image
                    src={p.avatar}
                    alt={p.name}
                    width={80}
                    height={80}
                    className="h-20 w-20 rounded-full object-cover"
                    style={{ backgroundColor: "#2a2a2a" }}
                  />
                  <div
                    className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#111]"
                    style={{ backgroundColor: "#22c55e" }}
                  />
                </div>
              </div>
              <h3 className="text-center text-lg font-bold text-white">{p.name}</h3>
              <p className="text-center text-sm text-zinc-500">Level {p.level}</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {p.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{ backgroundColor: "#1e1e1e", color: "#aaa" }}
                  >
                    {b}
                  </span>
                ))}
              </div>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-2xl font-bold" style={{ color: "#7c3aed" }}>
                {p.xp}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="opacity-80">
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </p>
              <div className="mt-4 flex justify-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <GithubIcon /> {p.stats.github.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <LeetcodeIcon /> {p.stats.leetcode}
                </span>
                <span className="flex items-center gap-1">
                  <KeyboardIcon /> {p.stats.wpm} WPM
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 4. Leaderboard table section */}
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: "#0f0f0f", border: "1px solid #1e1e1e" }}
        >
          {/* Top bar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-2">
              {(["weekly", "monthly", "alltime"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabChange(tab)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "text-white"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  style={
                    activeTab === tab
                      ? { backgroundColor: "#7c3aed" }
                      : { backgroundColor: "transparent" }
                  }
                >
                  {tab === "weekly" ? "Weekly" : tab === "monthly" ? "Monthly" : "All-Time"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search developers..."
                  className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-[#7c3aed] focus:outline-none"
                />
              </div>
              <div className="relative">
                <button
                  onClick={() => setShowFilterMenu((v) => !v)}
                  className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors ${
                    badgeFilter ? "border-[#7c3aed] text-[#7c3aed]" : "border-[#2a2a2a] text-zinc-500 hover:text-white"
                  }`}
                  style={{ backgroundColor: "#111" }}
                >
                  <FilterIcon />
                </button>
                {showFilterMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowFilterMenu(false)}
                      aria-hidden
                    />
                    <div
                      className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-[#2a2a2a] py-2"
                      style={{ backgroundColor: "#111" }}
                    >
                      <button
                        onClick={() => handleFilterBadge(null)}
                        className={`block w-full px-4 py-2 text-left text-sm ${
                          !badgeFilter ? "text-[#7c3aed]" : "text-zinc-400 hover:text-white"
                        }`}
                      >
                        All badges
                      </button>
                      {allBadges.map((badge) => (
                        <button
                          key={badge}
                          onClick={() => handleFilterBadge(badge)}
                          className={`block w-full px-4 py-2 text-left text-sm ${
                            badgeFilter === badge ? "text-[#7c3aed]" : "text-zinc-400 hover:text-white"
                          }`}
                        >
                          {badge}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e1e1e]">
                  <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    Rank
                  </th>
                  <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    Developer
                  </th>
                  <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    GitHub
                  </th>
                  <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    LeetCode
                  </th>
                  <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    WPM
                  </th>
                  <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                    Activity & XP
                  </th>
                  <th className="pb-3" />
                </tr>
              </thead>
              <tbody>
                {paginatedRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-zinc-500">
                      No developers found. Try adjusting your search or filter.
                    </td>
                  </tr>
                )}
                {paginatedRows.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => handleRowClick(row.id)}
                    className="cursor-pointer border-b border-[#1e1e1e] transition-colors hover:bg-[#161616]"
                  >
                    <td className="py-4 text-zinc-500">#{row.rank}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={row.avatar}
                          alt={row.name}
                          width={36}
                          height={36}
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                          style={{ backgroundColor: "#2a2a2a" }}
                        />
                        <div>
                          <p className="font-medium text-white">{row.name}</p>
                          <p className="text-xs text-zinc-500">Lvl.{row.level}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                        <GithubIcon /> {row.github.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                        <LeetcodeIcon /> {row.leetcode}
                      </span>
                    </td>
                    <td className="py-4">
                      <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                        <KeyboardIcon /> {row.wpm}
                      </span>
                    </td>
                    <td className="py-4">
                      <div>
                        <span
                          className="rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{ backgroundColor: "#1e1e1e", color: "#aaa" }}
                        >
                          {row.badge}
                        </span>
                        <div className="mt-1">
                          <p className="font-bold text-white">{row.xp} XP</p>
                          <p
                            className={`text-[10px] ${
                              row.trend.includes("UP") || row.trend === "Steady"
                                ? "text-[#22c55e]"
                                : "text-[#ef4444]"
                            }`}
                          >
                            {row.trend.startsWith("+") ? "↑ " : row.trend.includes("Down") ? "↓ " : ""}
                            {row.trend}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-zinc-500">›</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="mt-6 flex flex-col gap-4 border-t border-[#1e1e1e] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-zinc-500">
              {filteredRows.length > 0
                ? `Showing ${startItem}-${endItem} of ${filteredRows.length} developers`
                : "No results"}
              {filteredRows.length === ALL_TABLE_ROWS.length && !badgeFilter && !searchQuery && ` (${totalCount} total this ${activeTab.replace("alltime", "all-time")})`}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage <= 1}
                className="rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#111" }}
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || totalPages === 0}
                className="rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm text-zinc-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#111" }}
              >
                Next Page
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. User rank card — показывается только залогиненным */}
      {isAuthenticated && (
        <div className="mx-auto mt-8 max-w-6xl px-6 pb-8">
          <div
            className="flex flex-col items-center justify-between gap-4 rounded-2xl px-6 py-5 sm:flex-row"
            style={{
              background: "linear-gradient(135deg, #2a0050 0%, #1a0035 50%, #0f0020 100%)",
              border: "1.5px solid rgba(124,58,237,0.6)",
              boxShadow: "0 0 30px rgba(124,58,237,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            <div className="flex items-center gap-4">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold"
                style={{ color: "#a78bfa", backgroundColor: "rgba(124,58,237,0.4)" }}
              >
                #142
              </span>
              <div className="relative">
                {profileMe?.avatarUrl ? (
                  <img
                    src={profileMe.avatarUrl}
                    alt={currentUserDisplayName}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                    style={{ backgroundColor: "#2a2a2a" }}
                  />
                ) : (
                  <Image
                    src={firstAvatar}
                    alt={currentUserDisplayName}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                    style={{ backgroundColor: "#2a2a2a" }}
                  />
                )}
                <div
                  className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2"
                  style={{ backgroundColor: "#22c55e", borderColor: "#1a0035" }}
                />
              </div>
              <div>
                <p className="font-bold text-white">You ({currentUserDisplayName})</p>
                <p className="text-sm text-zinc-400">
                  You are in the top 15% this week! Keep it up.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xl font-bold" style={{ color: "#a78bfa" }}>
                  12,450 XP
                </p>
                <p className="flex items-center justify-end gap-1 text-xs text-[#22c55e]">
                  <span>↗</span> 24 PLACES UP
                </p>
              </div>
              <Link
                href="/dashboard"
                className="rounded-xl px-6 py-3 font-medium text-white transition-all hover:brightness-110"
                style={{
                  backgroundColor: "#7c3aed",
                  boxShadow: "0 0 20px rgba(124,58,237,0.4)",
                }}
              >
                View My Stats
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

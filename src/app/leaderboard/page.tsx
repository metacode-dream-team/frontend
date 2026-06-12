"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import type { LeaderboardUser } from "@/shared/types/leaderboard";
import { Avatar } from "@/shared/ui/Avatar";
import {
  buildPodiumDisplayOrder,
  useFetchLeaderboard,
} from "@/features/leaderboard/fetch-leaderboard";
import leetcodeImg from "@/assets/Leetcode--Streamline-Simple-Icons (2).png";

const PAGE_SIZE = 7;

const CUP_COLORS = { gold: "#FFD700", silver: "#C0C0C0", bronze: "#CD7F32" } as const;

const PODIUM_ACCENT: Record<
  1 | 2 | 3,
  { accent: "gold" | "silver" | "bronze"; color: string }
> = {
  1: { accent: "gold", color: CUP_COLORS.gold },
  2: { accent: "silver", color: CUP_COLORS.silver },
  3: { accent: "bronze", color: CUP_COLORS.bronze },
};

function formatScore(score: number): string {
  return score.toLocaleString(undefined, {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  });
}

function profileHref(username: string): string {
  const slug = username.trim();
  return slug ? `/profile/${encodeURIComponent(slug)}` : "/profile";
}

function CupIcon({ rank }: { rank: 1 | 2 | 3 }) {
  const stroke =
    rank === 1 ? CUP_COLORS.gold : rank === 2 ? CUP_COLORS.silver : CUP_COLORS.bronze;
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

function PodiumCard({ player }: { player: LeaderboardUser }) {
  const rank = player.rank as 1 | 2 | 3;
  const style = PODIUM_ACCENT[rank];
  const elevated = rank === 1;

  return (
    <Link
      href={profileHref(player.username)}
      className={`block w-full max-w-[280px] rounded-2xl p-6 transition-all hover:brightness-105 ${
        elevated ? "lg:-mt-8 lg:scale-105" : ""
      }`}
      style={{
        backgroundColor: "#111",
        border: elevated ? "1.5px solid #7c3aed" : "1px solid #1e1e1e",
        boxShadow: elevated ? "0 0 20px rgba(124,58,237,0.5)" : "none",
      }}
    >
      <div className="mb-4 flex items-center gap-2">
        <CupIcon rank={rank} />
        <span className="text-xs font-semibold uppercase" style={{ color: style.color }}>
          Rank {player.rank}
        </span>
      </div>
      <div className="mb-4 flex justify-center">
        <Avatar
          src={player.avatarUrl}
          alt={player.username}
          size="lg"
          className="h-20 w-20 ring-2 ring-zinc-700"
        />
      </div>
      <h3 className="text-center text-lg font-bold text-white">{player.username}</h3>
      <p
        className="mt-4 flex items-center justify-center gap-1.5 text-2xl font-bold"
        style={{ color: "#7c3aed" }}
      >
        {formatScore(player.totalScore)}
        <span className="text-sm font-medium text-zinc-500">score</span>
      </p>
      <div className="mt-4 flex justify-center gap-4 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <GithubIcon /> {player.githubCommits.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <LeetcodeIcon /> {player.leetcodeSolved}
        </span>
        <span className="flex items-center gap-1">
          <KeyboardIcon /> {player.monkeytypeRecord} WPM
        </span>
      </div>
    </Link>
  );
}

function MobilePodiumCard({ player }: { player: LeaderboardUser }) {
  const rank = player.rank as 1 | 2 | 3;
  const style = PODIUM_ACCENT[rank];
  const isFirst = rank === 1;

  return (
    <Link
      href={profileHref(player.username)}
      className="flex w-full items-center gap-4 rounded-2xl p-4 transition-all hover:brightness-105"
      style={{
        backgroundColor: "#111",
        border: isFirst ? "1.5px solid #7c3aed" : "1px solid #1e1e1e",
        boxShadow: isFirst ? "0 0 16px rgba(124,58,237,0.35)" : "none",
      }}
    >
      <div className="flex w-12 shrink-0 flex-col items-center gap-1">
        <CupIcon rank={rank} />
        <span className="text-[10px] font-bold uppercase" style={{ color: style.color }}>
          #{player.rank}
        </span>
      </div>

      <Avatar
        src={player.avatarUrl}
        alt={player.username}
        size="md"
        className="h-14 w-14 shrink-0 ring-2 ring-zinc-700"
      />

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-bold text-white">{player.username}</h3>
        <p className="mt-0.5 text-lg font-bold" style={{ color: "#7c3aed" }}>
          {formatScore(player.totalScore)}
          <span className="ml-1 text-xs font-medium text-zinc-500">score</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <GithubIcon /> {player.githubCommits.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <LeetcodeIcon /> {player.leetcodeSolved}
          </span>
          <span className="flex items-center gap-1">
            <KeyboardIcon /> {player.monkeytypeRecord} WPM
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function LeaderboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const profileMe = useProfileMeStore((s) => s.profile);
  const { users, isLoading, currentUser, currentUserRank } = useFetchLeaderboard();

  const currentUserDisplayName = useMemo(() => {
    if (!profileMe) return "You";
    const full = [profileMe.firstName, profileMe.lastName].filter(Boolean).join(" ").trim();
    return full || profileMe.username || "You";
  }, [profileMe]);

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.username.toLowerCase().includes(q));
  }, [users, searchQuery]);

  const podiumUsers = useMemo(() => filteredUsers.slice(0, 3), [filteredUsers]);

  const podiumDisplayOrder = useMemo(
    () => buildPodiumDisplayOrder(podiumUsers),
    [podiumUsers],
  );

  const mobilePodiumOrder = podiumUsers;

  const tableUsers = useMemo(
    () => filteredUsers.slice(3),
    [filteredUsers],
  );

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return tableUsers.slice(start, start + PAGE_SIZE);
  }, [tableUsers, currentPage]);

  const totalPages = Math.max(1, Math.ceil(tableUsers.length / PAGE_SIZE));
  const startItem = tableUsers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, tableUsers.length);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-6 flex justify-center">
          <span
            className="rounded-full border px-4 py-1.5 text-sm font-medium text-zinc-300"
            style={{ borderColor: "#7c3aed", boxShadow: "0 0 12px rgba(124,58,237,0.3)" }}
          >
            The Arena
          </span>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-white md:text-5xl">Global Leaderboard</h1>
          <p className="mt-3 mx-auto max-w-2xl text-zinc-500">
            Compete with the top developers worldwide. Rankings combine GitHub, LeetCode, and
            Monkeytype activity.
          </p>
        </div>

        {isLoading && users.length === 0 ? (
          <div className="mb-16 flex justify-center py-16 text-zinc-500">Loading rankings…</div>
        ) : users.length === 0 ? (
          <div className="mb-16 flex flex-col items-center py-16 text-center">
            <p className="text-lg text-zinc-400">No rankings yet</p>
            <p className="mt-2 text-sm text-zinc-600">
              Connect your accounts and start contributing to appear here.
            </p>
          </div>
        ) : (
          <>
            {podiumDisplayOrder.length > 0 && (
              <>
                <div className="mb-16 flex flex-col gap-3 lg:hidden">
                  {mobilePodiumOrder.map((player) => (
                    <MobilePodiumCard key={player.id} player={player} />
                  ))}
                </div>
                <div
                  className={`mb-16 hidden items-end justify-center gap-8 lg:flex ${
                    podiumDisplayOrder.length === 1 ? "justify-center" : ""
                  }`}
                >
                  {podiumDisplayOrder.map((player) => (
                    <PodiumCard key={player.id} player={player} />
                  ))}
                </div>
              </>
            )}

            {(tableUsers.length > 0 || searchQuery.trim()) && (
              <div
                className="rounded-2xl p-6"
                style={{ backgroundColor: "#0f0f0f", border: "1px solid #1e1e1e" }}
              >
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-zinc-500">
                    {users.length} developer{users.length === 1 ? "" : "s"} ranked
                  </p>
                  <div className="relative flex-1 sm:max-w-xs sm:flex-none">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Search developers..."
                      className="w-full rounded-lg border border-[#2a2a2a] bg-[#111] py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:border-[#7c3aed] focus:outline-none"
                    />
                  </div>
                </div>

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
                        <th className="hidden pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500 md:table-cell">
                          GitHub
                        </th>
                        <th className="hidden pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500 lg:table-cell">
                          LeetCode
                        </th>
                        <th className="hidden pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500 lg:table-cell">
                          WPM
                        </th>
                        <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-zinc-500">
                          Score
                        </th>
                        <th className="pb-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedRows.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-zinc-500">
                            No developers found. Try another search.
                          </td>
                        </tr>
                      )}
                      {paginatedRows.map((row) => (
                        <tr
                          key={row.id}
                          className="cursor-pointer border-b border-[#1e1e1e] transition-colors hover:bg-[#161616]"
                          onClick={() => {
                            window.location.href = profileHref(row.username);
                          }}
                        >
                          <td className="py-4 text-zinc-500">#{row.rank}</td>
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <Avatar src={row.avatarUrl} alt={row.username} size="sm" />
                              <p className="font-medium text-white">{row.username}</p>
                            </div>
                          </td>
                          <td className="hidden py-4 md:table-cell">
                            <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                              <GithubIcon /> {row.githubCommits.toLocaleString()}
                            </span>
                          </td>
                          <td className="hidden py-4 lg:table-cell">
                            <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                              <LeetcodeIcon /> {row.leetcodeSolved}
                            </span>
                          </td>
                          <td className="hidden py-4 lg:table-cell">
                            <span className="flex items-center gap-1.5 text-sm text-zinc-400">
                              <KeyboardIcon /> {row.monkeytypeRecord}
                            </span>
                          </td>
                          <td className="py-4">
                            <p className="font-bold text-white">{formatScore(row.totalScore)}</p>
                          </td>
                          <td className="py-4 text-zinc-500">›</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {tableUsers.length > PAGE_SIZE && (
                  <div className="mt-6 flex flex-col gap-4 border-t border-[#1e1e1e] pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-zinc-500">
                      Showing {startItem}-{endItem} of {tableUsers.length} developers
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                        className="rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm text-zinc-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ backgroundColor: "#111" }}
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                        className="rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm text-zinc-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        style={{ backgroundColor: "#111" }}
                      >
                        Next Page
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {isAuthenticated && currentUser && currentUserRank != null && (
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
                #{currentUserRank}
              </span>
              <Avatar
                src={currentUser.avatarUrl}
                alt={currentUserDisplayName}
                size="md"
                className="h-12 w-12"
              />
              <div>
                <p className="font-bold text-white">You ({currentUserDisplayName})</p>
                <p className="text-sm text-zinc-400">
                  GitHub {currentUser.githubCommits.toLocaleString()} · LeetCode{" "}
                  {currentUser.leetcodeSolved} · {currentUser.monkeytypeRecord} WPM
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xl font-bold" style={{ color: "#a78bfa" }}>
                  {formatScore(currentUser.totalScore)} score
                </p>
              </div>
              <Link
                href="/profile"
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

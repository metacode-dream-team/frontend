import type { LeaderboardUser } from "@/shared/types/leaderboard";
import { extractArrayPayload } from "./platformMappers";

type Json = Record<string, unknown>;

function str(v: unknown, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  return String(v);
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isNaN(n) ? fallback : n;
  }
  return fallback;
}

function avatarFallback(username: string): string {
  const seed = encodeURIComponent(username || "user");
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}`;
}

function mapLeaderboardEntry(
  raw: unknown,
  currentUserId?: string | null,
): LeaderboardUser | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Json;

  const user = (o.user as Json | undefined) ?? {};
  const github = (o.github as Json | undefined) ?? {};
  const leetcode = (o.leetcode as Json | undefined) ?? {};
  const monkeyType =
    (o.monkey_type as Json | undefined) ??
    (o.monkeyType as Json | undefined) ??
    {};

  const userId = str(o.user_id ?? user.user_id ?? user.userId).trim();
  if (!userId) return null;

  const username = str(user.username ?? o.username, "user").trim() || "user";
  const wpmRaw = num(monkeyType.wpm ?? monkeyType.Wpm, 0);

  return {
    id: userId,
    rank: 0,
    username,
    avatarUrl:
      str(user.avatar_url ?? user.avatarUrl ?? o.avatar_url).trim() ||
      avatarFallback(username),
    totalScore: num(o.total_score ?? o.totalScore, 0),
    githubCommits: num(
      github.total_contributed ?? github.totalContributed,
      0,
    ),
    leetcodeSolved: num(leetcode.total_solved ?? leetcode.totalSolved, 0),
    monkeytypeRecord: Math.round(wpmRaw * 10) / 10,
    isCurrentUser: Boolean(
      currentUserId && userId.toLowerCase() === currentUserId.toLowerCase(),
    ),
  };
}

export function mapGlobalLeaderboardPayload(
  raw: unknown,
  currentUserId?: string | null,
): LeaderboardUser[] {
  const list = extractArrayPayload(raw);

  const out: LeaderboardUser[] = [];
  for (const item of list) {
    const mapped = mapLeaderboardEntry(item, currentUserId);
    if (mapped) out.push(mapped);
  }

  const sorted = out.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (a.username !== b.username) return a.username.localeCompare(b.username);
    return a.id.localeCompare(b.id);
  });

  return sorted.map((user, index) => ({
    ...user,
    rank: index + 1,
  }));
}

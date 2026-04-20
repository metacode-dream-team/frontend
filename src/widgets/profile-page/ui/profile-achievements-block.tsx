"use client";

import Link from "next/link";
import type { ProfileAchievement } from "@/entities/profile";
import { cn } from "@/shared/lib/utils/cn";

const toneBorder: Record<ProfileAchievement["tone"], string> = {
  emerald: "border-l-emerald-500/80",
  amber: "border-l-amber-400/80",
  violet: "border-l-violet-500/80",
};

function previewAchievements(all: ProfileAchievement[]): ProfileAchievement[] {
  const unlocked = all.filter((a) => a.unlocked);
  const need = 2;
  const pick =
    unlocked.length >= need ? unlocked.slice(0, need) : [...unlocked, ...all.filter((a) => !a.unlocked)].slice(0, need);
  return pick;
}

interface ProfileAchievementsBlockProps {
  profileSlug: string;
  achievements: ProfileAchievement[];
}

export function ProfileAchievementsBlock({ profileSlug, achievements }: ProfileAchievementsBlockProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const latest = achievements.find((a) => a.unlocked && a.unlockedAt);
  const preview = previewAchievements(achievements);

  return (
    <section className="flex w-full flex-col rounded-2xl bg-zinc-900/55 p-3 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-[2px] sm:p-4">
      <div className="flex shrink-0 items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-white">Achievements</h3>
        <span className="text-2xl font-bold tabular-nums text-white">
          {unlockedCount}
          <span className="text-sm font-semibold text-zinc-500">/{achievements.length}</span>
        </span>
      </div>

      <ul className="mt-5 space-y-3">
        {preview.map((a) => (
          <li
            key={a.id}
            className={cn(
              "rounded-xl border border-zinc-800/90 border-l-4 bg-zinc-950/50 px-3 py-2.5",
              toneBorder[a.tone],
              !a.unlocked && "opacity-55",
            )}
          >
            <p className="text-sm font-medium text-zinc-100">{a.title}</p>
            <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-zinc-500">{a.description}</p>
            {a.unlocked && a.unlockedAt ? (
              <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-zinc-600">{a.unlockedAt}</p>
            ) : null}
            {!a.unlocked ? <p className="mt-1 text-[10px] font-medium text-zinc-600">Locked</p> : null}
          </li>
        ))}
      </ul>

      <div className="mt-4 shrink-0 space-y-3">
        {latest ? (
          <p className="text-xs leading-relaxed text-zinc-500">
            Latest: <span className="font-medium text-zinc-200">{latest.title}</span>
            {latest.unlockedAt ? <span className="text-zinc-600"> · {latest.unlockedAt}</span> : null}
          </p>
        ) : null}
        <Link
          href={`/profile/${encodeURIComponent(profileSlug)}/achievements`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800/90 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          All achievements
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

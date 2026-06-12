"use client";

import Link from "next/link";
import type { ProfileAchievement } from "@/entities/profile";
import { AchievementLogo } from "./achievement-logo";

function previewAchievements(all: ProfileAchievement[], need: number): ProfileAchievement[] {
  const unlocked = all.filter((a) => a.unlocked);
  return unlocked.length >= need
    ? unlocked.slice(0, need)
    : [...unlocked, ...all.filter((a) => !a.unlocked)].slice(0, need);
}

interface ProfileAchievementsBlockProps {
  profileSlug: string;
  achievements: ProfileAchievement[];
}

export function ProfileAchievementsBlock({ profileSlug, achievements }: ProfileAchievementsBlockProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const latest = achievements.find((a) => a.unlocked && a.unlockedAt);
  const mobilePreview = previewAchievements(achievements, 2);
  const desktopPreview = previewAchievements(achievements, 4);

  return (
    <section className="flex w-full flex-col rounded-2xl bg-zinc-900/55 px-3 py-2 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.65)] backdrop-blur-[2px] sm:px-4 sm:py-2.5">
      <div className="flex shrink-0 items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold text-white">Achievements</h3>
        <span className="text-2xl font-bold tabular-nums text-white">
          {unlockedCount}
          <span className="text-sm font-semibold text-zinc-500">/{achievements.length}</span>
        </span>
      </div>

      <div className="mt-2.5 flex flex-wrap items-center gap-3 pl-2 xl:hidden">
        {mobilePreview.map((a) => (
          <AchievementLogo key={a.id} achievement={a} size="xl" />
        ))}
      </div>

      <div className="mt-2.5 hidden flex-wrap items-center gap-3 pl-2 xl:flex">
        {desktopPreview.map((a) => (
          <AchievementLogo key={a.id} achievement={a} size="xl" />
        ))}
      </div>

      <div className="mt-2 shrink-0 space-y-2">
        {latest ? (
          <p className="text-xs leading-relaxed text-zinc-500">
            Latest: <span className="font-medium text-zinc-200">{latest.title}</span>
            {latest.unlockedAt ? <span className="text-zinc-600"> · {latest.unlockedAt}</span> : null}
          </p>
        ) : null}
        <Link
          href={`/profile/${encodeURIComponent(profileSlug)}/achievements`}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800/90 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white"
        >
          All achievements
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

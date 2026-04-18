import Link from "next/link";
import type { ProfileAchievement } from "@/entities/profile";
import { cn } from "@/shared/lib/utils/cn";

const toneBorder: Record<ProfileAchievement["tone"], string> = {
  emerald: "border-l-emerald-500/80",
  amber: "border-l-amber-400/80",
  violet: "border-l-violet-500/80",
};

interface ProfileAchievementsPageContentProps {
  profileId: string;
  username: string;
  achievements: ProfileAchievement[];
}

export function ProfileAchievementsPageContent({
  profileId,
  username,
  achievements,
}: ProfileAchievementsPageContentProps) {
  const unlocked = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="mx-auto max-w-3xl">
      <nav className="mb-6">
        <Link
          href={`/profile/${encodeURIComponent(profileId)}`}
          className="text-sm font-medium text-zinc-500 transition-colors hover:text-[#b84dff]"
        >
          ← Back to profile
        </Link>
      </nav>

      <header className="mb-8 border-b border-zinc-800/80 pb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Achievements</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white">{username}</h1>
        <p className="mt-2 text-sm text-zinc-400">
          <span className="font-semibold tabular-nums text-zinc-200">{unlocked}</span> unlocked out of{" "}
          <span className="tabular-nums text-zinc-500">{achievements.length}</span>
        </p>
      </header>

      <ul className="space-y-3">
        {achievements.map((a) => (
          <li
            key={a.id}
            className={cn(
              "rounded-xl border border-zinc-800/90 border-l-4 bg-zinc-900/40 px-4 py-3 sm:px-5 sm:py-4",
              toneBorder[a.tone],
              !a.unlocked && "bg-zinc-950/30 opacity-60",
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-base font-medium text-zinc-100">{a.title}</p>
              {!a.unlocked ? (
                <span className="shrink-0 rounded-md bg-zinc-800/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                  Locked
                </span>
              ) : a.unlockedAt ? (
                <span className="shrink-0 text-xs font-medium text-zinc-500">{a.unlockedAt}</span>
              ) : null}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">{a.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

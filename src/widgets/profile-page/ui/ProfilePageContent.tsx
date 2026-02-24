"use client";

import { useMemo } from "react";
import type { ProfileData } from "@/entities/profile";

interface ProfilePageContentProps {
  profile: ProfileData;
}

function intensityClass(count: number): string {
  if (count === 0) return "bg-slate-800";
  if (count <= 3) return "bg-emerald-900";
  if (count <= 6) return "bg-emerald-700";
  if (count <= 9) return "bg-emerald-500";
  return "bg-emerald-300";
}

function difficultyColor(level: "Easy" | "Medium" | "Hard"): string {
  if (level === "Easy") return "text-emerald-300";
  if (level === "Medium") return "text-amber-300";
  return "text-rose-300";
}

export function ProfilePageContent({ profile }: ProfilePageContentProps) {
  const totalYearSubmissions = profile.heatmap.reduce((acc, day) => acc + day.count, 0);
  const totalCircle = 2 * Math.PI * 92;
  const segmentGap = totalCircle * 0.06;
  const segmentLength = (totalCircle - segmentGap * 3) / 3;
  const heatmapData = useMemo(() => {
    const points = [...profile.heatmap].sort((a, b) => a.date.localeCompare(b.date));
    const firstDate = new Date(`${points[0]?.date ?? ""}T00:00:00`);
    const leadingEmpty = Number.isNaN(firstDate.getTime()) ? 0 : firstDate.getDay();

    const cells: Array<{ date: string; count: number } | null> = [
      ...Array.from({ length: leadingEmpty }, () => null),
      ...points,
    ];

    const weekCount = Math.ceil(cells.length / 7);
    const monthLabels: Array<{ label: string; column: number }> = [];

    points.forEach((point, index) => {
      const date = new Date(`${point.date}T00:00:00`);
      if (Number.isNaN(date.getTime())) return;

      if (index === 0 || date.getDate() === 1) {
        const column = Math.floor((leadingEmpty + index) / 7);
        const label = date.toLocaleString("en-US", { month: "short" });
        const alreadyAdded = monthLabels.some((item) => item.column === column);
        if (!alreadyAdded) {
          monthLabels.push({ label, column });
        }
      }
    });

    return { cells, weekCount, monthLabels };
  }, [profile.heatmap]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[310px_1fr]">
      <aside className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
        <div className="flex items-center gap-3">
          <img src={profile.avatarUrl} alt={profile.username} className="h-16 w-16 rounded-xl" />
          <div>
            <p className="text-lg font-semibold text-slate-100">{profile.username}</p>
            <p className="text-xs text-slate-400">{profile.fullName}</p>
          </div>
        </div>

        <p className="mt-3 text-slate-300">Rank ~{profile.rank.toLocaleString()}</p>
        <p className="mt-1 text-sm text-slate-400">
          {profile.following} Following | {profile.followers} Followers
        </p>

        <button className="mt-4 w-full rounded-lg bg-emerald-900/50 px-4 py-2 text-sm font-medium text-emerald-200 hover:bg-emerald-800/60">
          Edit Profile
        </button>

        <section className="mt-6 border-t border-slate-800 pt-4">
          <h3 className="text-base font-semibold text-slate-100">Community Stats</h3>
          <ul className="mt-2 space-y-2 text-sm">
            {profile.communityStats.map((stat) => (
              <li key={stat.label} className="flex items-center justify-between text-slate-300">
                <span>{stat.label}</span>
                <span>
                  {stat.value} <span className="text-xs text-slate-500">(+{stat.lastWeek}/week)</span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 border-t border-slate-800 pt-4">
          <h3 className="text-base font-semibold text-slate-100">Languages</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-300">
            {profile.languages.map((language) => (
              <li key={language.name} className="flex items-center justify-between">
                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs">{language.name}</span>
                <span>{language.solved} solved</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6 border-t border-slate-800 pt-4">
          <h3 className="text-base font-semibold text-slate-100">Skills</h3>
          <div className="mt-2 space-y-3">
            {profile.skills.map((group) => (
              <div key={group.level}>
                <p className="mb-2 text-xs uppercase text-slate-500">{group.level}</p>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item.name} className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">
                      {item.name} x{item.count}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>

      <main className="space-y-4">
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,1fr)]">
          <article className="rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900/95 to-slate-900/65 p-5">
            <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
              <div className="flex items-center justify-center rounded-xl border border-slate-800/60 bg-slate-900/35 py-3">
                <div className="relative flex h-[220px] w-[220px] items-center justify-center">
                  <div
                    className="h-[190px] w-[190px] rounded-full"
                    style={{
                      background:
                        "conic-gradient(from 215deg, #2dd4bf 0% 23%, transparent 23% 30%, #facc15 30% 58%, transparent 58% 65%, #ef4444 65% 86%, #1e293b 86% 100%)",
                    }}
                  />
                  <div className="absolute h-[170px] w-[170px] rounded-full bg-slate-900/95" />
                  <span className="absolute left-[18px] top-[100px] h-3 w-3 rounded-full bg-teal-300" />
                  <span className="absolute left-[70px] top-[28px] h-3 w-3 rounded-full bg-amber-300" />
                  <span className="absolute right-[20px] top-[108px] h-3 w-3 rounded-full bg-rose-400" />

                  <div className="absolute text-center">
                    <p className="text-4xl font-bold leading-none text-slate-100">{profile.solved}</p>
                    <p className="mt-1 text-xl font-medium text-slate-300">/{profile.totalProblems}</p>
                    <p className="mt-2 text-3xl font-semibold text-slate-100">Solved</p>
                    <p className="mt-2 text-sm font-medium text-slate-400">0 Attempting</p>
                  </div>
                </div>
              </div>

              <div className="w-full space-y-3">
                <div className="rounded-xl border border-slate-700/80 bg-slate-800/85 px-4 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <p className="text-2xl font-semibold text-teal-300">Easy</p>
                  <p className="mt-1 text-3xl font-bold leading-none text-slate-100 tabular-nums">
                    {profile.easySolved}/{profile.easyTotal}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700/80 bg-slate-800/85 px-4 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <p className="text-2xl font-semibold text-amber-300">Med.</p>
                  <p className="mt-1 text-3xl font-bold leading-none text-slate-100 tabular-nums">
                    {profile.mediumSolved}/{profile.mediumTotal}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-700/80 bg-slate-800/85 px-4 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
                  <p className="text-2xl font-semibold text-rose-300">Hard</p>
                  <p className="mt-1 text-3xl font-bold leading-none text-slate-100 tabular-nums">
                    {profile.hardSolved}/{profile.hardTotal}
                  </p>
                </div>
              </div>
            </div>
          </article>

          <article className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
            <h3 className="text-base font-semibold text-slate-100">Badges</h3>
            <p className="mt-2 text-4xl font-bold text-slate-100">{profile.badges}</p>
            <p className="mt-3 text-sm text-slate-400">Current streak: {profile.currentStreak} days</p>
            <p className="text-sm text-slate-400">Best streak: {profile.maxStreak} days</p>
          </article>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-2xl font-semibold text-slate-100">
              {totalYearSubmissions} submissions in the past year
            </h3>
            <span className="text-sm text-slate-400">Total active days: {profile.heatmap.filter((day) => day.count > 0).length}</span>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60 p-3">
            <div className="min-w-[760px]">
              <div className="grid grid-flow-col grid-rows-7 gap-1">
                {heatmapData.cells.map((day, index) =>
                  day ? (
                    <div
                      key={day.date}
                      title={`${day.date}: ${day.count}`}
                      className={`h-3 w-3 rounded-sm ${intensityClass(day.count)}`}
                    />
                  ) : (
                    <div key={`empty-${index}`} className="h-3 w-3 rounded-sm opacity-0" />
                  ),
                )}
              </div>

              <div className="relative mt-3 h-6">
                {heatmapData.monthLabels.map((month) => {
                  const left = heatmapData.weekCount > 1
                    ? (month.column / (heatmapData.weekCount - 1)) * 100
                    : 0;

                  return (
                    <span
                      key={`${month.label}-${month.column}`}
                      className="absolute -translate-x-1/2 text-[11px] text-slate-500"
                      style={{ left: `${left}%` }}
                    >
                      {month.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-100">Recent AC</h3>
            <button className="text-sm text-slate-400 hover:text-slate-200">View all submissions</button>
          </div>

          <div className="space-y-2">
            {profile.recentSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between rounded-md border border-slate-800 bg-slate-800/40 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-slate-100">{submission.title}</p>
                  <p className={`text-xs ${difficultyColor(submission.difficulty)}`}>{submission.difficulty}</p>
                </div>
                <p className="text-sm text-slate-400">{submission.solvedAt}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils/cn";

const TIMEFRAME_TABS = [
  { id: "now", label: "Now" },
  { id: "next", label: "Next" },
  { id: "later", label: "Later" },
  { id: "backlog", label: "Backlog" },
] as const;

type TimeframeId = (typeof TIMEFRAME_TABS)[number]["id"];

type CardStatus = "planned" | "progress" | "done";

const LANES: {
  id: Exclude<TimeframeId, "backlog">;
  title: string;
  subtitle: string;
  progress: number;
  cards: {
    title: string;
    description: string;
    status: CardStatus;
    target: string;
    owners: number;
  }[];
}[] = [
  {
    id: "now",
    title: "Now",
    subtitle: "ACTIVE DEVELOPMENT",
    progress: 78,
    cards: [
      {
        title: "Neural Engine V2",
        description:
          "A new data processing layer and faster compute paths for heavy workloads.",
        status: "progress",
        target: "Q3 2024",
        owners: 3,
      },
      {
        title: "Global Sync Protocol",
        description:
          "Real-time state sync across clients with resilience and conflict handling.",
        status: "progress",
        target: "Q3 2024",
        owners: 2,
      },
      {
        title: "CI/CD Matrix Integration",
        description:
          "One deployment and verification pipeline for every service in the MetaCode stack.",
        status: "done",
        target: "Q2 2024",
        owners: 4,
      },
    ],
  },
  {
    id: "next",
    title: "Next",
    subtitle: "NEXT IN LINE",
    progress: 32,
    cards: [
      {
        title: "Visual Logic Architect",
        description:
          "A visual builder for logic and flows without leaving the editor surface.",
        status: "planned",
        target: "Q4 2024",
        owners: 2,
      },
      {
        title: "AI Code Reviewer",
        description:
          "Context-aware hints for code quality and security before you ship.",
        status: "planned",
        target: "Q4 2024",
        owners: 3,
      },
    ],
  },
  {
    id: "later",
    title: "Later",
    subtitle: "FUTURE HORIZONS",
    progress: 10,
    cards: [
      {
        title: "MetaCode SDK V3",
        description:
          "A public SDK for extensions and third-party integrations on the platform.",
        status: "planned",
        target: "H1 2025",
        owners: 2,
      },
      {
        title: "Decentralized Storage",
        description:
          "Optional distributed storage for artifacts and encrypted backups.",
        status: "planned",
        target: "H2 2025",
        owners: 1,
      },
    ],
  },
];

const TEAMS = [
  "Core Engine",
  "UI/UX",
  "Security",
  "Integrations",
] as const;

const CHANGELOG_LEFT = [
  {
    date: "MAY 24",
    tag: "Feature",
    text: "WebAssembly support added to the sandbox runtime",
  },
  {
    date: "MAY 18",
    tag: "Security",
    text: "Critical XSS vulnerability patched in the editor",
  },
  {
    date: "MAY 12",
    tag: "Performance",
    text: "Asset loading optimized by ~40%",
  },
];

const CHANGELOG_RIGHT = [
  {
    date: "MAY 05",
    tag: "Beta",
    text: "API v2 public beta is live",
  },
  {
    date: "APR 29",
    tag: "Feature",
    text: "Docker Desktop integration for local test runs",
  },
  {
    date: "APR 22",
    tag: "Auth",
    text: "OAuth authentication stack refreshed",
  },
];

function statusLabel(s: CardStatus) {
  if (s === "done") {
    return "Complete";
  }
  if (s === "progress") {
    return "In progress";
  }
  return "Planned";
}

function statusStyles(s: CardStatus) {
  if (s === "done") {
    return "border-emerald-500/35 bg-emerald-950/40 text-emerald-200";
  }
  if (s === "progress") {
    return "border-violet-500/40 bg-violet-950/50 text-violet-200";
  }
  return "border-zinc-600/60 bg-zinc-900/70 text-zinc-300";
}

function HeroBolt() {
  return (
    <svg
      className="h-32 w-32 shrink-0 text-violet-500/90 drop-shadow-[0_0_28px_rgba(168,85,247,0.55)] sm:h-40 sm:w-40"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
  );
}

function OwnerAvatars({ count }: { count: number }) {
  return (
    <div className="flex -space-x-1.5">
      {Array.from({ length: Math.min(count, 4) }).map((_, i) => (
        <span
          key={i}
          className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-black bg-gradient-to-br from-zinc-600 to-zinc-800 text-[9px] font-bold text-zinc-200"
          aria-hidden
        >
          {String.fromCharCode(65 + i)}
        </span>
      ))}
    </div>
  );
}

export default function RoadmapsPage() {
  const [timeframe, setTimeframe] = useState<TimeframeId>("now");
  const [period, setPeriod] = useState<"quarter" | "year">("quarter");
  const [priority, setPriority] = useState<"critical" | "high" | "medium">(
    "high",
  );
  const [teams, setTeams] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(TEAMS.map((t) => [t, false])),
  );

  const toggleTeam = (t: string) => {
    setTeams((prev) => ({ ...prev, [t]: !prev[t] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-10">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-2xl border border-zinc-800/70 bg-[#09090b] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset,0_24px_64px_rgba(0,0,0,0.5)] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.12),transparent_55%)]" />
          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-violet-500/35 bg-violet-950/50 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
                Vision 2024
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                <span className="text-white">Meta</span>
                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  Roadmap
                </span>
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400 sm:text-base">
                Explore what&apos;s next for the MetaCode ecosystem. We&apos;re
                building next-generation tools for the architects of the digital
                world.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <HeroBolt />
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-800/80 bg-zinc-950/50 p-1">
            {TIMEFRAME_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setTimeframe(tab.id)}
                className={cn(
                  "rounded-lg px-3 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm",
                  timeframe === tab.id
                    ? "bg-violet-600 text-white shadow-[0_0_16px_rgba(139,92,246,0.35)]"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white",
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-black/40 p-1">
              <button
                type="button"
                onClick={() => setPeriod("quarter")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold uppercase tracking-wide",
                  period === "quarter"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                Quarter
              </button>
              <button
                type="button"
                onClick={() => setPeriod("year")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-xs font-semibold",
                  period === "year"
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-500 hover:text-zinc-300",
                )}
              >
                Year
              </button>
            </div>
            <Button
              type="button"
              variant="accent"
              className="gap-2 rounded-lg px-4 py-2 text-sm font-semibold"
            >
              <span className="text-lg leading-none">+</span>
              Submit idea
            </Button>
          </div>
        </div>

        {/* Main grid + sidebar */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(0,280px)] xl:grid-cols-[1fr_300px]">
          <div className="grid gap-4 md:grid-cols-3 md:items-start">
            {LANES.map((lane) => (
              <section
                key={lane.id}
                className="flex min-h-0 flex-col rounded-2xl border border-zinc-800/60 bg-[#09090b] p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-lg font-bold text-white">{lane.title}</h2>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      {lane.subtitle}
                    </p>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-violet-300">
                    {lane.progress}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-[0_0_12px_rgba(168,85,247,0.45)]"
                    style={{ width: `${lane.progress}%` }}
                  />
                </div>
                <div className="mt-5 flex flex-col gap-3">
                  {lane.cards.map((card) => (
                    <article
                      key={card.title}
                      className="rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-4 shadow-[inset_0_1px_0_0_rgba(168,85,247,0.06)]"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                            statusStyles(card.status),
                          )}
                        >
                          {statusLabel(card.status)}
                        </span>
                        <span className="text-[10px] font-semibold text-zinc-500">
                          {card.target}
                        </span>
                      </div>
                      <h3 className="mt-3 text-sm font-bold text-white">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                        {card.description}
                      </p>
                      <div className="mt-4 flex items-center justify-between">
                        <OwnerAvatars count={card.owners} />
                        <span className="text-zinc-600" aria-hidden>
                          ›
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="flex flex-col gap-5 rounded-2xl border border-zinc-800/60 bg-[#09090b] p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
              System filters
            </h2>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Teams
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {TEAMS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleTeam(t)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      teams[t]
                        ? "border-violet-500/50 bg-violet-950/50 text-violet-200"
                        : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Priority
              </p>
              <ul className="mt-2 space-y-2">
                {(
                  [
                    { id: "critical" as const, label: "Critical", dot: "bg-red-500" },
                    { id: "high" as const, label: "High", dot: "bg-amber-400" },
                    { id: "medium" as const, label: "Medium", dot: "bg-zinc-500" },
                  ]
                ).map((opt) => (
                  <li key={opt.id}>
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
                      <input
                        type="radio"
                        name="priority"
                        checked={priority === opt.id}
                        onChange={() => setPriority(opt.id)}
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          "flex h-4 w-4 items-center justify-center rounded-full border",
                          priority === opt.id
                            ? "border-violet-500 bg-violet-600/30"
                            : "border-zinc-600",
                        )}
                      >
                        <span className={cn("h-2 w-2 rounded-full", opt.dot)} />
                      </span>
                      {opt.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Status legend
              </p>
              <ul className="mt-2 space-y-2 text-xs text-zinc-400">
                <li className="flex items-center gap-2">
                  <span className="h-0.5 w-6 rounded-full bg-violet-500" />
                  Planned
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-0.5 w-6 rounded-full bg-violet-300/70" />
                  In development
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-0.5 w-6 rounded-full bg-zinc-200" />
                  Completed
                </li>
              </ul>
            </div>

            <button
              type="button"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
            >
              Customize view (JSON)
            </button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-violet-500/40 bg-violet-950/20 py-2 text-sm font-semibold text-violet-200 hover:bg-violet-950/40 hover:text-white"
            >
              Watch releases
            </Button>
          </aside>
        </div>

        {/* Changelog — no outer border */}
        <section className="mt-16 bg-transparent p-0 sm:p-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-950/50 text-violet-400">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </span>
              <h2 className="text-lg font-bold text-white">Changelog</h2>
            </div>
            <Link
              href="/feed"
              className="text-sm font-semibold text-violet-400 transition-colors hover:text-violet-300"
            >
              Full changelog →
            </Link>
          </div>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            <ul className="space-y-0 divide-y divide-zinc-800/80">
              {CHANGELOG_LEFT.map((row) => (
                <li
                  key={row.date + row.text}
                  className="flex gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 gap-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-white">
                        {row.date}
                      </span>
                      <span className="rounded-md border border-zinc-700 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                        {row.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-300">{row.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <ul className="space-y-0 divide-y divide-zinc-800/80">
              {CHANGELOG_RIGHT.map((row) => (
                <li
                  key={row.date + row.text}
                  className="flex gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 gap-y-1">
                      <span className="text-[11px] font-bold uppercase tracking-wide text-white">
                        {row.date}
                      </span>
                      <span className="rounded-md border border-zinc-700 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-semibold text-zinc-300">
                        {row.tag}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-300">{row.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-zinc-500">
          Need the graph editor and canvas?{" "}
          <Link
            href="/roadmaps/studio"
            className="font-semibold text-violet-400 hover:text-violet-300"
          >
            Open studio
          </Link>
        </p>
      </div>
    </div>
  );
}

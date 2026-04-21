"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils/cn";

const TIMEFRAME_TABS = [
  { id: "all", label: "All" },
  { id: "now", label: "Now" },
  { id: "next", label: "Next" },
  { id: "later", label: "Later" },
  { id: "backlog", label: "Backlog" },
] as const;

type TimeframeId = (typeof TIMEFRAME_TABS)[number]["id"];
type LaneId = "now" | "next" | "later";
type CardStatus = "planned" | "progress" | "done";
type Priority = "critical" | "high" | "medium";
type PriorityFilter = Priority | "all";

const TEAMS = [
  "Core Engine",
  "UI/UX",
  "Security",
  "Integrations",
] as const;
type Team = (typeof TEAMS)[number];

interface RoadmapCard {
  id: string;
  lane: LaneId;
  title: string;
  description: string;
  status: CardStatus;
  target: string;
  owners: number;
  teams: Team[];
  priority: Priority;
}

const LANE_META: Record<LaneId, { title: string; subtitle: string }> = {
  now: { title: "Now", subtitle: "ACTIVE DEVELOPMENT" },
  next: { title: "Next", subtitle: "NEXT IN LINE" },
  later: { title: "Later", subtitle: "FUTURE HORIZONS" },
};

const LANE_ORDER: LaneId[] = ["now", "next", "later"];

const STATUS_CYCLE: CardStatus[] = ["planned", "progress", "done"];

const STORAGE_KEY = "metacode-roadmap-cards-v1";

const INITIAL_CARDS: RoadmapCard[] = [
  {
    id: "neural-engine-v2",
    lane: "now",
    title: "Neural Engine V2",
    description:
      "A new data processing layer and faster compute paths for heavy workloads.",
    status: "progress",
    target: "Q3 2024",
    owners: 3,
    teams: ["Core Engine", "Security"],
    priority: "critical",
  },
  {
    id: "global-sync-protocol",
    lane: "now",
    title: "Global Sync Protocol",
    description:
      "Real-time state sync across clients with resilience and conflict handling.",
    status: "progress",
    target: "Q3 2024",
    owners: 2,
    teams: ["Core Engine", "Integrations"],
    priority: "high",
  },
  {
    id: "cicd-matrix",
    lane: "now",
    title: "CI/CD Matrix Integration",
    description:
      "One deployment and verification pipeline for every service in the MetaCode stack.",
    status: "done",
    target: "Q2 2024",
    owners: 4,
    teams: ["Integrations", "UI/UX"],
    priority: "medium",
  },
  {
    id: "visual-logic-architect",
    lane: "next",
    title: "Visual Logic Architect",
    description:
      "A visual builder for logic and flows without leaving the editor surface.",
    status: "planned",
    target: "Q4 2024",
    owners: 2,
    teams: ["UI/UX", "Core Engine"],
    priority: "high",
  },
  {
    id: "ai-code-reviewer",
    lane: "next",
    title: "AI Code Reviewer",
    description:
      "Context-aware hints for code quality and security before you ship.",
    status: "planned",
    target: "Q4 2024",
    owners: 3,
    teams: ["Security", "Core Engine"],
    priority: "critical",
  },
  {
    id: "metacode-sdk-v3",
    lane: "later",
    title: "MetaCode SDK V3",
    description:
      "A public SDK for extensions and third-party integrations on the platform.",
    status: "planned",
    target: "H1 2025",
    owners: 2,
    teams: ["Integrations"],
    priority: "medium",
  },
  {
    id: "decentralized-storage",
    lane: "later",
    title: "Decentralized Storage",
    description:
      "Optional distributed storage for artifacts and encrypted backups.",
    status: "planned",
    target: "H2 2025",
    owners: 1,
    teams: ["Security", "Core Engine"],
    priority: "high",
  },
];

const CHANGELOG_LEFT = [
  { date: "MAY 24", tag: "Feature", text: "WebAssembly support added to the sandbox runtime" },
  { date: "MAY 18", tag: "Security", text: "Critical XSS vulnerability patched in the editor" },
  { date: "MAY 12", tag: "Performance", text: "Asset loading optimized by ~40%" },
];

const CHANGELOG_RIGHT = [
  { date: "MAY 05", tag: "Beta", text: "API v2 public beta is live" },
  { date: "APR 29", tag: "Feature", text: "Docker Desktop integration for local test runs" },
  { date: "APR 22", tag: "Auth", text: "OAuth authentication stack refreshed" },
];

function statusLabel(s: CardStatus) {
  if (s === "done") return "Complete";
  if (s === "progress") return "In progress";
  return "Planned";
}

function statusStyles(s: CardStatus) {
  if (s === "done") {
    return "border-emerald-500/35 bg-emerald-950/40 text-emerald-200 hover:bg-emerald-900/50";
  }
  if (s === "progress") {
    return "border-violet-500/40 bg-violet-950/50 text-violet-200 hover:bg-violet-900/60";
  }
  return "border-zinc-600/60 bg-zinc-900/70 text-zinc-300 hover:bg-zinc-800/80";
}

function nextStatus(s: CardStatus): CardStatus {
  const idx = STATUS_CYCLE.indexOf(s);
  return STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
}

function computeProgress(cards: RoadmapCard[]): number {
  if (cards.length === 0) return 0;
  const done = cards.filter((c) => c.status === "done").length;
  return Math.round((done / cards.length) * 100);
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
      {Array.from({ length: Math.min(Math.max(count, 0), 4) }).map((_, i) => (
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

interface CardItemProps {
  card: RoadmapCard;
  onCycleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  deletable?: boolean;
}

function CardItem({ card, onCycleStatus, onDelete, deletable }: CardItemProps) {
  return (
    <article className="group rounded-xl border border-zinc-800/70 bg-zinc-950/60 p-4 shadow-[inset_0_1px_0_0_rgba(168,85,247,0.06)]">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onCycleStatus(card.id)}
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide transition-colors",
            statusStyles(card.status),
          )}
          title="Click to change status"
        >
          {statusLabel(card.status)}
        </button>
        <span className="text-[10px] font-semibold text-zinc-500">{card.target}</span>
      </div>
      <h3 className="mt-3 text-sm font-bold text-white">{card.title}</h3>
      <p className="mt-1 text-xs leading-relaxed text-zinc-500">{card.description}</p>
      <div className="mt-3 flex flex-wrap gap-1">
        {card.teams.map((t) => (
          <span
            key={t}
            className="rounded-full border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-zinc-400"
          >
            {t}
          </span>
        ))}
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide",
            card.priority === "critical" && "border-red-500/40 bg-red-950/40 text-red-300",
            card.priority === "high" && "border-amber-500/40 bg-amber-950/40 text-amber-300",
            card.priority === "medium" && "border-zinc-600/50 bg-zinc-900/70 text-zinc-400",
          )}
        >
          {card.priority}
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <OwnerAvatars count={card.owners} />
        {deletable ? (
          <button
            type="button"
            onClick={() => onDelete(card.id)}
            className="text-[11px] font-semibold text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
            title="Remove card"
          >
            Remove
          </button>
        ) : (
          <span className="text-zinc-600" aria-hidden>
            ›
          </span>
        )}
      </div>
    </article>
  );
}

interface LaneColumnProps {
  lane: LaneId;
  cards: RoadmapCard[];
  allLaneCards: RoadmapCard[];
  onCycleStatus: (id: string) => void;
  onDelete: (id: string) => void;
  customIds: Set<string>;
}

function LaneColumn({ lane, cards, allLaneCards, onCycleStatus, onDelete, customIds }: LaneColumnProps) {
  const meta = LANE_META[lane];
  const progress = computeProgress(allLaneCards);

  return (
    <section className="flex min-h-0 flex-col rounded-2xl border border-zinc-800/60 bg-[#09090b] p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-white">{meta.title}</h2>
          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
            {meta.subtitle}
          </p>
        </div>
        <span className="text-sm font-bold tabular-nums text-violet-300">{progress}%</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 shadow-[0_0_12px_rgba(168,85,247,0.45)] transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-5 flex flex-col gap-3">
        {cards.length === 0 ? (
          <p className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40 py-6 text-center text-xs text-zinc-600">
            No cards match the current filters.
          </p>
        ) : (
          cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              onCycleStatus={onCycleStatus}
              onDelete={onDelete}
              deletable={customIds.has(card.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}

interface SubmitIdeaModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (card: Omit<RoadmapCard, "id">) => void;
}

function SubmitIdeaModal({ open, onClose, onSubmit }: SubmitIdeaModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [lane, setLane] = useState<LaneId>("next");
  const [target, setTarget] = useState("");
  const [owners, setOwners] = useState(1);
  const [selectedTeams, setSelectedTeams] = useState<Team[]>([]);
  const [priority, setPriority] = useState<Priority>("high");

  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setLane("next");
      setTarget("");
      setOwners(1);
      setSelectedTeams([]);
      setPriority("high");
    }
  }, [open]);

  if (!open) return null;

  const toggleTeam = (t: Team) => {
    setSelectedTeams((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      lane,
      title: title.trim(),
      description: description.trim() || "New idea submitted by a community member.",
      status: "planned",
      target: target.trim() || "TBD",
      owners: Math.max(0, Math.min(owners, 4)),
      teams: selectedTeams,
      priority,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="m-4 w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0b0b0e] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">Submit an idea</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Add a new card to the roadmap. Saved locally on this device.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-900 hover:text-white"
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Title *
            </span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
              placeholder="Your idea title"
            />
          </label>

          <label className="block">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Description
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
              placeholder="What problem does this solve?"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Lane
              </span>
              <select
                value={lane}
                onChange={(e) => setLane(e.target.value as LaneId)}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
              >
                {LANE_ORDER.map((l) => (
                  <option key={l} value={l}>
                    {LANE_META[l].title}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Target
              </span>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:border-violet-500 focus:outline-none"
                placeholder="Q4 2024"
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Priority
              </span>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
              </select>
            </label>

            <label className="block">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Owners
              </span>
              <input
                type="number"
                min={0}
                max={4}
                value={owners}
                onChange={(e) => setOwners(Number(e.target.value) || 0)}
                className="mt-1 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white focus:border-violet-500 focus:outline-none"
              />
            </label>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              Teams
            </span>
            <div className="mt-2 flex flex-wrap gap-2">
              {TEAMS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTeam(t)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    selectedTeams.includes(t)
                      ? "border-violet-500/50 bg-violet-950/50 text-violet-200"
                      : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200",
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
          >
            Cancel
          </button>
          <Button
            type="submit"
            variant="accent"
            className="rounded-lg px-4 py-2 text-sm font-semibold"
          >
            Add to roadmap
          </Button>
        </div>
      </form>
    </div>
  );
}

export default function RoadmapsPage() {
  const [timeframe, setTimeframe] = useState<TimeframeId>("all");
  const [period, setPeriod] = useState<"quarter" | "year">("quarter");
  const [priority, setPriority] = useState<PriorityFilter>("all");
  const [activeTeams, setActiveTeams] = useState<Team[]>([]);
  const [search, setSearch] = useState("");
  const [cards, setCards] = useState<RoadmapCard[]>(INITIAL_CARDS);
  const [hydrated, setHydrated] = useState(false);
  const [customIds, setCustomIds] = useState<Set<string>>(new Set());
  const [ideaOpen, setIdeaOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          cards?: RoadmapCard[];
          customIds?: string[];
        };
        if (parsed && Array.isArray(parsed.cards)) setCards(parsed.cards);
        if (parsed && Array.isArray(parsed.customIds)) {
          setCustomIds(new Set(parsed.customIds));
        }
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cards, customIds: Array.from(customIds) }),
      );
    } catch {}
  }, [cards, customIds, hydrated]);

  const toggleTeam = (t: Team) => {
    setActiveTeams((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const cycleStatus = (id: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: nextStatus(c.status) } : c)),
    );
  };

  const deleteCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
    setCustomIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const addCard = (card: Omit<RoadmapCard, "id">) => {
    const id = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    setCards((prev) => [...prev, { ...card, id }]);
    setCustomIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const resetRoadmap = () => {
    if (typeof window !== "undefined" && !window.confirm("Reset roadmap to defaults?")) {
      return;
    }
    setCards(INITIAL_CARDS);
    setCustomIds(new Set());
  };

  const filteredCards = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cards.filter((c) => {
      if (activeTeams.length > 0 && !c.teams.some((t) => activeTeams.includes(t))) {
        return false;
      }
      if (priority !== "all" && c.priority !== priority) {
        return false;
      }
      if (q && !`${c.title} ${c.description}`.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [cards, activeTeams, priority, search]);

  const cardsByLane = useMemo(() => {
    const map: Record<LaneId, RoadmapCard[]> = { now: [], next: [], later: [] };
    for (const c of filteredCards) map[c.lane].push(c);
    return map;
  }, [filteredCards]);

  const laneAllCards = useMemo(() => {
    const map: Record<LaneId, RoadmapCard[]> = { now: [], next: [], later: [] };
    for (const c of cards) map[c.lane].push(c);
    return map;
  }, [cards]);

  const hasActiveFilters =
    activeTeams.length > 0 || priority !== "all" || search.trim().length > 0;

  const lanesToShow: LaneId[] =
    timeframe === "all"
      ? LANE_ORDER
      : timeframe === "backlog"
        ? []
        : [timeframe];

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
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cards..."
                className="w-48 rounded-lg border border-zinc-800 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none sm:w-64"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  aria-label="Clear search"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
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
              onClick={() => setIdeaOpen(true)}
            >
              <span className="text-lg leading-none">+</span>
              Submit idea
            </Button>
          </div>
        </div>

        {/* Results summary */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-500">
          <p>
            Showing <span className="font-semibold text-zinc-300">{filteredCards.length}</span>{" "}
            of <span className="font-semibold text-zinc-300">{cards.length}</span> cards
            {hasActiveFilters && " (filters active)"}
          </p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setActiveTeams([]);
                setPriority("all");
                setSearch("");
              }}
              className="text-violet-400 hover:text-violet-300"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Main grid + sidebar */}
        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_minmax(0,280px)] xl:grid-cols-[1fr_300px]">
          <div>
            {timeframe === "backlog" ? (
              <section className="rounded-2xl border border-zinc-800/60 bg-[#09090b] p-4 sm:p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">Backlog</h2>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      EVERYTHING TRACKED
                    </p>
                  </div>
                  <span className="text-sm font-bold tabular-nums text-violet-300">
                    {computeProgress(cards)}%
                  </span>
                </div>
                {filteredCards.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-zinc-800 bg-zinc-950/40 py-10 text-center text-sm text-zinc-500">
                    Nothing matches the current filters.
                  </p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredCards.map((card) => (
                      <CardItem
                        key={card.id}
                        card={card}
                        onCycleStatus={cycleStatus}
                        onDelete={deleteCard}
                        deletable={customIds.has(card.id)}
                      />
                    ))}
                  </div>
                )}
              </section>
            ) : (
              <div
                className={cn(
                  "grid gap-4",
                  lanesToShow.length === 1 ? "md:grid-cols-1" : "md:grid-cols-3 md:items-start",
                )}
              >
                {lanesToShow.map((laneId) => (
                  <LaneColumn
                    key={laneId}
                    lane={laneId}
                    cards={cardsByLane[laneId]}
                    allLaneCards={laneAllCards[laneId]}
                    onCycleStatus={cycleStatus}
                    onDelete={deleteCard}
                    customIds={customIds}
                  />
                ))}
              </div>
            )}
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
                      activeTeams.includes(t)
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
                    { id: "all" as const, label: "All", dot: "bg-zinc-300" },
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
                  <span className="h-0.5 w-6 rounded-full bg-zinc-500" />
                  Planned
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-0.5 w-6 rounded-full bg-violet-500" />
                  In progress
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-0.5 w-6 rounded-full bg-emerald-500" />
                  Complete
                </li>
              </ul>
              <p className="mt-2 text-[11px] text-zinc-600">
                Click a card&apos;s status badge to cycle it.
              </p>
            </div>

            <button
              type="button"
              onClick={resetRoadmap}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900/50 py-2 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:text-white"
            >
              Reset to defaults
            </button>

            <Button
              type="button"
              variant="outline"
              className="w-full border-violet-500/40 bg-violet-950/20 py-2 text-sm font-semibold text-violet-200 hover:bg-violet-950/40 hover:text-white"
              onClick={() => setIdeaOpen(true)}
            >
              Submit an idea
            </Button>
          </aside>
        </div>

        {/* Changelog */}
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
                <li key={row.date + row.text} className="flex gap-3 py-3 first:pt-0 last:pb-0">
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
                <li key={row.date + row.text} className="flex gap-3 py-3 first:pt-0 last:pb-0">
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

      <SubmitIdeaModal open={ideaOpen} onClose={() => setIdeaOpen(false)} onSubmit={addCard} />
    </div>
  );
}

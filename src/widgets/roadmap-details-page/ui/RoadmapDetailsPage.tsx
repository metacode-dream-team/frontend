"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  getRoadmapProgress,
  type Roadmap,
  type RoadmapNode,
  useRoadmapStore,
} from "@/entities/roadmap";
import { TaskProgressCheckbox } from "@/features/track-progress";
import { getRoadmaps } from "@/shared/lib/api/roadmapApi";
import { MarkdownText } from "@/shared/ui/MarkdownText";
import { ToggleFavoriteButton } from "@/features/toggle-favorite";
import { UpvoteRoadmapButton } from "@/features/upvote-roadmap";
import { cn } from "@/shared/lib/utils/cn";

type Difficulty = "Easy" | "Medium" | "Hard";

interface PositionedNode {
  node: RoadmapNode;
  x: number;
  y: number;
  progress: number;
}

interface RoadmapDetailsPageProps {
  roadmapId: string;
}

function hash(input: string): number {
  let value = 0;
  for (let i = 0; i < input.length; i++) {
    value = (value * 31 + input.charCodeAt(i)) >>> 0;
  }
  return value;
}

function difficultyByTask(taskId: string): Difficulty {
  const value = hash(taskId) % 10;
  if (value < 4) return "Easy";
  if (value < 8) return "Medium";
  return "Hard";
}

function buildLevels(nodes: RoadmapNode[]): RoadmapNode[][] {
  const byParent = new Map<string | null, RoadmapNode[]>();

  for (const node of nodes) {
    const bucket = byParent.get(node.parentId) ?? [];
    bucket.push(node);
    byParent.set(node.parentId, bucket);
  }

  const levels: RoadmapNode[][] = [];
  const roots = byParent.get(null) ?? [];
  const queue: Array<{ node: RoadmapNode; depth: number }> = roots.map((node) => ({
    node,
    depth: 0,
  }));

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    if (!levels[current.depth]) {
      levels[current.depth] = [];
    }
    levels[current.depth].push(current.node);

    const children = byParent.get(current.node.id) ?? [];
    for (const child of children) {
      queue.push({ node: child, depth: current.depth + 1 });
    }
  }

  return levels;
}

function getNodeProgress(node: RoadmapNode): number {
  if (node.tasks.length === 0) return 0;
  const completed = node.tasks.filter((task) => task.isCompleted).length;
  return Math.round((completed / node.tasks.length) * 100);
}

function getNodeLayout(nodes: RoadmapNode[]) {
  const levels = buildLevels(nodes);
  const nodeWidth = 230;
  const verticalGap = 150;
  const horizontalPadding = 70;
  const width = Math.max(980, Math.max(...levels.map((level) => level.length * 250), 0));
  const height = Math.max(640, levels.length * verticalGap + 180);

  const positioned: PositionedNode[] = [];

  for (let depth = 0; depth < levels.length; depth++) {
    const level = levels[depth];
    const totalNodes = level.length;
    const rowWidth = Math.max(totalNodes * 250, width - horizontalPadding * 2);
    const gap = rowWidth / Math.max(1, totalNodes);
    const startX = (width - rowWidth) / 2 + gap / 2;

    for (let i = 0; i < totalNodes; i++) {
      const node = level[i];
      positioned.push({
        node,
        x: startX + i * gap,
        y: 90 + depth * verticalGap,
        progress: getNodeProgress(node),
      });
    }
  }

  const byId = new Map(positioned.map((item) => [item.node.id, item]));

  const edges = nodes
    .filter((node) => node.parentId)
    .map((node) => {
      const from = byId.get(node.parentId as string);
      const to = byId.get(node.id);
      if (!from || !to) return null;

      return {
        id: `${from.node.id}-${to.node.id}`,
        fromX: from.x,
        fromY: from.y + 24,
        toX: to.x,
        toY: to.y - 24,
      };
    })
    .filter(Boolean) as Array<{
    id: string;
    fromX: number;
    fromY: number;
    toX: number;
    toY: number;
  }>;

  return {
    width,
    height,
    positioned,
    edges,
  };
}

function generateActivitySeed(roadmap: Roadmap): number[] {
  const seed = hash(roadmap.id + roadmap.title);
  const completion = getRoadmapProgress(roadmap).percent / 100;
  const days = 365;
  const result: number[] = [];

  for (let i = 0; i < days; i++) {
    const wave = Math.abs(Math.sin((i + seed) / 14));
    const burst = (seed + i * 17) % 6;
    const value = Math.max(0, Math.round((wave * 5 + burst * completion) * (i % 8 === 0 ? 0 : 1)));
    result.push(value);
  }

  return result;
}

function intensityClass(value: number): string {
  if (value === 0) return "bg-slate-700";
  if (value <= 2) return "bg-emerald-900";
  if (value <= 4) return "bg-emerald-700";
  if (value <= 6) return "bg-emerald-500";
  return "bg-emerald-300";
}

function CalendarPanel({ values }: { values: number[] }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthStart = new Date(year, month, 1);
  const monthDays = new Date(year, month + 1, 0).getDate();
  const firstWeekday = monthStart.getDay();

  const monthValues = values.slice(values.length - monthDays);
  const activeDays = monthValues.filter((value) => value > 0).length;

  let currentStreak = 0;
  for (let i = values.length - 1; i >= 0; i--) {
    if (values[i] > 0) {
      currentStreak++;
    } else {
      break;
    }
  }

  let maxStreak = 0;
  let tempStreak = 0;
  for (const value of values) {
    if (value > 0) {
      tempStreak++;
      maxStreak = Math.max(maxStreak, tempStreak);
    } else {
      tempStreak = 0;
    }
  }

  const cells: Array<{ day?: number; value?: number }> = [];

  for (let i = 0; i < firstWeekday; i++) {
    cells.push({});
  }

  for (let day = 1; day <= monthDays; day++) {
    cells.push({ day, value: monthValues[day - 1] ?? 0 });
  }

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-2xl font-semibold text-slate-100">
          {monthStart.toLocaleString("en-US", { month: "long" })} {year}
        </p>
        <p className="text-xs text-slate-400">Active days: {activeDays}</p>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-2 text-center text-xs text-slate-500">
        <span>S</span>
        <span>M</span>
        <span>T</span>
        <span>W</span>
        <span>T</span>
        <span>F</span>
        <span>S</span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {cells.map((cell, index) => (
          <div
            key={index}
            className={cn(
              "flex h-9 items-center justify-center rounded-full text-xs",
              cell.day
                ? cn("text-slate-200", intensityClass(cell.value ?? 0))
                : "bg-transparent",
            )}
          >
            {cell.day ?? ""}
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
          <p className="text-xs text-slate-400">Current Streak</p>
          <p className="mt-1 text-xl font-semibold text-orange-300">{currentStreak} days</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
          <p className="text-xs text-slate-400">Best Streak</p>
          <p className="mt-1 text-xl font-semibold text-yellow-300">{maxStreak} days</p>
        </div>
      </div>
    </div>
  );
}

function NodeTasksPanel({
  roadmap,
  node,
}: {
  roadmap: Roadmap;
  node: RoadmapNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-4">
      <div className="mb-3">
        <h3 className="text-2xl font-semibold text-slate-100">{node.title}</h3>
        <MarkdownText text={node.description} className="mt-1 text-sm text-slate-400" />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700">
        <div className="grid grid-cols-[80px_90px_1fr_90px_120px] bg-slate-800/80 px-4 py-3 text-xs uppercase tracking-wide text-slate-400">
          <span>Status</span>
          <span>Level</span>
          <span>Task</span>
          <span>Node</span>
          <span className="text-right">Source</span>
        </div>

        <div className="divide-y divide-slate-700">
          {node.tasks.map((task) => {
            const difficulty = difficultyByTask(task.id);
            return (
              <div
                key={task.id}
                className={cn(
                  "grid grid-cols-[80px_90px_1fr_90px_120px] items-center px-4 py-3 text-sm",
                  task.isCompleted ? "bg-cyan-900/20" : "bg-slate-900/60",
                )}
              >
                <TaskProgressCheckbox
                  roadmapId={roadmap.id}
                  nodeId={node.id}
                  taskId={task.id}
                  isChecked={task.isCompleted}
                />

                <span
                  className={cn(
                    "font-medium",
                    difficulty === "Easy" && "text-emerald-300",
                    difficulty === "Medium" && "text-amber-300",
                    difficulty === "Hard" && "text-rose-300",
                  )}
                >
                  {difficulty}
                </span>

                <div className="pr-3">
                  <p className="font-medium text-slate-100">{task.title}</p>
                  <MarkdownText text={task.description} className="text-xs text-slate-400" />
                </div>

                <span className="text-xs text-slate-400">{node.title}</span>

                <div className="text-right">
                  {task.externalUrl ? (
                    <a
                      href={task.externalUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-cyan-300 hover:text-cyan-200"
                    >
                      Open link
                    </a>
                  ) : (
                    <span className="text-xs text-slate-500">Internal</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function RoadmapDetailsPage({ roadmapId }: RoadmapDetailsPageProps) {
  const { roadmaps, isLoaded, setRoadmaps, setIsLoaded } = useRoadmapStore();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    if (roadmaps.length > 0) {
      setIsLoaded(true);
      return;
    }

    if (isLoaded) return;

    getRoadmaps()
      .then((items) => setRoadmaps(items))
      .finally(() => setIsLoaded(true));
  }, [isLoaded, roadmaps.length, setIsLoaded, setRoadmaps]);

  const roadmap = useMemo(
    () => roadmaps.find((item) => item.id === roadmapId) ?? null,
    [roadmapId, roadmaps],
  );

  useEffect(() => {
    if (!roadmap) return;
    if (!selectedNodeId || !roadmap.nodes.some((node) => node.id === selectedNodeId)) {
      setSelectedNodeId(roadmap.nodes[0]?.id ?? null);
    }
  }, [roadmap, selectedNodeId]);

  if (!isLoaded && !roadmap) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
        <div className="mx-auto max-w-7xl rounded-xl border border-slate-800 bg-slate-900/50 p-6 text-slate-300">
          Loading roadmap...
        </div>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
        <div className="mx-auto max-w-7xl rounded-xl border border-slate-800 bg-slate-900/50 p-6">
          <p className="text-lg font-semibold">Roadmap not found</p>
          <Link href="/roadmaps" className="mt-3 inline-block text-cyan-300 hover:text-cyan-200">
            Back to roadmap catalog
          </Link>
        </div>
      </div>
    );
  }

  const layout = getNodeLayout(roadmap.nodes);
  const progress = getRoadmapProgress(roadmap);
  const selectedNode = roadmap.nodes.find((node) => node.id === selectedNodeId) ?? roadmap.nodes[0] ?? null;

  const allTasks = roadmap.nodes.flatMap((node) =>
    node.tasks.map((task) => ({
      task,
      difficulty: difficultyByTask(task.id),
    })),
  );

  const easyTotal = allTasks.filter((item) => item.difficulty === "Easy").length;
  const mediumTotal = allTasks.filter((item) => item.difficulty === "Medium").length;
  const hardTotal = allTasks.filter((item) => item.difficulty === "Hard").length;

  const easyDone = allTasks.filter((item) => item.difficulty === "Easy" && item.task.isCompleted).length;
  const mediumDone = allTasks.filter((item) => item.difficulty === "Medium" && item.task.isCompleted).length;
  const hardDone = allTasks.filter((item) => item.difficulty === "Hard" && item.task.isCompleted).length;

  const ringLength = 2 * Math.PI * 58;
  const ringOffset = ringLength * (1 - progress.percent / 100);

  const activityValues = generateActivitySeed(roadmap);

  return (
    <div className="min-h-screen bg-[#11151d] px-4 py-6 text-slate-100">
      <div className="mx-auto max-w-[1500px]">
        <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/roadmaps" className="text-xs text-slate-400 hover:text-cyan-300">
              ← Back to roadmaps
            </Link>
            <h1 className="mt-1 text-3xl font-semibold">{roadmap.title}</h1>
            <p className="mt-1 text-sm text-slate-400">{roadmap.description}</p>
          </div>

          <div className="flex items-center gap-2">
            <ToggleFavoriteButton roadmapId={roadmap.id} isActive={roadmap.isFavorited} />
            <UpvoteRoadmapButton roadmapId={roadmap.id} isActive={roadmap.isUpvoted} total={roadmap.upvotes} />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
          <section className="space-y-4">
            <div className="overflow-auto rounded-2xl border border-slate-700 bg-slate-900/50 p-3">
              <div className="relative" style={{ width: `${layout.width}px`, height: `${layout.height}px` }}>
                <svg width={layout.width} height={layout.height} className="absolute inset-0">
                  {layout.edges.map((edge) => {
                    const midY = edge.fromY + (edge.toY - edge.fromY) * 0.4;
                    return (
                      <path
                        key={edge.id}
                        d={`M ${edge.fromX} ${edge.fromY} C ${edge.fromX} ${midY}, ${edge.toX} ${midY}, ${edge.toX} ${edge.toY}`}
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    );
                  })}
                </svg>

                {layout.positioned.map((item) => (
                  <button
                    key={item.node.id}
                    onClick={() => setSelectedNodeId(item.node.id)}
                    style={{ left: `${item.x - 115}px`, top: `${item.y - 30}px` }}
                    className={cn(
                      "absolute w-[230px] rounded-xl border px-3 py-2 text-left shadow-[0_10px_30px_rgba(2,6,23,0.25)] transition-all",
                      selectedNodeId === item.node.id
                        ? "border-fuchsia-300 bg-fuchsia-600/70"
                        : "border-indigo-300/20 bg-indigo-600/80 hover:bg-indigo-600",
                    )}
                  >
                    <p className="truncate text-lg font-semibold text-slate-100">{item.node.title}</p>
                    <div className="mt-2 h-2 rounded-full bg-slate-200/40">
                      <div
                        className="h-2 rounded-full bg-emerald-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {selectedNode ? <NodeTasksPanel roadmap={roadmap} node={selectedNode} /> : null}
          </section>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-4">
              <div className="mb-3 flex gap-3">
                <img
                  src={`https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(roadmap.id)}`}
                  alt={roadmap.title}
                  className="h-14 w-14 rounded-xl"
                />
                <div>
                  <p className="text-sm text-slate-300">{roadmap.author}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(roadmap.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className={cn("mt-1 text-xs", roadmap.isPublic ? "text-emerald-300" : "text-amber-300")}>
                    {roadmap.isPublic ? "Public roadmap" : "Private roadmap"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto] items-center gap-3">
                <div className="space-y-2 text-sm">
                  <p className="text-emerald-300">
                    Easy <span className="text-slate-300">{easyDone}/{easyTotal}</span>
                  </p>
                  <p className="text-amber-300">
                    Med <span className="text-slate-300">{mediumDone}/{mediumTotal}</span>
                  </p>
                  <p className="text-rose-300">
                    Hard <span className="text-slate-300">{hardDone}/{hardTotal}</span>
                  </p>
                </div>

                <div className="relative flex h-36 w-36 items-center justify-center">
                  <svg viewBox="0 0 150 150" className="h-full w-full -rotate-90">
                    <circle cx="75" cy="75" r="58" stroke="#334155" strokeWidth="10" fill="none" />
                    <circle
                      cx="75"
                      cy="75"
                      r="58"
                      stroke="#f59e0b"
                      strokeWidth="10"
                      fill="none"
                      strokeLinecap="round"
                      strokeDasharray={ringLength}
                      strokeDashoffset={ringOffset}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <p className="text-4xl font-bold text-slate-100">{progress.completed}</p>
                    <p className="text-sm text-slate-400">/ {progress.total} solved</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {roadmap.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-900/70 px-2 py-1 text-xs text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <CalendarPanel values={activityValues} />
          </aside>
        </div>
      </div>
    </div>
  );
}

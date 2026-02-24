"use client";

import Link from "next/link";
import { getRoadmapProgress, type Roadmap, type RoadmapNode } from "@/entities/roadmap";
import { TaskProgressCheckbox } from "@/features/track-progress";
import { MarkdownText } from "@/shared/ui/MarkdownText";

interface RoadmapCanvasProps {
  roadmap: Roadmap | null;
}

function childrenByParent(nodes: RoadmapNode[], parentId: string | null): RoadmapNode[] {
  return nodes.filter((node) => node.parentId === parentId);
}

function TaskRow({
  roadmapId,
  nodeId,
  task,
}: {
  roadmapId: string;
  nodeId: string;
  task: RoadmapNode["tasks"][number];
}) {
  return (
    <div className="rounded-lg border border-slate-700/60 bg-slate-900/50 p-3">
      <div className="flex items-start gap-3">
        <TaskProgressCheckbox
          roadmapId={roadmapId}
          nodeId={nodeId}
          taskId={task.id}
          isChecked={task.isCompleted}
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-100">{task.title}</p>
          <MarkdownText text={task.description} className="mt-1 text-xs text-slate-400" />
          {task.externalUrl ? (
            <a
              href={task.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-block text-xs text-cyan-300 hover:text-cyan-200"
            >
              Open resource
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function NodeTree({
  roadmap,
  nodes,
  parentId,
  depth,
}: {
  roadmap: Roadmap;
  nodes: RoadmapNode[];
  parentId: string | null;
  depth: number;
}) {
  const items = childrenByParent(nodes, parentId);

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      {items.map((node) => (
        <div
          key={node.id}
          className="rounded-xl border border-slate-800 bg-slate-900/30 p-4"
          style={{ marginLeft: `${depth * 18}px` }}
        >
          <h3 className="text-lg font-semibold text-slate-100">{node.title}</h3>
          <MarkdownText text={node.description} className="mt-1 text-sm text-slate-300" />

          <div className="mt-3 grid gap-2">
            {node.tasks.map((task) => (
              <TaskRow key={task.id} roadmapId={roadmap.id} nodeId={node.id} task={task} />
            ))}
          </div>

          <div className="mt-4 border-l border-slate-700 pl-3">
            <NodeTree roadmap={roadmap} nodes={nodes} parentId={node.id} depth={depth + 1} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RoadmapCanvas({ roadmap }: RoadmapCanvasProps) {
  if (!roadmap) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-8 text-sm text-slate-400">
        Select a roadmap from catalog to start learning.
      </section>
    );
  }

  const progress = getRoadmapProgress(roadmap);
  const shareUrl = roadmap.isPublic
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/roadmaps/${roadmap.id}`
    : null;

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-slate-100">{roadmap.title}</h2>
          <p className="mt-1 text-sm text-slate-400">{roadmap.description}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="rounded-md bg-slate-800 px-2 py-1">{roadmap.category}</span>
            <span>{roadmap.author}</span>
            <span
              className={roadmap.isPublic ? "text-emerald-300" : "text-amber-300"}
            >
              {roadmap.isPublic ? "Public" : "Private"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/roadmaps/${roadmap.id}`}
            className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:border-cyan-500"
          >
            Full view
          </Link>
          {shareUrl ? (
            <button
              onClick={() => navigator.clipboard.writeText(shareUrl)}
              className="rounded-md border border-slate-700 px-3 py-2 text-xs text-slate-200 hover:border-cyan-500"
            >
              Share
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-1 flex justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span>
            {progress.completed}/{progress.total} ({progress.percent}%)
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-emerald-400 transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      <div className="mt-6">
        <NodeTree roadmap={roadmap} nodes={roadmap.nodes} parentId={null} depth={0} />
      </div>
    </section>
  );
}

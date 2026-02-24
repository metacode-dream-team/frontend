import type { ReactNode } from "react";
import type { Roadmap } from "../model/types";
import { getRoadmapProgress } from "../model/roadmapStore";
import { cn } from "@/shared/lib/utils/cn";

interface RoadmapCardProps {
  roadmap: Roadmap;
  isActive?: boolean;
  onOpen: (roadmapId: string) => void;
  actions?: ReactNode;
}

export function RoadmapCard({ roadmap, isActive, onOpen, actions }: RoadmapCardProps) {
  const progress = getRoadmapProgress(roadmap);

  return (
    <article
      className={cn(
        "rounded-xl border p-4 transition-colors",
        isActive
          ? "border-cyan-500 bg-slate-900/80"
          : "border-slate-800 bg-slate-900/40 hover:border-slate-700",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100">{roadmap.title}</h3>
          <p className="mt-1 text-sm text-slate-400">{roadmap.description}</p>
        </div>
        <span
          className={cn(
            "rounded-full px-2 py-1 text-xs font-medium",
            roadmap.isPublic
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-amber-500/15 text-amber-300",
          )}
        >
          {roadmap.isPublic ? "Public" : "Private"}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <span className="rounded-md bg-slate-800 px-2 py-1">{roadmap.category}</span>
        <span>{roadmap.upvotes} upvotes</span>
      </div>

      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span>
            {progress.completed}/{progress.total}
          </span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-800">
          <div
            className="h-2 rounded-full bg-cyan-400 transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={() => onOpen(roadmap.id)}
          className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-100 hover:border-cyan-500"
        >
          Open roadmap
        </button>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </article>
  );
}

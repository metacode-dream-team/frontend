"use client";

import { useState } from "react";
import { useRoadmapStore } from "@/entities/roadmap";
import { cn } from "@/shared/lib/utils/cn";
import { toggleUpvoteRoadmap } from "@/shared/lib/api/roadmapApi";

interface UpvoteRoadmapButtonProps {
  roadmapId: string;
  isActive: boolean;
  total: number;
}

export function UpvoteRoadmapButton({ roadmapId, isActive, total }: UpvoteRoadmapButtonProps) {
  const toggleUpvote = useRoadmapStore((state) => state.toggleUpvote);
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    toggleUpvote(roadmapId);

    try {
      await toggleUpvoteRoadmap(roadmapId);
    } catch {
      toggleUpvote(roadmapId);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className={cn(
        "rounded-md border px-2.5 py-1 text-xs transition-colors",
        isActive
          ? "border-cyan-400/70 bg-cyan-500/20 text-cyan-200"
          : "border-slate-700 text-slate-300 hover:border-slate-500",
      )}
    >
      {isActive ? "Upvoted" : "Upvote"} · {total}
    </button>
  );
}

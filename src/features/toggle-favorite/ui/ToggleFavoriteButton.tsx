"use client";

import { useState } from "react";
import { useRoadmapStore } from "@/entities/roadmap";
import { cn } from "@/shared/lib/utils/cn";
import { toggleFavoriteRoadmap } from "@/shared/lib/api/roadmapApi";

interface ToggleFavoriteButtonProps {
  roadmapId: string;
  isActive: boolean;
}

export function ToggleFavoriteButton({ roadmapId, isActive }: ToggleFavoriteButtonProps) {
  const toggleFavorite = useRoadmapStore((state) => state.toggleFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    if (isLoading) return;

    setIsLoading(true);
    toggleFavorite(roadmapId);

    try {
      await toggleFavoriteRoadmap(roadmapId);
    } catch {
      toggleFavorite(roadmapId);
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
          ? "border-amber-400/70 bg-amber-500/20 text-amber-200"
          : "border-slate-700 text-slate-300 hover:border-slate-500",
      )}
    >
      {isActive ? "In favorites" : "Favorite"}
    </button>
  );
}

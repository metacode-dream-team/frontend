import { useMemo, useState } from "react";
import type { Roadmap, RoadmapSort } from "@/entities/roadmap";

function sortRoadmaps(items: Roadmap[], sortBy: RoadmapSort): Roadmap[] {
  if (sortBy === "upvotes") {
    return [...items].sort((a, b) => b.upvotes - a.upvotes);
  }

  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function useRoadmapSearch(roadmaps: Roadmap[]) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<RoadmapSort>("upvotes");

  const filteredRoadmaps = useMemo(() => {
    const q = query.trim().toLowerCase();
    const publicRoadmaps = roadmaps.filter((item) => item.isPublic);

    const searched = q
      ? publicRoadmaps.filter((item) => item.title.toLowerCase().includes(q))
      : publicRoadmaps;

    return sortRoadmaps(searched, sortBy);
  }, [query, roadmaps, sortBy]);

  return {
    query,
    sortBy,
    filteredRoadmaps,
    setQuery,
    setSortBy,
  };
}

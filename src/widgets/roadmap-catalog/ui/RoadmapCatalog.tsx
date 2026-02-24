"use client";

import { Input } from "@/shared/ui/Input";
import { RoadmapCard, type Roadmap, type RoadmapSort } from "@/entities/roadmap";
import { useRoadmapSearch } from "@/features/roadmap-search";
import { ToggleFavoriteButton } from "@/features/toggle-favorite";
import { UpvoteRoadmapButton } from "@/features/upvote-roadmap";

interface RoadmapCatalogProps {
  roadmaps: Roadmap[];
  activeRoadmapId: string | null;
  onSelectRoadmap: (roadmapId: string) => void;
}

export function RoadmapCatalog({
  roadmaps,
  activeRoadmapId,
  onSelectRoadmap,
}: RoadmapCatalogProps) {
  const { query, sortBy, filteredRoadmaps, setQuery, setSortBy } =
    useRoadmapSearch(roadmaps);

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
      <div className="mb-4 flex items-end gap-3">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search roadmap by title"
          label="Search"
          className="bg-slate-900"
        />
        <label className="flex flex-col text-sm text-slate-300">
          Sort
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as RoadmapSort)}
            className="mt-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200"
          >
            <option value="upvotes">By upvotes</option>
            <option value="newest">By date</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4">
        {filteredRoadmaps.map((roadmap) => (
          <RoadmapCard
            key={roadmap.id}
            roadmap={roadmap}
            isActive={roadmap.id === activeRoadmapId}
            onOpen={onSelectRoadmap}
            actions={
              <>
                <ToggleFavoriteButton
                  roadmapId={roadmap.id}
                  isActive={roadmap.isFavorited}
                />
                <UpvoteRoadmapButton
                  roadmapId={roadmap.id}
                  isActive={roadmap.isUpvoted}
                  total={roadmap.upvotes}
                />
              </>
            }
          />
        ))}
      </div>

      {filteredRoadmaps.length === 0 ? (
        <p className="mt-5 text-sm text-slate-400">No public roadmaps found.</p>
      ) : null}
    </section>
  );
}

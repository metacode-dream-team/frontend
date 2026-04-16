"use client";

import { useEffect, useMemo } from "react";
import { getRoadmaps } from "@/shared/lib/api/roadmapApi";
import { RoadmapCanvas } from "@/widgets/roadmap-canvas";
import { RoadmapCatalog } from "@/widgets/roadmap-catalog";
import { RoadmapEditor } from "@/widgets/roadmap-editor";
import { useRoadmapStore } from "@/entities/roadmap";

export default function RoadmapsStudioPage() {
  const {
    roadmaps,
    activeRoadmapId,
    isLoaded,
    setRoadmaps,
    setIsLoaded,
    setActiveRoadmap,
    addRoadmap,
  } = useRoadmapStore();

  useEffect(() => {
    if (isLoaded) {
      return;
    }

    getRoadmaps()
      .then((items) => {
        setRoadmaps(items);
      })
      .finally(() => setIsLoaded(true));
  }, [isLoaded, setIsLoaded, setRoadmaps]);

  const activeRoadmap = useMemo(
    () => roadmaps.find((item) => item.id === activeRoadmapId) ?? null,
    [activeRoadmapId, roadmaps],
  );

  const privateRoadmaps = roadmaps.filter((item) => !item.isPublic);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/70 p-6">
          <h1 className="text-3xl font-bold">Roadmaps studio</h1>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Design your learning tracks, track node/task progress, and explore
            public community roadmaps.
          </p>
        </header>

        {!isLoaded ? (
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 text-sm text-slate-400">
            Loading roadmaps...
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.9fr]">
            <div className="space-y-6">
              <RoadmapCatalog
                roadmaps={roadmaps}
                activeRoadmapId={activeRoadmapId}
                onSelectRoadmap={setActiveRoadmap}
              />

              <section className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
                <h2 className="text-base font-semibold text-slate-100">
                  My private roadmaps
                </h2>
                <div className="mt-3 space-y-2">
                  {privateRoadmaps.length > 0 ? (
                    privateRoadmaps.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveRoadmap(item.id)}
                        className="flex w-full items-center justify-between rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-left text-sm text-amber-100 hover:border-amber-400/40"
                      >
                        <span>{item.title}</span>
                        <span className="text-xs text-amber-300">Private</span>
                      </button>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">No private roadmaps yet.</p>
                  )}
                </div>
              </section>

              <RoadmapEditor onRoadmapCreated={addRoadmap} />
            </div>

            <RoadmapCanvas roadmap={activeRoadmap} />
          </div>
        )}
      </div>
    </div>
  );
}

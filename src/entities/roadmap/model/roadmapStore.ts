import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Roadmap, RoadmapProgress, RoadmapTask } from "./types";

interface RoadmapStore {
  roadmaps: Roadmap[];
  activeRoadmapId: string | null;
  isLoaded: boolean;

  setRoadmaps: (roadmaps: Roadmap[]) => void;
  setIsLoaded: (value: boolean) => void;
  setActiveRoadmap: (id: string) => void;
  addRoadmap: (roadmap: Roadmap) => void;
  toggleFavorite: (roadmapId: string) => void;
  toggleUpvote: (roadmapId: string) => void;
  toggleTask: (roadmapId: string, nodeId: string, taskId: string) => void;
}

function updateTasks(tasks: RoadmapTask[], taskId: string): RoadmapTask[] {
  return tasks.map((task) =>
    task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task,
  );
}

export function getRoadmapProgress(roadmap: Roadmap): RoadmapProgress {
  const allTasks = roadmap.nodes.flatMap((node) => node.tasks);
  const total = allTasks.length;
  const completed = allTasks.filter((task) => task.isCompleted).length;

  return {
    completed,
    total,
    percent: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export const useRoadmapStore = create<RoadmapStore>()(
  persist(
    (set, get) => ({
      roadmaps: [],
      activeRoadmapId: null,
      isLoaded: false,

      setRoadmaps: (roadmaps) => {
        const prevActive = get().activeRoadmapId;
        const nextActive =
          prevActive && roadmaps.some((item) => item.id === prevActive)
            ? prevActive
            : roadmaps[0]?.id ?? null;

        set({ roadmaps, activeRoadmapId: nextActive });
      },

      setIsLoaded: (value) => set({ isLoaded: value }),

      setActiveRoadmap: (id) => set({ activeRoadmapId: id }),

      addRoadmap: (roadmap) =>
        set((state) => ({
          roadmaps: [roadmap, ...state.roadmaps],
          activeRoadmapId: roadmap.id,
        })),

      toggleFavorite: (roadmapId) =>
        set((state) => ({
          roadmaps: state.roadmaps.map((roadmap) =>
            roadmap.id === roadmapId
              ? { ...roadmap, isFavorited: !roadmap.isFavorited }
              : roadmap,
          ),
        })),

      toggleUpvote: (roadmapId) =>
        set((state) => ({
          roadmaps: state.roadmaps.map((roadmap) => {
            if (roadmap.id !== roadmapId) {
              return roadmap;
            }

            const isUpvoted = !roadmap.isUpvoted;
            const upvotes = roadmap.upvotes + (isUpvoted ? 1 : -1);

            return {
              ...roadmap,
              isUpvoted,
              upvotes: Math.max(0, upvotes),
            };
          }),
        })),

      toggleTask: (roadmapId, nodeId, taskId) =>
        set((state) => ({
          roadmaps: state.roadmaps.map((roadmap) => {
            if (roadmap.id !== roadmapId) {
              return roadmap;
            }

            return {
              ...roadmap,
              nodes: roadmap.nodes.map((node) =>
                node.id === nodeId
                  ? { ...node, tasks: updateTasks(node.tasks, taskId) }
                  : node,
              ),
            };
          }),
        })),
    }),
    {
      name: "metacode-roadmaps",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        roadmaps: state.roadmaps,
        activeRoadmapId: state.activeRoadmapId,
      }),
    },
  ),
);

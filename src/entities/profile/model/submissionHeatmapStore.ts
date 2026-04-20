import { create } from "zustand";
import type { HeatmapSourceTab } from "./types";

interface SubmissionHeatmapState {
  /** Выбранная вкладка по ключу профиля (например `username`), чтобы при навигации между профилями состояния не пересекались */
  tabByProfileKey: Partial<Record<string, HeatmapSourceTab>>;
  setSourceTab: (profileKey: string, tab: HeatmapSourceTab) => void;
}

export const useSubmissionHeatmapStore = create<SubmissionHeatmapState>((set) => ({
  tabByProfileKey: {},
  setSourceTab: (profileKey, tab) =>
    set((s) => ({
      tabByProfileKey: { ...s.tabByProfileKey, [profileKey]: tab },
    })),
}));

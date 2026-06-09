import { create } from "zustand";
import type { HeatmapRangeTab, HeatmapSourceTab } from "./types";

interface SubmissionHeatmapState {
  /** Выбранная вкладка по ключу профиля (например `username`), чтобы при навигации между профилями состояния не пересекались */
  tabByProfileKey: Partial<Record<string, HeatmapSourceTab>>;
  rangeByProfileKey: Partial<Record<string, HeatmapRangeTab>>;
  setSourceTab: (profileKey: string, tab: HeatmapSourceTab) => void;
  setRangeTab: (profileKey: string, range: HeatmapRangeTab) => void;
}

export const useSubmissionHeatmapStore = create<SubmissionHeatmapState>((set) => ({
  tabByProfileKey: {},
  rangeByProfileKey: {},
  setSourceTab: (profileKey, tab) =>
    set((s) => ({
      tabByProfileKey: { ...s.tabByProfileKey, [profileKey]: tab },
    })),
  setRangeTab: (profileKey, range) =>
    set((s) => ({
      rangeByProfileKey: { ...s.rangeByProfileKey, [profileKey]: range },
    })),
}));

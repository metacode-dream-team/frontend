import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { DashboardState, DashboardWidgetType, WidgetConfig, WidgetSize } from "./types";

function makeId(): string {
  return `widget-${Math.random().toString(36).slice(2, 8)}`;
}

function defaultLayout(): WidgetConfig[] {
  return [
    { id: "widget-roadmap", type: "roadmap", size: "md" },
    { id: "widget-leetcode", type: "leetcode", size: "sm" },
    { id: "widget-github", type: "github", size: "sm" },
    { id: "widget-monkeytype", type: "monkeytype", size: "md" },
    { id: "widget-calendar", type: "calendar", size: "lg" },
  ];
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      layout: defaultLayout(),

      updateLayout: (newLayout) => set({ layout: newLayout }),

      addWidget: (type: DashboardWidgetType) =>
        set((state) => ({
          layout: [...state.layout, { id: makeId(), type, size: "sm" }],
        })),

      removeWidget: (id: string) =>
        set((state) => ({
          layout: state.layout.filter((item) => item.id !== id),
        })),

      updateWidgetSize: (id: string, size: WidgetSize) =>
        set((state) => ({
          layout: state.layout.map((item) =>
            item.id === id ? { ...item, size } : item,
          ),
        })),
    }),
    {
      name: "metacode-dashboard-layout",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export type DashboardWidgetType =
  | "roadmap"
  | "leetcode"
  | "github"
  | "monkeytype"
  | "calendar";

export type WidgetSize = "sm" | "md" | "lg";

export interface WidgetConfig {
  id: string;
  type: DashboardWidgetType;
  size: WidgetSize;
}

export interface DashboardState {
  layout: WidgetConfig[];
  updateLayout: (newLayout: WidgetConfig[]) => void;
  addWidget: (type: DashboardWidgetType) => void;
  removeWidget: (id: string) => void;
  updateWidgetSize: (id: string, size: WidgetSize) => void;
}

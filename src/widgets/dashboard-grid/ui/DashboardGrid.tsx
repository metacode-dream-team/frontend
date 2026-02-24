"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/shared/ui/Button";
import {
  getActivityHeatmapData,
  getGithubStats,
  getLeetcodeStats,
  getMonkeytypeStats,
  getRoadmapStats,
} from "@/shared/lib/api/dashboardApi";
import { StatsWidget } from "@/widgets/stats-widget";
import { ActivityHeatmap } from "@/widgets/activity-heatmap";
import { MonkeytypeModeFilter } from "@/features/toggle-monkeytype-mode";
import {
  useEditDashboard,
} from "@/features/edit-dashboard";
import type { DashboardWidgetType, WidgetSize } from "@/entities/dashboard";
import type {
  ActivityDay,
  GithubStats,
  LeetcodeStats,
  MonkeytypeStats,
  RoadmapProgressSummary,
} from "@/entities/stats";

const widgetTypes: DashboardWidgetType[] = [
  "roadmap",
  "leetcode",
  "github",
  "monkeytype",
  "calendar",
];

function spanClass(size: WidgetSize): string {
  if (size === "lg") return "col-span-12";
  if (size === "md") return "col-span-12 md:col-span-6";
  return "col-span-12 md:col-span-6 xl:col-span-4";
}

export function DashboardGrid() {
  const {
    layout,
    isEditMode,
    toggleEditMode,
    onDragStart,
    onDropOn,
    onAddWidget,
    onRemoveWidget,
    onResizeWidget,
  } = useEditDashboard();

  const [selectedWidgetType, setSelectedWidgetType] = useState<DashboardWidgetType>("roadmap");
  const [githubStats, setGithubStats] = useState<GithubStats | null>(null);
  const [leetcodeStats, setLeetcodeStats] = useState<LeetcodeStats | null>(null);
  const [monkeytypeStats, setMonkeytypeStats] = useState<MonkeytypeStats | null>(null);
  const [roadmapStats, setRoadmapStats] = useState<RoadmapProgressSummary | null>(null);
  const [activityData, setActivityData] = useState<ActivityDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [monkeyMode, setMonkeyMode] = useState<"time" | "words">("time");
  const [monkeyValue, setMonkeyValue] = useState("15s");

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      getGithubStats(),
      getLeetcodeStats(),
      getMonkeytypeStats(),
      getRoadmapStats(),
      getActivityHeatmapData(),
    ])
      .then(([github, leetcode, monkeytype, roadmap, activity]) => {
        setGithubStats(github);
        setLeetcodeStats(leetcode);
        setMonkeytypeStats(monkeytype);
        setRoadmapStats(roadmap);
        setActivityData(activity);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const monkeyRecord = useMemo(() => {
    if (!monkeytypeStats) return null;

    return (
      monkeytypeStats.records.find(
        (item) => item.mode === monkeyMode && item.value === monkeyValue,
      ) ?? null
    );
  }, [monkeyMode, monkeyValue, monkeytypeStats]);

  useEffect(() => {
    const defaultValue = monkeyMode === "time" ? "15s" : "10";
    setMonkeyValue(defaultValue);
  }, [monkeyMode]);

  const renderWidgetBody = (type: DashboardWidgetType) => {
    if (isLoading) {
      return <p className="text-sm text-slate-400">Loading widget data...</p>;
    }

    if (type === "github") {
      return (
        <p className="text-3xl font-bold text-slate-100">
          {githubStats?.commitsThisYear ?? 0}
          <span className="ml-2 text-sm font-normal text-slate-400">commits in 2026</span>
        </p>
      );
    }

    if (type === "leetcode") {
      return (
        <div className="space-y-2 text-sm text-slate-200">
          <p>Easy: {leetcodeStats?.easy ?? 0}</p>
          <p>Medium: {leetcodeStats?.medium ?? 0}</p>
          <p>Hard: {leetcodeStats?.hard ?? 0}</p>
        </div>
      );
    }

    if (type === "roadmap") {
      return (
        <div>
          <p className="text-sm text-slate-300">{roadmapStats?.title ?? "No roadmap selected"}</p>
          <p className="mt-2 text-3xl font-bold text-emerald-300">
            {roadmapStats?.progressPercent ?? 0}%
          </p>
        </div>
      );
    }

    if (type === "monkeytype") {
      return (
        <div className="space-y-3">
          <MonkeytypeModeFilter
            mode={monkeyMode}
            value={monkeyValue}
            onModeChange={setMonkeyMode}
            onValueChange={setMonkeyValue}
          />
          <div className="text-sm text-slate-200">
            <p>WPM: {monkeyRecord?.wpm ?? 0}</p>
            <p>Accuracy: {monkeyRecord?.accuracy ?? 0}%</p>
          </div>
        </div>
      );
    }

    return <ActivityHeatmap data={activityData} />;
  };

  const widgetTitle = (type: DashboardWidgetType): string => {
    if (type === "github") return "GitHub Stats";
    if (type === "leetcode") return "LeetCode Stats";
    if (type === "roadmap") return "Roadmap Progress";
    if (type === "monkeytype") return "Monkeytype Stats";
    return "Activity Calendar";
  };

  if (layout.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center">
        <p className="mb-4 text-slate-300">No widgets on dashboard.</p>
        <Button onClick={() => onAddWidget("roadmap")}>Добавить виджет</Button>
      </section>
    );
  }

  return (
    <section>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900/40 p-3">
        <div className="flex items-center gap-2">
          <Button variant={isEditMode ? "primary" : "outline"} size="sm" onClick={toggleEditMode}>
            {isEditMode ? "Finish editing" : "Edit dashboard"}
          </Button>
        </div>

        {isEditMode ? (
          <div className="flex items-center gap-2">
            <select
              value={selectedWidgetType}
              onChange={(event) => setSelectedWidgetType(event.target.value as DashboardWidgetType)}
              className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200"
            >
              {widgetTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <Button size="sm" variant="outline" onClick={() => onAddWidget(selectedWidgetType)}>
              Add widget
            </Button>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {layout.map((widget) => (
          <div key={widget.id} className={spanClass(widget.size)}>
            <StatsWidget
              title={widgetTitle(widget.type)}
              isEditMode={isEditMode}
              draggable={isEditMode}
              onDragStart={() => onDragStart(widget.id)}
              onDrop={() => onDropOn(widget.id)}
              action={
                isEditMode ? (
                  <div className="flex items-center gap-1">
                    <select
                      value={widget.size}
                      onChange={(event) =>
                        onResizeWidget(widget.id, event.target.value as WidgetSize)
                      }
                      className="rounded-md border border-slate-700 bg-slate-900 px-1 py-1 text-[10px] text-slate-300"
                    >
                      <option value="sm">sm</option>
                      <option value="md">md</option>
                      <option value="lg">lg</option>
                    </select>
                    <button
                      onClick={() => onRemoveWidget(widget.id)}
                      className="rounded-md border border-red-500/40 px-2 py-1 text-xs text-red-300"
                    >
                      Remove
                    </button>
                  </div>
                ) : null
              }
            >
              {renderWidgetBody(widget.type)}
            </StatsWidget>
          </div>
        ))}
      </div>
    </section>
  );
}

export const HEATMAP_MAX_COUNT = 30;

/**
 * Потолок шкалы для теплокарты интеграций: вкладка «все» = max по дням из трёх источников, верх 30;
 * отдельно: GitHub 15, LeetCode 20, Monkeytype 30.
 */
export const INTEGRATION_HEATMAP_CAP = {
  all: 30,
  github: 15,
  leetcode: 20,
  monkeytype: 30,
} as const;

export type IntegrationHeatmapCapKey = keyof typeof INTEGRATION_HEATMAP_CAP;

/** Пороги 7 / 15 / 23 от cap=30, линейно по другим cap (GitHub 15, LC 20, MT/All 30) */
function heatmapThresholds(cap: number): { t1: number; t2: number; t3: number } {
  const c = Math.max(1, Math.min(cap, 1e6));
  if (c === 30) {
    return { t1: 7, t2: 15, t3: 23 };
  }
  let t1 = Math.max(1, Math.floor((7 * c) / 30));
  let t2 = Math.max(1, Math.floor((15 * c) / 30));
  let t3 = Math.max(1, Math.min(c, Math.floor((23 * c) / 30)));
  t2 = Math.max(t1, t2);
  t3 = Math.max(t2, t3);
  t3 = Math.min(t3, c);
  t2 = Math.min(t2, t3);
  t1 = Math.min(t1, t2);
  return { t1, t2, t3 };
}

export function countToHeatmapLevel(
  count: number,
  cap: number = HEATMAP_MAX_COUNT,
): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  const c = Math.min(count, cap);
  const { t1, t2, t3 } = heatmapThresholds(cap);
  if (c <= t1) return 1;
  if (c <= t2) return 2;
  if (c <= t3) return 3;
  return 4;
}

export function heatmapLevelRange(
  level: 0 | 1 | 2 | 3 | 4,
  cap: number = HEATMAP_MAX_COUNT,
): string {
  if (level === 0) return "0";
  const c = Math.max(1, cap);
  const { t1, t2, t3 } = heatmapThresholds(c);
  if (level === 1) {
    if (t1 < 1) return "1";
    return t1 === 1 ? "1" : `1–${t1}`;
  }
  if (level === 2) {
    if (t1 >= t2) {
      if (c <= 1) return "1";
      return `${Math.min(t1 + 1, c)}–${c}`;
    }
    return `${t1 + 1}–${t2}`;
  }
  if (level === 3) {
    if (t2 >= t3) {
      if (c <= 1) return "1";
      return `${Math.min(t2 + 1, c)}–${c}`;
    }
    return `${t2 + 1}–${t3}`;
  }
  if (t3 >= c) {
    if (c <= 1) return "1";
    return `${c}`;
  }
  return `${t3 + 1}–${c}`;
}

export type HeatmapPalette = "emerald" | "zinc";

const PALETTES: Record<HeatmapPalette, Record<0 | 1 | 2 | 3 | 4, string>> = {
  emerald: {
    0: "bg-zinc-800",
    1: "bg-emerald-950",
    2: "bg-emerald-800",
    3: "bg-emerald-500",
    4: "bg-emerald-300",
  },
  zinc: {
    0: "bg-zinc-800",
    1: "bg-emerald-950",
    2: "bg-emerald-800",
    3: "bg-emerald-500",
    4: "bg-emerald-400",
  },
};

export function heatmapLevelClass(
  level: 0 | 1 | 2 | 3 | 4,
  palette: HeatmapPalette = "emerald",
): string {
  return PALETTES[palette][level];
}

export function heatmapCountClass(
  count: number,
  palette: HeatmapPalette = "emerald",
  cap: number = HEATMAP_MAX_COUNT,
): string {
  return heatmapLevelClass(countToHeatmapLevel(count, cap), palette);
}

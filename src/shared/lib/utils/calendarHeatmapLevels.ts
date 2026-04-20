/**
 * Уровни интенсивности для календаря активности (как в интеграции: count до 30).
 * 0 — нет активности; 1–4 — возрастающая интенсивность для раскраски.
 */

export const HEATMAP_MAX_COUNT = 30;

/** Дискретные уровни 1..4 по диапазонам внутри 1..HEATMAP_MAX_COUNT */
export function countToHeatmapLevel(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  const c = Math.min(count, HEATMAP_MAX_COUNT);
  if (c <= 7) return 1;
  if (c <= 15) return 2;
  if (c <= 23) return 3;
  return 4;
}

/** Подпись диапазона для легенды / тултипа */
export function heatmapLevelRange(level: 0 | 1 | 2 | 3 | 4): string {
  if (level === 0) return "0";
  if (level === 1) return "1–7";
  if (level === 2) return "8–15";
  if (level === 3) return "16–23";
  return "24–30";
}

export type HeatmapPalette = "emerald" | "zinc";

const PALETTES: Record<
  HeatmapPalette,
  Record<0 | 1 | 2 | 3 | 4, string>
> = {
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

/** По сырому count — класс Tailwind для ячейки */
export function heatmapCountClass(count: number, palette: HeatmapPalette = "emerald"): string {
  return heatmapLevelClass(countToHeatmapLevel(count), palette);
}

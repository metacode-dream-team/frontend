import type { ActivityDay, ActivitySource } from "@/shared/types/stats";

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateActivityData(days: number = 365): ActivityDay[] {
  const now = new Date();
  const sources: ActivitySource[] = ["github", "leetcode", "monkeytype"];
  const result: ActivityDay[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);

    for (const source of sources) {
      const base = source === "github" ? 3 : source === "leetcode" ? 2 : 4;
      const activeDayMultiplier = Math.random() > 0.35 ? 1 : 0;
      result.push({
        date: date.toISOString().slice(0, 10),
        source,
        count: activeDayMultiplier * randomInRange(0, base + 5),
      });
    }
  }

  return result;
}

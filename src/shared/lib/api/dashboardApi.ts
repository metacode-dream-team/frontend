import type {
  ActivityDay,
  ActivitySource,
  GithubStats,
  LeetcodeStats,
  MonkeytypeStats,
  RoadmapProgressSummary,
} from "@/entities/stats";
import { mockRoadmaps } from "./mockRoadmaps";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function calcRoadmapProgress(): RoadmapProgressSummary {
  const first = mockRoadmaps[0];
  const tasks = first.nodes.flatMap((node) => node.tasks);
  const total = tasks.length;
  const completed = tasks.filter((task) => task.isCompleted).length;
  const progressPercent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    title: first.title,
    progressPercent,
  };
}

export async function getGithubStats(): Promise<GithubStats> {
  await delay(500);
  return { commitsThisYear: randomInRange(420, 1800) };
}

export async function getLeetcodeStats(): Promise<LeetcodeStats> {
  await delay(600);
  const easy = randomInRange(120, 280);
  const medium = randomInRange(80, 220);
  const hard = randomInRange(20, 90);

  return { easy, medium, hard };
}

export async function getMonkeytypeStats(): Promise<MonkeytypeStats> {
  await delay(550);

  return {
    records: [
      { mode: "time", value: "15s", wpm: randomInRange(95, 132), accuracy: randomInRange(95, 99) },
      { mode: "time", value: "30s", wpm: randomInRange(90, 126), accuracy: randomInRange(94, 99) },
      { mode: "time", value: "60s", wpm: randomInRange(84, 119), accuracy: randomInRange(93, 99) },
      { mode: "words", value: "10", wpm: randomInRange(98, 136), accuracy: randomInRange(95, 99) },
      { mode: "words", value: "25", wpm: randomInRange(90, 126), accuracy: randomInRange(94, 99) },
      { mode: "words", value: "50", wpm: randomInRange(86, 120), accuracy: randomInRange(93, 99) },
      { mode: "words", value: "100", wpm: randomInRange(78, 112), accuracy: randomInRange(92, 98) },
    ],
  };
}

export async function getRoadmapStats(): Promise<RoadmapProgressSummary> {
  await delay(350);
  return calcRoadmapProgress();
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

export async function getActivityHeatmapData(): Promise<ActivityDay[]> {
  await delay(700);
  return generateActivityData(365);
}

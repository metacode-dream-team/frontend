import type { ProfileData, ProfileHeatmapDay } from "@/entities/profile";

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hash(text: string): number {
  let value = 0;
  for (let i = 0; i < text.length; i++) {
    value = (value * 31 + text.charCodeAt(i)) >>> 0;
  }
  return value;
}

function createHeatmap(seed: number): ProfileHeatmapDay[] {
  const days = 365;
  const now = new Date();
  const result: ProfileHeatmapDay[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const wave = Math.abs(Math.sin((i + seed) / 11));
    const randomBias = ((seed + i * 17) % 7) / 2;
    const count = Math.max(0, Math.round((wave * 8 + randomBias) * (i % 5 === 0 ? 0 : 1)));

    result.push({
      date: date.toISOString().slice(0, 10),
      count,
    });
  }

  return result;
}

export async function getProfileById(id: string): Promise<ProfileData> {
  await delay(700);

  const seed = hash(id || "user");
  const solved = 220 + (seed % 350);
  const easySolved = 100 + (seed % 130);
  const mediumSolved = 90 + (seed % 140);
  const hardSolved = 25 + (seed % 70);

  return {
    id,
    username: id,
    fullName: `Metacode ${id}`,
    avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(id)}`,
    rank: 50000 + (seed % 500000),
    following: seed % 120,
    followers: seed % 240,
    solved,
    totalProblems: 3851,
    easySolved,
    easyTotal: 927,
    mediumSolved,
    mediumTotal: 2014,
    hardSolved,
    hardTotal: 910,
    badges: seed % 5,
    currentStreak: 2 + (seed % 8),
    maxStreak: 7 + (seed % 20),
    communityStats: [
      { label: "Views", value: 240 + (seed % 1000), lastWeek: 12 + (seed % 100) },
      { label: "Solutions", value: 18 + (seed % 40), lastWeek: 2 + (seed % 8) },
      { label: "Discuss", value: 12 + (seed % 35), lastWeek: 1 + (seed % 6) },
      { label: "Reputation", value: 90 + (seed % 400), lastWeek: 4 + (seed % 20) },
    ],
    languages: [
      { name: "TypeScript", solved: 70 + (seed % 80) },
      { name: "Rust", solved: 8 + (seed % 30) },
      { name: "Go", solved: 12 + (seed % 28) },
    ],
    skills: [
      {
        level: "Advanced",
        items: [
          { name: "Dynamic Programming", count: 10 + (seed % 8) },
          { name: "Graph", count: 4 + (seed % 5) },
        ],
      },
      {
        level: "Intermediate",
        items: [
          { name: "Hash Table", count: 20 + (seed % 10) },
          { name: "Greedy", count: 7 + (seed % 7) },
          { name: "Math", count: 10 + (seed % 12) },
        ],
      },
      {
        level: "Fundamental",
        items: [
          { name: "Array", count: 30 + (seed % 16) },
          { name: "String", count: 25 + (seed % 12) },
          { name: "Linked List", count: 12 + (seed % 7) },
        ],
      },
    ],
    heatmap: createHeatmap(seed),
    recentSubmissions: [
      { id: "s1", title: "Reverse Integer", difficulty: "Easy", solvedAt: "2 days ago" },
      { id: "s2", title: "Zigzag Conversion", difficulty: "Medium", solvedAt: "4 days ago" },
      { id: "s3", title: "Longest Palindromic Substring", difficulty: "Medium", solvedAt: "9 days ago" },
      { id: "s4", title: "Median of Two Sorted Arrays", difficulty: "Hard", solvedAt: "15 days ago" },
      { id: "s5", title: "Longest Substring Without Repeating Characters", difficulty: "Medium", solvedAt: "21 days ago" },
      { id: "s6", title: "Two Sum", difficulty: "Easy", solvedAt: "28 days ago" },
    ],
  };
}

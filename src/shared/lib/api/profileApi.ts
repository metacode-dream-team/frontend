import type { ProfileAchievement, ProfileData, ProfileHeatmapDay } from "@/entities/profile";
import { resolvePlatformUrlForFetch } from "@/shared/lib/api/browserProxyUrl";
import { isPlatformApiConfigured } from "./platformClient";
import { buildProfileFromPlatform } from "./platformData";

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

function createAchievements(seed: number): ProfileAchievement[] {
  const u = (i: number) => (seed + i * 13) % 5 !== 0;
  const list: ProfileAchievement[] = [
    {
      id: "ach-streak",
      title: "50-day solving streak",
      description: "Submitted at least one accepted solution on 50 consecutive days.",
      tone: "emerald",
      unlocked: u(0),
      unlockedAt: u(0) ? "Jan 2026" : undefined,
    },
    {
      id: "ach-explorer",
      title: "Topic explorer",
      description: "Solved problems across 12 different problem tags.",
      tone: "amber",
      unlocked: u(1),
      unlockedAt: u(1) ? "Dec 2025" : undefined,
    },
    {
      id: "ach-contest",
      title: "Weekly contest top 25%",
      description: "Finished inside the top quarter in any rated weekly contest.",
      tone: "violet",
      unlocked: u(2),
      unlockedAt: u(2) ? "Nov 2025" : undefined,
    },
    {
      id: "ach-first",
      title: "First acceptance",
      description: "Got your first accepted submission on the platform.",
      tone: "emerald",
      unlocked: true,
      unlockedAt: "Mar 2024",
    },
    {
      id: "ach-hard",
      title: "Hard breakthrough",
      description: "Solved 25 hard-rated problems.",
      tone: "violet",
      unlocked: u(4),
      unlockedAt: u(4) ? "Oct 2025" : undefined,
    },
    {
      id: "ach-speed",
      title: "Speed run",
      description: "Solved 5 problems in a single day with all accepted on first submission.",
      tone: "amber",
      unlocked: u(5),
      unlockedAt: u(5) ? "Sep 2025" : undefined,
    },
    {
      id: "ach-community",
      title: "Discussion helper",
      description: "Earned 50 upvotes on public solution explanations.",
      tone: "emerald",
      unlocked: false,
    },
    {
      id: "ach-legend",
      title: "Legend tier",
      description: "Reach global rank under 10,000 while staying active for 90 days.",
      tone: "violet",
      unlocked: false,
    },
  ];
  return list;
}

function buildMockProfile(id: string): ProfileData {
  const seed = hash(id || "user");
  const solved = 220 + (seed % 350);
  const easySolved = 100 + (seed % 130);
  const mediumSolved = 90 + (seed % 140);
  const hardSolved = 25 + (seed % 70);
  const attempting = seed % 18;

  return {
    id,
    username: id,
    fullName: `Metacode ${id}`,
    avatarUrl: `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(id)}`,
    rank: 50000 + (seed % 500000),
    role: "Software Engineer",
    location: "Almaty, Kazakhstan",
    following: seed % 120,
    followers: seed % 240,
    solved,
    totalProblems: 3902,
    attempting,
    easySolved,
    easyTotal: 937,
    mediumSolved,
    mediumTotal: 2042,
    hardSolved,
    hardTotal: 923,
    achievements: createAchievements(seed),
    currentStreak: 2 + (seed % 8),
    maxStreak: 7 + (seed % 20),
    languages: [
      { name: "Go", solved: 400 + (seed % 120) },
      { name: "TypeScript", solved: 70 + (seed % 80) },
      { name: "PostgreSQL", solved: 8 + (seed % 24) },
    ],
    skills: [
      {
        level: "Advanced",
        items: [
          { name: "Dynamic Programming", count: 40 + (seed % 55) },
          { name: "Union-Find", count: 12 + (seed % 28) },
          { name: "Backtracking", count: 8 + (seed % 22) },
        ],
      },
      {
        level: "Intermediate",
        items: [
          { name: "Hash Table", count: 60 + (seed % 50) },
          { name: "DFS", count: 30 + (seed % 50) },
          { name: "BFS", count: 28 + (seed % 45) },
        ],
      },
      {
        level: "Fundamental",
        items: [
          { name: "Array", count: 120 + (seed % 120) },
          { name: "String", count: 40 + (seed % 90) },
          { name: "Sorting", count: 35 + (seed % 40) },
        ],
      },
    ],
    heatmap: createHeatmap(seed),
    experience: [
      {
        id: "e1",
        title: "Backend Developer",
        company: "IT Dev Group",
        employmentType: "Full-time",
        workMode: "Hybrid",
        location: "Almaty, Kazakhstan",
        start: "Oct 2025",
        end: "Present",
        description: "API design, PostgreSQL, and service reliability for internal products.",
      },
      {
        id: "e2",
        title: "Java Software Engineer",
        company: "FAANG School",
        employmentType: "Apprenticeship",
        workMode: "Remote",
        location: "Global",
        start: "Aug 2024",
        end: "Dec 2024",
        description: "Algorithms, system design drills, and interview-style problem sets.",
      },
    ],
    education: [
      {
        id: "ed1",
        school: "Narxoz University",
        degree: "Bachelor of Engineering",
        start: "Sep 2022",
        end: "May 2026",
        gpa: "3.2",
        specialization: "Computer Science",
        logoUrl: `https://api.dicebear.com/7.x/initials/svg?seed=NU&backgroundType=gradientLinear`,
      },
    ],
    certifications: [
      {
        id: "c1",
        title: "AWS Academy Data Engineering",
        issuer: "Amazon Web Services",
        issued: "Dec 2025",
        provider: "aws",
      },
      {
        id: "c2",
        title: "HCIA-Security Course",
        issuer: "Huawei",
        issued: "Apr 2025",
        provider: "huawei",
      },
    ],
    techSkills: ["Redis", "Golang", "Docker", "Kubernetes", "gRPC"],
  };
}

export async function getProfileById(id: string): Promise<ProfileData> {
  if (isPlatformApiConfigured()) {
    try {
      return await buildProfileFromPlatform(id);
    } catch (e) {
      const example = resolvePlatformUrlForFetch("/v1/profiles/<username>");
      console.warn(
        `[Profile] Platform unreachable (${example}). ` +
          `SSR: set PLATFORM_API_SERVER_URL inside Docker, or run platform on the host/port from NEXT_PUBLIC_PLATFORM_API_URL. ` +
          `Mock-only dev: set NEXT_PUBLIC_PLATFORM_API_URL= (empty) or false. Using mock.`,
        e,
      );
    }
  }

  await delay(700);
  return buildMockProfile(id);
}

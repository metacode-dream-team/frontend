/**
 * Маппинг ответов platform API (snake_case / вложенные объекты) в типы UI.
 */

import type {
  ProfileAchievement,
  ProfileData,
  ProfileEducation,
  ProfileExperience,
  ProfileHeatmapDay,
} from "@/entities/profile";
import type { ActivityDay, ActivitySource, GithubStats, LeetcodeStats, MonkeytypeStats } from "@/entities/stats";

type Json = Record<string, unknown>;

/** Ответы вида { "data": { ... } } */
export function unwrapDataPayload(raw: unknown): Json {
  if (!raw || typeof raw !== "object") return {};
  const r = raw as Json;
  if (r.data !== undefined && typeof r.data === "object" && r.data !== null) {
    return r.data as Json;
  }
  return r;
}

function str(v: unknown, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  return String(v);
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isNaN(n) ? fallback : n;
  }
  return fallback;
}

function bool(v: unknown): boolean {
  return v === true || v === "true" || v === 1;
}

export function pickUserId(raw: unknown): string | null {
  const j = unwrapDataPayload(raw);
  const id =
    str(j.user_id, "") ||
    str(j.userId, "") ||
    str(j.id, "");
  if (/^[0-9a-f-]{36}$/i.test(id)) {
    return id;
  }
  return null;
}

/** GET /v1/profiles/{username} или /v1/profiles/me */
export function mapProfileDocument(
  raw: Json,
  fallbackId: string,
  extras: {
    achievements: ProfileAchievement[];
    heatmap: ProfileHeatmapDay[];
  },
): ProfileData {
  const username = str(raw.username, fallbackId);
  const first = str(raw.first_name ?? raw.firstname ?? raw.firstName, "");
  const last = str(raw.last_name ?? raw.lastname ?? raw.lastName, "");
  const fullName =
    str(raw.full_name ?? raw.fullName, "").trim() ||
    [first, last].filter(Boolean).join(" ").trim() ||
    username;

  const exp = mapExperience(raw.experience ?? raw.work_experience);
  const edu = mapEducation(raw.education);
  const tech = mapStringArray(raw.tech_skills ?? raw.techSkills ?? raw.skills_tags);

  return {
    id: str(raw.id ?? raw.user_id, fallbackId),
    username,
    fullName,
    avatarUrl: str(raw.avatar_url ?? raw.avatarUrl, `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(username)}`),
    rank: num(raw.rank ?? raw.global_rank),
    role: str(raw.role ?? raw.headline ?? raw.title, "Developer"),
    location: str(raw.location ?? raw.city, ""),
    following: num(raw.following ?? raw.following_count),
    followers: num(raw.followers ?? raw.followers_count),
    solved: num(raw.solved ?? raw.total_solved),
    totalProblems: num(raw.total_problems ?? raw.totalProblems, 3902),
    attempting: num(raw.attempting ?? raw.in_progress),
    easySolved: num(raw.easy_solved ?? raw.easySolved),
    easyTotal: num(raw.easy_total ?? raw.easyTotal, 937),
    mediumSolved: num(raw.medium_solved ?? raw.mediumSolved),
    mediumTotal: num(raw.medium_total ?? raw.mediumTotal, 2042),
    hardSolved: num(raw.hard_solved ?? raw.hardSolved),
    hardTotal: num(raw.hard_total ?? raw.hardTotal, 923),
    achievements: extras.achievements,
    currentStreak: num(raw.current_streak ?? raw.currentStreak),
    maxStreak: num(raw.max_streak ?? raw.maxStreak),
    languages: mapLanguages(raw.languages ?? raw.language_stats),
    skills: mapSkillGroups(raw.skill_groups ?? raw.skills),
    heatmap: extras.heatmap,
    experience: exp,
    education: edu,
    certifications: [],
    techSkills: tech,
  };
}

function mapExperience(raw: unknown): ProfileData["experience"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, i) => {
    const o = item as Json;
    return {
      id: str(o.id, `e${i}`),
      title: str(o.title ?? o.role, "Role"),
      company: str(o.company ?? o.organization, ""),
      employmentType: str(o.employment_type ?? o.employmentType, "Full-time"),
      workMode: normalizeWorkMode(str(o.work_mode ?? o.workMode, "Remote")),
      location: str(o.location, ""),
      start: str(o.start ?? o.start_date, ""),
      end: str(o.end ?? o.end_date ?? "Present", "Present"),
      description: str(o.description, "") || undefined,
    };
  });
}

function normalizeWorkMode(w: string): ProfileExperience["workMode"] {
  const x = w.toLowerCase();
  if (x.includes("hybrid")) return "Hybrid";
  if (x.includes("on-site") || x.includes("onsite")) return "On-site";
  return "Remote";
}

function mapEducation(raw: unknown): ProfileData["education"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item, i) => {
    const o = item as Json;
    return {
      id: str(o.id, `ed${i}`),
      school: str(o.school ?? o.institution, ""),
      degree: str(o.degree, ""),
      start: str(o.start ?? o.start_date, ""),
      end: str(o.end ?? o.end_date, ""),
      gpa: str(o.gpa, "") || undefined,
      specialization: str(o.specialization ?? o.field, "") || undefined,
      logoUrl: str(o.logo_url ?? o.logoUrl, "") || undefined,
    };
  });
}

function mapStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x)).filter(Boolean);
}

function mapLanguages(raw: unknown): ProfileData["languages"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const o = item as Json;
    return {
      name: str(o.name ?? o.language, "—"),
      solved: num(o.solved ?? o.count),
    };
  });
}

function mapSkillGroups(raw: unknown): ProfileData["skills"] {
  if (!Array.isArray(raw)) return [];
  const levels: ProfileData["skills"][0]["level"][] = ["Fundamental", "Intermediate", "Advanced"];
  return raw.map((item, i) => {
    const o = item as Json;
    const level = (str(o.level, levels[i % 3]!) as ProfileData["skills"][0]["level"]) ?? "Intermediate";
    const items = Array.isArray(o.items)
      ? (o.items as Json[]).map((it) => ({
          name: str(it.name, ""),
          count: num(it.count),
        }))
      : [];
    return { level, items };
  });
}

export function mapAchievementsPayload(raw: unknown): ProfileAchievement[] {
  const root = unwrapDataPayload(raw);
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((root as Json).achievements)
      ? ((root as Json).achievements as unknown[])
      : Array.isArray((root as Json).data)
        ? ((root as Json).data as unknown[])
        : [];
  if (!Array.isArray(list)) return [];

  const tones: ProfileAchievement["tone"][] = ["emerald", "amber", "violet"];
  return list.map((item, i) => {
    const o = item as Json;
    const unlocked = bool(o.unlocked ?? o.is_unlocked ?? o.earned);
    return {
      id: str(o.id ?? o.slug, `ach-${i}`),
      title: str(o.title ?? o.name, "Achievement"),
      description: str(o.description ?? o.desc, ""),
      tone: tones[i % 3]!,
      unlocked,
      unlockedAt: unlocked ? str(o.unlocked_at ?? o.unlockedAt ?? o.earned_at, "") || undefined : undefined,
    };
  });
}

/** Календарь / интеграция: гибкий формат дней */
export function mapCalendarToProfileHeatmap(raw: unknown): ProfileHeatmapDay[] {
  const j = unwrapDataPayload(raw);
  const rows = Array.isArray(raw)
    ? raw
    : (j.days as unknown) ??
      (j.calendar as unknown) ??
      (Array.isArray(j.data) ? j.data : null) ??
      (raw as Json)?.days;
  if (!Array.isArray(rows)) return [];

  return rows.map((item) => {
    const o = item as Json;
    const date = str(o.date ?? o.day, "").slice(0, 10);
    const count = num(o.count ?? o.total ?? o.value ?? o.activity);
    return { date, count };
  }).filter((d) => d.date.length >= 8);
}

export function mapCalendarToActivityDays(raw: unknown): ActivityDay[] {
  const rows = Array.isArray(raw) ? raw : (raw as Json)?.days ?? (raw as Json)?.data;
  if (!Array.isArray(rows)) return [];

  const sources: ActivitySource[] = ["github", "leetcode", "monkeytype"];
  const out: ActivityDay[] = [];

  for (const item of rows) {
    const o = item as Json;
    const date = str(o.date ?? o.day, "").slice(0, 10);
    if (!date) continue;

    const gh = num(o.github ?? o.github_count ?? o.commits);
    const lc = num(o.leetcode ?? o.leetcode_count ?? o.submissions);
    const mt = num(o.monkeytype ?? o.monkey ?? o.wpm_sessions);
    const total = num(o.count ?? o.total, gh + lc + mt);

    if (gh > 0) out.push({ date, source: "github", count: gh });
    if (lc > 0) out.push({ date, source: "leetcode", count: lc });
    if (mt > 0) out.push({ date, source: "monkeytype", count: mt });
    if (gh === 0 && lc === 0 && mt === 0 && total > 0) {
      out.push({ date, source: sources[out.length % 3]!, count: total });
    }
  }

  return out;
}

const INTEGRATION_SOURCES: ActivitySource[] = ["github", "leetcode", "monkeytype"];

/**
 * Календари из GET /v1/integration/profile: data.github|leetcode|monkeytype.current_years_activity.days
 */
export function mapIntegrationProfileToActivityDays(raw: unknown): ActivityDay[] {
  const root = unwrapDataPayload(raw);
  const out: ActivityDay[] = [];

  for (const source of INTEGRATION_SOURCES) {
    const block = root[source] as Json | undefined;
    if (!block || typeof block !== "object") continue;
    const cya = block.current_years_activity as Json | undefined;
    if (!cya || typeof cya !== "object") continue;
    const days = cya.days;
    if (!Array.isArray(days)) continue;

    for (const d of days) {
      if (!d || typeof d !== "object") continue;
      const o = d as Json;
      const date = str(o.date, "").slice(0, 10);
      const count = num(o.count);
      if (!date || count <= 0) continue;
      out.push({ date, source, count });
    }
  }

  return out;
}

export function mergeActivityDaysToHeatmap(rows: ActivityDay[]): ProfileHeatmapDay[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    map.set(r.date, (map.get(r.date) ?? 0) + r.count);
  }
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function mapLeetcodeSkillTree(skills: Json): ProfileData["skills"] {
  const levels: Array<{ key: string; level: ProfileData["skills"][0]["level"] }> = [
    { key: "fundamental", level: "Fundamental" },
    { key: "intermediate", level: "Intermediate" },
    { key: "advanced", level: "Advanced" },
  ];

  return levels
    .map(({ key, level }) => {
      const arr = skills[key] as unknown;
      const items = Array.isArray(arr)
        ? (arr as Json[]).map((tag) => ({
            name: str(tag.tag_name ?? tag.name, ""),
            count: num(tag.questions_solved ?? tag.count),
          }))
        : [];
      return { level, items: items.filter((it) => it.name.length > 0) };
    })
    .filter((g) => g.items.length > 0);
}

/** GET /v1/integration/profile — виджеты дашборда (контракт с data.github / … / personal_bests) */
export function mapIntegrationProfileToStats(raw: unknown): {
  github: GithubStats | null;
  leetcode: LeetcodeStats | null;
  monkeytype: MonkeytypeStats | null;
} {
  const root = unwrapDataPayload(raw);
  const github = root.github ?? root.github_stats;
  const lc = root.leetcode ?? root.leetcode_stats;
  const mt = root.monkeytype ?? root.monkeytype_stats;

  let githubStats: GithubStats | null = null;
  if (github && typeof github === "object") {
    const g = github as Json;
    const cya = g.current_years_activity as Json | undefined;
    const fromActivity =
      cya && typeof cya === "object" ? num(cya.total) : 0;
    const commits =
      fromActivity ||
      num(g.commits_this_year ?? g.commitsThisYear ?? g.commits ?? g.total_commits);
    if (commits > 0 || Object.keys(g).length > 0) {
      githubStats = { commitsThisYear: commits || num(g.yearly, 0) };
    }
  }

  let leetcodeStats: LeetcodeStats | null = null;
  if (lc && typeof lc === "object") {
    const l = lc as Json;
    const stats = l.stats as Json | undefined;
    const db = stats?.difficulty_breakdown as Json | undefined;
    if (db && typeof db === "object") {
      const easy = db.easy as Json | undefined;
      const medium = db.medium as Json | undefined;
      const hard = db.hard as Json | undefined;
      leetcodeStats = {
        easy: num(easy?.solved),
        medium: num(medium?.solved),
        hard: num(hard?.solved),
      };
    } else {
      leetcodeStats = {
        easy: num(l.easy ?? l.easy_solved),
        medium: num(l.medium ?? l.medium_solved),
        hard: num(l.hard ?? l.hard_solved),
      };
    }
  }

  let monkeytypeStats: MonkeytypeStats | null = null;
  if (mt && typeof mt === "object") {
    const m = mt as Json;
    const recordsRaw = m.personal_bests ?? m.records ?? m.best_records;
    if (Array.isArray(recordsRaw) && recordsRaw.length > 0) {
      monkeytypeStats = {
        records: recordsRaw.map((r) => {
          const x = r as Json;
          const mode = str(x.mode, "time") === "words" ? "words" : "time";
          const length = num(x.length);
          const value =
            mode === "time"
              ? `${length || 15}s`
              : String(length || 10);
          return {
            mode,
            value,
            wpm: num(x.wpm),
            accuracy: num(x.accuracy ?? x.acc, 97),
          };
        }),
      };
    }
  }

  return {
    github: githubStats,
    leetcode: leetcodeStats,
    monkeytype: monkeytypeStats,
  };
}

/** Дополняет профиль данными интеграции (LeetCode stats/skills, streak Monkeytype, heatmap). */
export function augmentProfileWithIntegration(
  base: ProfileData,
  integrationRaw: unknown,
): ProfileData {
  const root = unwrapDataPayload(integrationRaw);
  if (!Object.keys(root).length) return base;

  const next = { ...base };

  const lc = root.leetcode as Json | undefined;
  if (lc && typeof lc === "object") {
    const stats = lc.stats as Json | undefined;
    if (stats && typeof stats === "object") {
      next.solved = num(stats.total_solved, next.solved);
      next.totalProblems = num(stats.total_questions_count, next.totalProblems);
      const db = stats.difficulty_breakdown as Json | undefined;
      if (db && typeof db === "object") {
        const easy = db.easy as Json | undefined;
        const medium = db.medium as Json | undefined;
        const hard = db.hard as Json | undefined;
        next.easySolved = num(easy?.solved, next.easySolved);
        next.easyTotal = num(easy?.total, next.easyTotal);
        next.mediumSolved = num(medium?.solved, next.mediumSolved);
        next.mediumTotal = num(medium?.total, next.mediumTotal);
        next.hardSolved = num(hard?.solved, next.hardSolved);
        next.hardTotal = num(hard?.total, next.hardTotal);
      }
    }
    const skillTree = lc.skills as Json | undefined;
    if (skillTree && typeof skillTree === "object") {
      const mapped = mapLeetcodeSkillTree(skillTree);
      if (mapped.length > 0) {
        next.skills = mapped;
      }
    }
  }

  const mt = root.monkeytype as Json | undefined;
  if (mt && typeof mt === "object") {
    const streak = mt.streak as Json | undefined;
    if (streak && typeof streak === "object") {
      next.currentStreak = num(streak.current, next.currentStreak);
      next.maxStreak = num(streak.max, next.maxStreak);
    }
  }

  const mergedActivity = mapIntegrationProfileToActivityDays(integrationRaw);
  if (mergedActivity.length > 0) {
    next.heatmap = mergeActivityDaysToHeatmap(mergedActivity);
  }

  return next;
}

import {
  formatMeYearMonth,
  type ProfileAchievement,
  type ProfileCertification,
  type ProfileData,
  type ProfileEducation,
  type ProfileExperience,
  type ProfileHeatmapBySource,
  type ProfileHeatmapDay,
} from "@/entities/profile";
import type { ActivityDay, ActivitySource, GithubStats, LeetcodeStats, MonkeytypeStats } from "@/entities/stats";

type Json = Record<string, unknown>;

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
    str(j.UserID, "") ||
    str(j.user_id, "") ||
    str(j.userId, "") ||
    str(j.ID, "") ||
    str(j.id, "");
  if (/^[0-9a-f-]{36}$/i.test(id)) {
    return id;
  }
  return null;
}

export function mapProfileDocument(
  raw: Json,
  fallbackId: string,
  extras: {
    achievements: ProfileAchievement[];
    heatmap: ProfileHeatmapDay[];
  },
): ProfileData {
  const username = str(raw.Username ?? raw.username, fallbackId);
  const first = str(
    raw.FirstName ?? raw.first_name ?? raw.firstname ?? raw.firstName,
    "",
  );
  const last = str(
    raw.LastName ?? raw.last_name ?? raw.lastname ?? raw.lastName,
    "",
  );
  const fullName =
    str(raw.FullName ?? raw.full_name ?? raw.fullName, "").trim() ||
    [first, last].filter(Boolean).join(" ").trim() ||
    username;

  const exp = mapExperience(
    raw.Experiences ?? raw.experience ?? raw.work_experience,
  );
  const edu = mapEducation(raw.Educations ?? raw.education);
  const tech = mapStringArray(
    raw.tech_skills ?? raw.techSkills ?? raw.skills_tags ?? raw.TechSkills,
  );

  // `id` в приоритете = UserID (тот же query `user_id`, что в /integration/profile и /activity/user/achievement)
  return {
    id: str(
      raw.UserID ?? raw.user_id ?? raw.userId ?? raw.ID ?? raw.id,
      fallbackId,
    ),
    username,
    fullName,
    avatarUrl: str(
      raw.AvatarURL ?? raw.avatar_url ?? raw.avatarUrl,
      `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(username)}`,
    ),
    rank: num(raw.Rank ?? raw.rank ?? raw.global_rank),
    role: str(raw.Role ?? raw.role ?? raw.Headline ?? raw.headline ?? raw.Title ?? raw.title, "Developer"),
    location: str(raw.Location ?? raw.location ?? raw.City ?? raw.city, ""),
    following: num(raw.FollowingCount ?? raw.following ?? raw.following_count ?? raw.followingCount),
    followers: num(raw.FollowersCount ?? raw.followers ?? raw.followers_count ?? raw.followersCount),
    solved: num(raw.Solved ?? raw.solved ?? raw.total_solved),
    totalProblems: num(raw.TotalProblems ?? raw.total_problems ?? raw.totalProblems, 3902),
    attempting: num(raw.Attempting ?? raw.attempting ?? raw.in_progress),
    easySolved: num(raw.EasySolved ?? raw.easy_solved ?? raw.easySolved),
    easyTotal: num(raw.EasyTotal ?? raw.easy_total ?? raw.easyTotal, 937),
    mediumSolved: num(raw.MediumSolved ?? raw.medium_solved ?? raw.mediumSolved),
    mediumTotal: num(raw.MediumTotal ?? raw.medium_total ?? raw.mediumTotal, 2042),
    hardSolved: num(raw.HardSolved ?? raw.hard_solved ?? raw.hardSolved),
    hardTotal: num(raw.HardTotal ?? raw.hard_total ?? raw.hardTotal, 923),
    achievements: extras.achievements,
    currentStreak: num(raw.CurrentStreak ?? raw.current_streak ?? raw.currentStreak),
    maxStreak: num(raw.MaxStreak ?? raw.max_streak ?? raw.maxStreak),
    languages: mapLanguages(raw.Languages ?? raw.languages ?? raw.language_stats),
    skills: mapSkillGroups(raw.SkillGroups ?? raw.skill_groups ?? raw.skills),
    heatmap: extras.heatmap,
    experience: exp,
    education: edu,
    certifications: mapApiCertificationsToProfile(
      raw.Certifications ?? raw.certifications,
    ),
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

function inferCertificationProvider(issuer: string): ProfileCertification["provider"] {
  const lower = issuer.toLowerCase();
  if (/amazon|aws/.test(lower)) return "aws";
  if (/huawei/.test(lower)) return "huawei";
  if (/google/.test(lower)) return "google";
  return "other";
}

export function mapApiCertificationsToProfile(raw: unknown): ProfileCertification[] {
  if (!Array.isArray(raw)) return [];
  const out: ProfileCertification[] = [];
  for (let i = 0; i < raw.length; i++) {
    const o = raw[i] as Json;
    const title = str(o.Name ?? o.name ?? o.title, "").trim();
    if (!title) continue;
    const issuer = str(o.Issuer ?? o.issuer, "").trim() || "—";
    const id = str(o.ID ?? o.id, `cert${i}`);
    const issueRaw = o.IssueDate ?? o.issue_date ?? o.issueDate;
    const issued = formatMeYearMonth(issueRaw) || "—";
    const expireRaw = o.ExpireDate ?? o.expire_date ?? o.expireDate;
    const expStr =
      expireRaw != null && typeof expireRaw === "object" && expireRaw !== null
        ? formatMeYearMonth(expireRaw)
        : "";
    const expires = expStr && expStr.length > 0 ? expStr : undefined;
    const urlRaw = o.CredentialURL ?? o.credentialURL ?? o.credential_url;
    const credentialUrl =
      typeof urlRaw === "string" && urlRaw.trim() ? urlRaw.trim() : undefined;
    out.push({
      id,
      title,
      issuer,
      issued,
      expires,
      credentialUrl,
      provider: inferCertificationProvider(issuer),
    });
  }
  return out;
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
  const list = extractAchievementList(raw);
  if (!list.length) return [];

  const tones: ProfileAchievement["tone"][] = ["emerald", "amber", "violet"];
  return list.map((item, i) => {
    const o = item as Json;
    const achievedAt = str(
      o.AchievedAt ?? o.achieved_at ?? o.unlocked_at ?? o.unlockedAt ?? o.earned_at ?? "",
      "",
    );
    const unlocked =
      bool(o.unlocked ?? o.is_unlocked ?? o.earned) || achievedAt.length > 0;
    return {
      id: str(
        o.AchievementID ?? o.achievement_id ?? o.id ?? o.slug,
        `ach-${i}`,
      ),
      title: str(o.Name ?? o.title ?? o.name, "Achievement"),
      description: str(o.Description ?? o.description ?? o.desc, ""),
      tone: tones[i % 3]!,
      unlocked,
      unlockedAt: unlocked
        ? achievedAt ||
          str(o.unlocked_at ?? o.unlockedAt ?? o.earned_at ?? "", "") ||
          undefined
        : undefined,
    };
  });
}

function extractAchievementList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw;
  if (!raw || typeof raw !== "object") return [];
  const r = raw as Json;
  if (Array.isArray(r.data)) return r.data as unknown[];
  if (Array.isArray(r.achievements)) return r.achievements as unknown[];

  const inner = unwrapDataPayload(raw);
  if (Array.isArray(inner)) return inner as unknown[];
  if (inner && typeof inner === "object") {
    const j = inner as Json;
    if (Array.isArray(j.achievements)) return j.achievements as unknown[];
    if (Array.isArray(j.data)) return j.data as unknown[];
  }
  return [];
}

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

export function mergeActivityDaysToHeatmapMax(rows: ActivityDay[]): ProfileHeatmapDay[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    const prev = map.get(r.date) ?? 0;
    map.set(r.date, Math.max(prev, r.count));
  }
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

function activityDaysToHeatmapForSource(
  rows: ActivityDay[],
  source: ActivitySource,
): ProfileHeatmapDay[] {
  const map = new Map<string, number>();
  for (const r of rows) {
    if (r.source !== source) continue;
    const prev = map.get(r.date) ?? 0;
    map.set(r.date, Math.max(prev, r.count));
  }
  return Array.from(map.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** combinedMax: по дате max(github, leetcode, monkeytype), не сумма и не среднее */
export function buildIntegrationHeatmapBundle(rows: ActivityDay[]): ProfileHeatmapBySource {
  return {
    combinedMax: mergeActivityDaysToHeatmapMax(rows),
    github: activityDaysToHeatmapForSource(rows, "github"),
    leetcode: activityDaysToHeatmapForSource(rows, "leetcode"),
    monkeytype: activityDaysToHeatmapForSource(rows, "monkeytype"),
  };
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
    const bundle = buildIntegrationHeatmapBundle(mergedActivity);
    next.heatmap = bundle.combinedMax;
    next.heatmapBySource = bundle;
  }

  return next;
}

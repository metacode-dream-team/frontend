import type { FeedEvent } from "@/shared/types/event";
import { extractArrayPayload } from "./platformMappers";

type Json = Record<string, unknown>;

function str(v: unknown, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  return String(v);
}

function avatarFallback(username: string): string {
  const seed = encodeURIComponent(username || "user");
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${seed}`;
}

function mapApiTypeToEventType(apiType: string): FeedEvent["type"] | null {
  const t = apiType.trim().toLowerCase();
  if (t === "achievement.granted") return "ACHIEVEMENT_GRANTED";
  if (t === "avatar.updated") return "AVATAR_UPDATED";
  if (t === "discussion.created") return "DISCUSSION_CREATED";
  return null;
}

function mapEngagementItem(raw: unknown): FeedEvent | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Json;
  const apiType = str(o.type ?? o.event_type);
  const eventType = mapApiTypeToEventType(apiType);
  if (!eventType) return null;

  const user = (o.user as Json | undefined) ?? {};
  const payload = (o.payload as Json | undefined) ?? {};
  const username = str(user.username ?? o.username, "user").trim() || "user";
  const userId = str(o.user_id ?? user.user_id ?? user.userId, "");
  const id = str(o.id);
  if (!id) return null;

  const base = {
    id,
    userId,
    username,
    userAvatar:
      str(user.avatar_url ?? user.avatarUrl ?? o.avatar_url).trim() ||
      avatarFallback(username),
    createdAt: str(o.occurred_at ?? o.created_at ?? o.createdAt),
    type: eventType,
  };

  switch (eventType) {
    case "ACHIEVEMENT_GRANTED":
      return {
        ...base,
        type: "ACHIEVEMENT_GRANTED",
        payload: {
          name: str(payload.name ?? payload.title, "Achievement"),
          description: str(payload.description ?? payload.desc, ""),
          achievementId:
            str(payload.achievement_id ?? payload.achievementId).trim() ||
            undefined,
        },
      };
    case "AVATAR_UPDATED":
      return {
        ...base,
        type: "AVATAR_UPDATED",
        payload: {
          avatarUrl:
            str(payload.avatar_url ?? payload.avatarUrl).trim() || undefined,
        },
      };
    case "DISCUSSION_CREATED": {
      const title = str(
        payload.discussion_title ??
          payload.discussionTitle ??
          payload.title ??
          payload.name,
        "Discussion",
      );
      const discussionId = str(
        payload.discussion_id ?? payload.discussionId ?? payload.id,
      ).trim();
      const discussionSlug = str(
        payload.discussion_slug ?? payload.discussionSlug,
      ).trim();
      return {
        ...base,
        type: "DISCUSSION_CREATED",
        payload: {
          discussionTitle: title,
          discussionId: discussionId || undefined,
          discussionSlug: discussionSlug || undefined,
        },
      };
    }
    default:
      return null;
  }
}

export function mapEngagementFeedPayload(raw: unknown): FeedEvent[] {
  const list = extractArrayPayload(raw);

  const out: FeedEvent[] = [];
  for (const item of list) {
    const mapped = mapEngagementItem(item);
    if (mapped) out.push(mapped);
  }
  return out;
}

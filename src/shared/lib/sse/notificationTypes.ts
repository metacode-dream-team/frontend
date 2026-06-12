export interface NotificationEvent {
  id: string;
  user_id: string;
  title: string;
  payload: string;
  type: string;
  priority: number;
  metadata: unknown | null;
  is_read: boolean;
  created_at: string;
}

function str(v: unknown, fallback = ""): string {
  return v == null ? fallback : String(v);
}

function num(v: unknown, fallback = 0): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function bool(v: unknown, fallback = false): boolean {
  if (typeof v === "boolean") return v;
  if (v === "true") return true;
  if (v === "false") return false;
  return fallback;
}

export function parseNotificationEvent(data: string): NotificationEvent | null {
  const trimmed = data.trim();
  if (!trimmed) return null;

  try {
    const raw = JSON.parse(trimmed) as Record<string, unknown>;
    const type = str(raw.type ?? raw.Type).trim();
    if (!type) return null;

    return {
      id: str(raw.id ?? raw.ID),
      user_id: str(raw.user_id ?? raw.userId ?? raw.UserID),
      title: str(raw.title ?? raw.Title),
      payload: str(raw.payload ?? raw.Payload),
      type,
      priority: num(raw.priority ?? raw.Priority),
      metadata: (raw.metadata ?? raw.Metadata) ?? null,
      is_read: bool(raw.is_read ?? raw.isRead ?? raw.IsRead),
      created_at: str(raw.created_at ?? raw.createdAt ?? raw.CreatedAt),
    };
  } catch {
    return null;
  }
}

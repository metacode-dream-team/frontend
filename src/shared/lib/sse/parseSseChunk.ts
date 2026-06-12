export interface SseMessage {
  event: string;
  data: string;
}

export function parseSseBuffer(buffer: string): {
  messages: SseMessage[];
  remainder: string;
} {
  const messages: SseMessage[] = [];
  const parts = buffer.split("\n\n");
  const remainder = parts.pop() ?? "";

  for (const part of parts) {
    if (!part.trim()) continue;

    let event = "message";
    const dataLines: string[] = [];

    for (const line of part.split("\n")) {
      if (line.startsWith("event:")) {
        event = line.slice(6).trim();
      } else if (line.startsWith("data:")) {
        dataLines.push(line.slice(5).trimStart());
      }
    }

    if (dataLines.length > 0) {
      messages.push({ event, data: dataLines.join("\n") });
    }
  }

  return { messages, remainder };
}

export function resolveSseEventType(event: string, data: string): string {
  if (event && event !== "message") {
    return event;
  }

  try {
    const parsed = JSON.parse(data) as Record<string, unknown>;
    const type = parsed.type ?? parsed.eventType ?? parsed.event ?? parsed.Type;
    if (typeof type === "string" && type.trim()) {
      return type.trim();
    }
  } catch {
    // plain text payload
  }

  return event || data.trim();
}

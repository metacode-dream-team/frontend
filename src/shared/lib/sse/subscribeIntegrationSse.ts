import { NOTIFICATION_SSE_PATH } from "@/shared/config/constants";
import { buildApiUrl } from "@/shared/lib/api/apiUrl";
import { parseSseBuffer, resolveSseEventType } from "./parseSseChunk";

export interface IntegrationSseSubscription {
  close: () => void;
}

interface SubscribeIntegrationSseOptions {
  accessToken: string;
  signal?: AbortSignal;
  onEvent: (eventType: string, data: string) => void;
  onError?: (error: Error) => void;
}

export function subscribeIntegrationSse({
  accessToken,
  signal,
  onEvent,
  onError,
}: SubscribeIntegrationSseOptions): IntegrationSseSubscription {
  const controller = new AbortController();
  const abortFromParent = () => controller.abort();

  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", abortFromParent, { once: true });
    }
  }

  const url = buildApiUrl(NOTIFICATION_SSE_PATH);

  void (async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
          Authorization: `Bearer ${accessToken}`,
          Connection: "keep-alive",
        },
        credentials: "omit",
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Integration API ${response.status}: ${text.slice(0, 240)}`);
      }

      if (!response.body) {
        throw new Error("SSE response has no body.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const parsed = parseSseBuffer(buffer);
        buffer = parsed.remainder;

        for (const message of parsed.messages) {
          const eventType = resolveSseEventType(message.event, message.data);
          onEvent(eventType, message.data);
        }
      }
    } catch (err) {
      if (controller.signal.aborted) return;
      const error =
        err instanceof Error ? err : new Error("SSE connection failed.");
      onError?.(error);
    } finally {
      signal?.removeEventListener("abort", abortFromParent);
    }
  })();

  return {
    close: () => controller.abort(),
  };
}

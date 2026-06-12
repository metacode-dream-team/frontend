import { create } from "zustand";
import type { NotificationEvent } from "@/shared/lib/sse/notificationTypes";

export type NotificationEventHandler = (event: NotificationEvent) => void;

interface NotificationSseState {
  lastEvent: NotificationEvent | null;
  isConnected: boolean;
  listeners: Map<string, Set<NotificationEventHandler>>;
  setConnected: (connected: boolean) => void;
  pushEvent: (event: NotificationEvent) => void;
  subscribe: (eventType: string, handler: NotificationEventHandler) => () => void;
  /** Clears connection state without removing active listeners. */
  reset: () => void;
  clear: () => void;
}

export const useNotificationSseStore = create<NotificationSseState>((set, get) => ({
  lastEvent: null,
  isConnected: false,
  listeners: new Map(),

  setConnected: (connected) => set({ isConnected: connected }),

  pushEvent: (event) => {
    set({ lastEvent: event });
    const handlers = get().listeners.get(event.type);
    if (handlers) {
      for (const handler of handlers) {
        handler(event);
      }
    }
  },

  subscribe: (eventType, handler) => {
    const { listeners } = get();
    const next = new Map(listeners);
    const bucket = new Set(next.get(eventType) ?? []);
    bucket.add(handler);
    next.set(eventType, bucket);
    set({ listeners: next });

    return () => {
      const current = get().listeners;
      const updated = new Map(current);
      const existing = updated.get(eventType);
      if (!existing) return;
      existing.delete(handler);
      if (existing.size === 0) {
        updated.delete(eventType);
      } else {
        updated.set(eventType, existing);
      }
      set({ listeners: updated });
    };
  },

  reset: () =>
    set({
      lastEvent: null,
      isConnected: false,
    }),

  clear: () =>
    set({
      lastEvent: null,
      isConnected: false,
      listeners: new Map(),
    }),
}));

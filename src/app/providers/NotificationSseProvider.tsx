"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/entities/auth";
import { useNotificationSseStore } from "@/entities/notification";
import { parseNotificationEvent } from "@/shared/lib/sse/notificationTypes";
import {
  subscribeIntegrationSse,
  type IntegrationSseSubscription,
} from "@/shared/lib/sse/subscribeIntegrationSse";

export function NotificationSseProvider({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const pushEvent = useNotificationSseStore((s) => s.pushEvent);
  const setConnected = useNotificationSseStore((s) => s.setConnected);
  const reset = useNotificationSseStore((s) => s.reset);
  const subscriptionRef = useRef<IntegrationSseSubscription | null>(null);

  useEffect(() => {
    if (!isInitialized || !isAuthenticated || !accessToken) {
      subscriptionRef.current?.close();
      subscriptionRef.current = null;
      setConnected(false);
      return;
    }

    subscriptionRef.current?.close();
    setConnected(true);

    subscriptionRef.current = subscribeIntegrationSse({
      accessToken,
      onEvent: (_eventType, data) => {
        const notification = parseNotificationEvent(data);
        if (notification) {
          pushEvent(notification);
        }
      },
      onError: () => {
        setConnected(false);
      },
    });

    return () => {
      subscriptionRef.current?.close();
      subscriptionRef.current = null;
      setConnected(false);
    };
  }, [isInitialized, isAuthenticated, accessToken, pushEvent, setConnected]);

  useEffect(() => {
    if (!isAuthenticated) {
      reset();
    }
  }, [isAuthenticated, reset]);

  return <>{children}</>;
}

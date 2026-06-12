"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import {
  LEETCODE_BIND_TIMEOUT_MS,
  LEETCODE_LINKED_EVENT,
} from "@/shared/config/constants";
import { subscribeIntegrationSse } from "@/shared/lib/sse/subscribeIntegrationSse";
import { bindLeetcode } from "../api/bindLeetcode";
import { validateLeetcodeUsername } from "../lib/validateLeetcodeUsername";

export type LeetcodeBindStep =
  | "idle"
  | "submitting"
  | "waiting"
  | "success"
  | "error";

function formatBindError(err: unknown): string {
  if (!(err instanceof Error)) {
    return "Failed to link LeetCode. Please try again.";
  }
  const message = err.message;
  if (message.includes("401")) {
    return "Session expired. Please sign in again.";
  }
  if (message.includes("409")) {
    return "This LeetCode account is already linked.";
  }
  if (message.includes("400")) {
    return "Invalid LeetCode username. Check and try again.";
  }
  return message.replace(/^Integration API \d+: /, "") || message;
}

export function useLeetcodeBindFlow(options?: { onSuccess?: () => void }) {
  const onSuccess = options?.onSuccess;
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useProfileMeStore((s) => s.fetchMe);

  const [step, setStep] = useState<LeetcodeBindStep>("idle");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [remainingMs, setRemainingMs] = useState(LEETCODE_BIND_TIMEOUT_MS);

  const sseRef = useRef<ReturnType<typeof subscribeIntegrationSse> | null>(null);
  const deadlineRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const cleanupWaiting = useCallback(() => {
    sseRef.current?.close();
    sseRef.current = null;
    deadlineRef.current = null;
  }, []);

  const reset = useCallback(() => {
    completedRef.current = false;
    cleanupWaiting();
    setStep("idle");
    setUsername("");
    setError(null);
    setRemainingMs(LEETCODE_BIND_TIMEOUT_MS);
  }, [cleanupWaiting]);

  const cancel = useCallback(() => {
    completedRef.current = true;
    cleanupWaiting();
    setStep("idle");
    setError(null);
    setRemainingMs(LEETCODE_BIND_TIMEOUT_MS);
  }, [cleanupWaiting]);

  const completeSuccess = useCallback(async () => {
    if (completedRef.current) return;
    completedRef.current = true;
    cleanupWaiting();

    if (accessToken) {
      await fetchMe(accessToken);
    }

    setStep("success");
    setError(null);
    onSuccess?.();
  }, [accessToken, cleanupWaiting, fetchMe, onSuccess]);

  const startWaiting = useCallback(
    (boundUsername: string) => {
      if (!accessToken) return;

      setUsername(boundUsername);
      setStep("waiting");
      setError(null);
      setRemainingMs(LEETCODE_BIND_TIMEOUT_MS);
      completedRef.current = false;
      deadlineRef.current = Date.now() + LEETCODE_BIND_TIMEOUT_MS;

      sseRef.current = subscribeIntegrationSse({
        accessToken,
        onEvent: (eventType) => {
          if (eventType === LEETCODE_LINKED_EVENT) {
            void completeSuccess();
          }
        },
        onError: (err) => {
          if (completedRef.current) return;
          completedRef.current = true;
          cleanupWaiting();
          setStep("error");
          setError(formatBindError(err));
        },
      });
    },
    [accessToken, cleanupWaiting, completeSuccess],
  );

  const submit = useCallback(
    async (rawUsername: string): Promise<boolean> => {
      const validationError = validateLeetcodeUsername(rawUsername);
      if (validationError) {
        setError(validationError);
        setStep("error");
        return false;
      }

      if (!accessToken) {
        setError("You must be signed in to link LeetCode.");
        setStep("error");
        return false;
      }

      const boundUsername = rawUsername.trim();
      setUsername(boundUsername);
      setError(null);
      setStep("submitting");

      try {
        await bindLeetcode(accessToken, boundUsername);
        startWaiting(boundUsername);
        return true;
      } catch (err) {
        setStep("error");
        setError(formatBindError(err));
        return false;
      }
    },
    [accessToken, startWaiting],
  );

  useEffect(() => {
    if (step !== "waiting" || !deadlineRef.current) return;

    const tick = () => {
      const deadline = deadlineRef.current;
      if (!deadline || completedRef.current) return;

      const nextRemaining = Math.max(0, deadline - Date.now());
      setRemainingMs(nextRemaining);

      if (nextRemaining <= 0) {
        completedRef.current = true;
        cleanupWaiting();
        setStep("error");
        setError("Link timed out after 5 minutes. Try again.");
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [step, cleanupWaiting]);

  useEffect(() => {
    return () => {
      completedRef.current = true;
      cleanupWaiting();
    };
  }, [cleanupWaiting]);

  return {
    step,
    username,
    error,
    remainingMs,
    submit,
    reset,
    cancel,
  };
}

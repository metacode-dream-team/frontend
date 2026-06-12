"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import { useNotificationSseStore } from "@/entities/notification";

export type VerificationBindStep =
  | "idle"
  | "submitting"
  | "verify"
  | "success"
  | "error";

export interface VerificationBindFlowConfig {
  platformName: string;
  timeoutMs: number;
  successEventTypes: readonly string[];
  validateUsername: (raw: string) => string | null;
  bind: (accessToken: string, username: string) => Promise<{ token: string }>;
}

function formatBindError(err: unknown, platformName: string): string {
  if (!(err instanceof Error)) {
    return `Failed to link ${platformName}. Please try again.`;
  }
  const message = err.message;
  if (message.includes("401")) {
    return "Session expired. Please sign in again.";
  }
  if (message.includes("409")) {
    return `This ${platformName} account is already linked.`;
  }
  if (message.includes("400")) {
    return `Invalid ${platformName} username. Check and try again.`;
  }
  return message.replace(/^Integration API \d+: /, "") || message;
}

function isSuccessEvent(
  eventType: string,
  successEventTypes: readonly string[],
): boolean {
  return successEventTypes.includes(eventType);
}

export function useVerificationBindFlow(
  config: VerificationBindFlowConfig,
  options?: { onSuccess?: () => void },
) {
  const { platformName, timeoutMs, successEventTypes, validateUsername, bind } =
    config;
  const onSuccess = options?.onSuccess;

  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useProfileMeStore((s) => s.fetchMe);
  const subscribe = useNotificationSseStore((s) => s.subscribe);

  const [step, setStep] = useState<VerificationBindStep>("idle");
  const [username, setUsername] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [remainingMs, setRemainingMs] = useState(timeoutMs);

  const deadlineRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const clearDeadline = useCallback(() => {
    deadlineRef.current = null;
  }, []);

  const reset = useCallback(() => {
    completedRef.current = false;
    clearDeadline();
    setStep("idle");
    setUsername("");
    setVerificationToken(null);
    setError(null);
    setRemainingMs(timeoutMs);
  }, [clearDeadline, timeoutMs]);

  const cancel = useCallback(() => {
    completedRef.current = true;
    clearDeadline();
    setStep("idle");
    setVerificationToken(null);
    setError(null);
    setRemainingMs(timeoutMs);
  }, [clearDeadline, timeoutMs]);

  const completeSuccess = useCallback(async () => {
    if (completedRef.current) return;
    completedRef.current = true;
    clearDeadline();

    if (accessToken) {
      await fetchMe(accessToken);
    }

    setStep("success");
    setError(null);
    onSuccess?.();
  }, [accessToken, clearDeadline, fetchMe, onSuccess]);

  const startVerify = useCallback(
    (boundUsername: string, token: string) => {
      setUsername(boundUsername);
      setVerificationToken(token);
      setStep("verify");
      setError(null);
      setRemainingMs(timeoutMs);
      completedRef.current = false;
      deadlineRef.current = Date.now() + timeoutMs;
    },
    [timeoutMs],
  );

  const submit = useCallback(
    async (rawUsername: string): Promise<boolean> => {
      const validationError = validateUsername(rawUsername);
      if (validationError) {
        setError(validationError);
        setStep("error");
        return false;
      }

      if (!accessToken) {
        setError(`You must be signed in to link ${platformName}.`);
        setStep("error");
        return false;
      }

      const boundUsername = rawUsername.trim();
      setUsername(boundUsername);
      setError(null);
      setStep("submitting");

      try {
        const { token } = await bind(accessToken, boundUsername);
        startVerify(boundUsername, token);
        return true;
      } catch (err) {
        setStep("error");
        setError(formatBindError(err, platformName));
        return false;
      }
    },
    [accessToken, bind, platformName, startVerify, validateUsername],
  );

  useEffect(() => {
    if (step !== "verify") return;

    const verifyStartedAt = deadlineRef.current
      ? deadlineRef.current - timeoutMs
      : Date.now();
    const lastEvent = useNotificationSseStore.getState().lastEvent;
    if (lastEvent && isSuccessEvent(lastEvent.type, successEventTypes)) {
      const eventAt = Date.parse(lastEvent.created_at);
      if (Number.isFinite(eventAt) && eventAt >= verifyStartedAt) {
        void completeSuccess();
        return;
      }
    }

    const unsubs = successEventTypes.map((eventType) =>
      subscribe(eventType, () => {
        void completeSuccess();
      }),
    );

    return () => {
      for (const unsub of unsubs) {
        unsub();
      }
    };
  }, [step, subscribe, completeSuccess, successEventTypes, timeoutMs]);

  useEffect(() => {
    if (step !== "verify" || !deadlineRef.current) return;

    const tick = () => {
      const deadline = deadlineRef.current;
      if (!deadline || completedRef.current) return;

      const nextRemaining = Math.max(0, deadline - Date.now());
      setRemainingMs(nextRemaining);

      if (nextRemaining <= 0) {
        completedRef.current = true;
        clearDeadline();
        setStep("error");
        setError("Verification timed out after 5 minutes. Try again.");
      }
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [step, clearDeadline]);

  useEffect(() => {
    return () => {
      completedRef.current = true;
      clearDeadline();
    };
  }, [clearDeadline]);

  return {
    step,
    username,
    verificationToken,
    error,
    remainingMs,
    submit,
    reset,
    cancel,
  };
}

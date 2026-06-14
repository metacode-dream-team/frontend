"use client";

import { useCallback, useState } from "react";

import { useAuthStore } from "@/entities/auth";

import { startGithubIntegration } from "../api/startGithubIntegration";

function formatGithubConnectError(err: unknown): string {
  if (!(err instanceof Error)) {
    return "Failed to connect GitHub. Please try again.";
  }

  const message = err.message;
  if (message.includes("401")) {
    return "Session expired. Please sign in again.";
  }

  return message.replace(/^Integration API \d+: /, "") || message;
}

export function useGithubConnect() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = useCallback(async (): Promise<boolean> => {
    if (!accessToken) {
      setError("You must be signed in to connect GitHub.");
      return false;
    }

    setIsConnecting(true);
    setError(null);

    try {
      await startGithubIntegration(accessToken);
      return true;
    } catch (err) {
      setError(formatGithubConnectError(err));
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [accessToken]);

  const clearError = useCallback(() => setError(null), []);

  return { connect, isConnecting, error, clearError };
}

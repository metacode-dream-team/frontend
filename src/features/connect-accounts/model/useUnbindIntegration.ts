"use client";

import { useCallback, useState } from "react";

import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import {
  unbindGithubIntegration,
  unbindLeetcodeIntegration,
  unbindMonkeytypeIntegration,
} from "@/shared/lib/api/platformData";

import type { LinkedAccount } from "../lib/linkedAccounts";

type UnbindProvider = LinkedAccount["provider"];

const UNBIND_BY_PROVIDER = {
  github: unbindGithubIntegration,
  leetcode: unbindLeetcodeIntegration,
  monkeytype: unbindMonkeytypeIntegration,
} as const;

const PLATFORM_LABELS: Record<UnbindProvider, string> = {
  github: "GitHub",
  leetcode: "LeetCode",
  monkeytype: "Monkeytype",
};

function formatUnbindError(err: unknown, platformName: string): string {
  if (!(err instanceof Error)) {
    return `Failed to disconnect ${platformName}. Please try again.`;
  }

  const message = err.message;
  if (message.includes("401")) {
    return "Session expired. Please sign in again.";
  }
  if (message.includes("404")) {
    return `${platformName} is not connected.`;
  }

  return message.replace(/^Integration API \d+: /, "") || message;
}

export function useUnbindIntegration() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const fetchMe = useProfileMeStore((s) => s.fetchMe);
  const [unbinding, setUnbinding] = useState<UnbindProvider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const unbind = useCallback(
    async (provider: UnbindProvider): Promise<boolean> => {
      if (!accessToken) {
        setError("You must be signed in to disconnect integrations.");
        return false;
      }

      setUnbinding(provider);
      setError(null);

      try {
        await UNBIND_BY_PROVIDER[provider](accessToken);
        await fetchMe(accessToken);
        return true;
      } catch (err) {
        setError(formatUnbindError(err, PLATFORM_LABELS[provider]));
        return false;
      } finally {
        setUnbinding(null);
      }
    },
    [accessToken, fetchMe],
  );

  const clearError = useCallback(() => setError(null), []);

  return { unbind, unbinding, error, clearError };
}

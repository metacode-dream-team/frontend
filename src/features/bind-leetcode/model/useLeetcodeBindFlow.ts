"use client";

import {
  LEETCODE_BIND_TIMEOUT_MS,
  LEETCODE_LINKED_EVENT,
  LEETCODE_VERIFICATION_SUCCEEDED_EVENT,
} from "@/shared/config/constants";
import {
  useVerificationBindFlow,
  type VerificationBindStep,
} from "@/shared/lib/integration/useVerificationBindFlow";
import { bindLeetcode } from "../api/bindLeetcode";
import { validateLeetcodeUsername } from "../lib/validateLeetcodeUsername";

export type LeetcodeBindStep = VerificationBindStep;

const LEETCODE_BIND_CONFIG = {
  platformName: "LeetCode",
  timeoutMs: LEETCODE_BIND_TIMEOUT_MS,
  successEventTypes: [
    LEETCODE_VERIFICATION_SUCCEEDED_EVENT,
    LEETCODE_LINKED_EVENT,
  ] as const,
  validateUsername: validateLeetcodeUsername,
  bind: bindLeetcode,
};

export function useLeetcodeBindFlow(options?: { onSuccess?: () => void }) {
  return useVerificationBindFlow(LEETCODE_BIND_CONFIG, options);
}

"use client";

import {
  MONKEYTYPE_BIND_TIMEOUT_MS,
  MONKEYTYPE_VERIFICATION_SUCCEEDED_EVENT,
} from "@/shared/config/constants";
import {
  useVerificationBindFlow,
  type VerificationBindStep,
} from "@/shared/lib/integration/useVerificationBindFlow";
import { bindMonkeytype } from "../api/bindMonkeytype";
import { validateMonkeytypeUsername } from "../lib/validateMonkeytypeUsername";

export type MonkeytypeBindStep = VerificationBindStep;

const MONKEYTYPE_BIND_CONFIG = {
  platformName: "Monkeytype",
  timeoutMs: MONKEYTYPE_BIND_TIMEOUT_MS,
  successEventTypes: [MONKEYTYPE_VERIFICATION_SUCCEEDED_EVENT] as const,
  validateUsername: validateMonkeytypeUsername,
  bind: bindMonkeytype,
};

export function useMonkeytypeBindFlow(options?: { onSuccess?: () => void }) {
  return useVerificationBindFlow(MONKEYTYPE_BIND_CONFIG, options);
}

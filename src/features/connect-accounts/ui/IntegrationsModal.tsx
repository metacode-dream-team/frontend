"use client";

import { useEffect, useId, useMemo, useState } from "react";

import { useProfileMeStore } from "@/entities/profile";
import { LeetcodeBindModal } from "@/features/bind-leetcode";
import { MonkeytypeBindModal } from "@/features/bind-monkeytype";
import { useBodyScrollLock } from "@/shared/lib/hooks/useBodyScrollLock";
import { startAuthServiceOAuth } from "@/shared/lib/auth";
import type { KeycloakIdpHint } from "@/shared/lib/keycloak/keycloak";
import { cn } from "@/shared/lib/utils/cn";

import { resolveLinkedAccounts, type LinkedAccount } from "../lib/linkedAccounts";
import { useUnbindIntegration } from "../model/useUnbindIntegration";
import { LeetcodeBrandIcon } from "./LeetcodeBrandIcon";

type ConnectProvider = Extract<KeycloakIdpHint, "github" | "monkeytype" | "leetcode">;

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LeetcodeIcon({ className }: { className?: string }) {
  return <LeetcodeBrandIcon className={className} size={16} />;
}

function MonkeytypeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h.01M12 14h.01M16 14h.01" />
    </svg>
  );
}

function PlatformIcon({ provider }: { provider: LinkedAccount["provider"] }) {
  const cls = "h-4 w-4 text-zinc-300";
  if (provider === "github") return <GithubIcon className={cls} />;
  if (provider === "leetcode") return <LeetcodeIcon className={cls} />;
  return <MonkeytypeIcon className={cls} />;
}

function IntegrationRow({
  acc,
  loading,
  unbinding,
  onConnect,
  onDisconnect,
}: {
  acc: LinkedAccount;
  loading: ConnectProvider | null;
  unbinding: ConnectProvider | null;
  onConnect: (provider: ConnectProvider) => void;
  onDisconnect: (provider: ConnectProvider) => void;
}) {
  const isConnecting = loading === acc.provider;
  const isDisconnecting = unbinding === acc.provider;
  const isBusy = loading !== null || unbinding !== null;
  const statusText =
    acc.connected && acc.username
      ? `@${acc.username}`
      : acc.connected
        ? "Connected"
        : "Not connected";

  return (
    <li className="group flex items-center gap-3 rounded-xl px-1.5 py-3.5 transition-colors hover:bg-white/[0.02] sm:py-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-900 ring-1 ring-zinc-800/80">
        <PlatformIcon provider={acc.provider} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-zinc-100 sm:text-base">{acc.label}</p>
        <p
          className={cn(
            "mt-0.5 truncate text-xs sm:text-sm",
            acc.connected ? "text-zinc-500" : "text-zinc-600",
          )}
        >
          {statusText}
        </p>
      </div>

      {acc.connected ? (
        <button
          type="button"
          disabled={isBusy}
          onClick={() => onDisconnect(acc.provider)}
          className="shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-medium text-zinc-400 ring-1 ring-zinc-800 transition-colors hover:bg-zinc-900 hover:text-rose-300 hover:ring-rose-900/60 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:py-2 sm:text-sm"
        >
          {isDisconnecting ? "…" : "Disconnect"}
        </button>
      ) : (
        <button
          type="button"
          disabled={isBusy}
          onClick={() => onConnect(acc.provider)}
          className="shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-medium text-zinc-300 ring-1 ring-zinc-800 transition-colors hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:py-2 sm:text-sm"
        >
          {isConnecting ? "…" : "Connect"}
        </button>
      )}
    </li>
  );
}

export function IntegrationsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const titleId = useId();
  const profile = useProfileMeStore((s) => s.profile);
  const [loading, setLoading] = useState<ConnectProvider | null>(null);
  const [leetcodeBindOpen, setLeetcodeBindOpen] = useState(false);
  const [monkeytypeBindOpen, setMonkeytypeBindOpen] = useState(false);
  const { unbind, unbinding, error: unbindError, clearError } = useUnbindIntegration();

  const linkedAccounts = useMemo(
    () => resolveLinkedAccounts(profile?.externalProfileLinks),
    [profile?.externalProfileLinks],
  );

  const connectedCount = linkedAccounts.filter((a) => a.connected).length;

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) {
      setLoading(null);
      setLeetcodeBindOpen(false);
      setMonkeytypeBindOpen(false);
      clearError();
    }
  }, [open, clearError]);

  if (!open) return null;

  const connect = (provider: ConnectProvider) => {
    if (provider === "leetcode") {
      setLeetcodeBindOpen(true);
      return;
    }

    if (provider === "monkeytype") {
      setMonkeytypeBindOpen(true);
      return;
    }

    setLoading(provider);
    const ok = startAuthServiceOAuth("github");
    if (!ok) setLoading(null);
  };

  const disconnect = (provider: ConnectProvider) => {
    void unbind(provider);
  };

  return (
    <>
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-label="Close"
        onClick={() => onOpenChange(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[101] w-full max-w-md overflow-hidden rounded-t-2xl border border-zinc-800/70 bg-[#0a0a0b] shadow-2xl sm:max-w-lg sm:rounded-2xl"
      >
        <div className="flex items-start justify-between gap-4 px-5 pb-1 pt-5 sm:px-6 sm:pt-6">
          <div>
            <h2 id={titleId} className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              Integrations
            </h2>
            <p className="mt-1.5 text-sm text-zinc-500">
              {connectedCount > 0
                ? `${connectedCount} of ${linkedAccounts.length} connected`
                : "Connect platforms to sync your stats"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="-mr-1 rounded-lg p-1.5 text-zinc-600 transition-colors hover:bg-zinc-900 hover:text-zinc-300"
            aria-label="Close dialog"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {unbindError ? (
          <p className="px-5 pb-2 text-sm text-rose-400 sm:px-6" role="alert">
            {unbindError}
          </p>
        ) : null}

        <ul className="divide-y divide-zinc-800/50 px-5 pb-5 sm:px-6 sm:pb-6">
          {linkedAccounts.map((acc) => (
            <IntegrationRow
              key={acc.provider}
              acc={acc}
              loading={loading}
              unbinding={unbinding}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          ))}
        </ul>
      </div>
    </div>

    <LeetcodeBindModal
      open={leetcodeBindOpen}
      onOpenChange={setLeetcodeBindOpen}
    />

    <MonkeytypeBindModal
      open={monkeytypeBindOpen}
      onOpenChange={setMonkeytypeBindOpen}
    />
    </>
  );
}

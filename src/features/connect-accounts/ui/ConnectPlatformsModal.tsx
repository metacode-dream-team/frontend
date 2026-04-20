"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import leetcodeImg from "@/assets/Leetcode--Streamline-Simple-Icons (2).png";
import { startAuthServiceOAuth } from "@/shared/lib/auth";
import type { KeycloakIdpHint } from "@/shared/lib/keycloak/keycloak";
import { startKeycloakIdpLogin } from "@/shared/lib/keycloak/keycloak";
import { Button } from "@/shared/ui/Button";

type ConnectProvider = Extract<
  KeycloakIdpHint,
  "google" | "github" | "monkeytype" | "leetcode"
>;

const PROVIDERS: {
  id: ConnectProvider;
  label: string;
}[] = [
  { id: "google", label: "Google" },
  { id: "github", label: "GitHub" },
  { id: "monkeytype", label: "Monkeytype" },
  { id: "leetcode", label: "LeetCode" },
];

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function KeyboardIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10" />
    </svg>
  );
}

function ProviderIcon({ id }: { id: ConnectProvider }) {
  if (id === "google") {
    return <GoogleIcon className="h-5 w-5 shrink-0" />;
  }
  if (id === "github") {
    return <GithubIcon className="h-5 w-5 shrink-0 text-white" />;
  }
  if (id === "monkeytype") {
    return <KeyboardIcon className="h-5 w-5 shrink-0 text-[#c4a3f7]" />;
  }
  return (
    <Image
      src={leetcodeImg}
      alt=""
      width={20}
      height={20}
      className="h-5 w-5 shrink-0 object-contain"
    />
  );
}

export function ConnectPlatformsModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const titleId = useId();
  const [loading, setLoading] = useState<ConnectProvider | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) {
      setLoading(null);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const connect = async (provider: ConnectProvider) => {
    setLoading(provider);
    if (provider === "google" || provider === "github") {
      const ok = startAuthServiceOAuth(provider);
      if (!ok) setLoading(null);
      return;
    }
    const ok = await startKeycloakIdpLogin(provider);
    if (!ok) {
      setLoading(null);
    }
  };

  const btnClass =
    "w-full justify-start gap-3 border-zinc-700/90 bg-[#121214] py-3 pl-4 text-left text-sm font-medium text-white hover:bg-zinc-800/90 hover:text-white focus:ring-[#a855f7]/40";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={() => onOpenChange(false)}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[101] w-full max-w-md rounded-2xl border border-zinc-800/90 bg-[#161618] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.65)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4a3f7]">
              MetaCode
            </p>
            <h2
              id={titleId}
              className="mt-1 text-xl font-bold tracking-tight text-white"
            >
              Connect your accounts
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500">
              Sign in with Google or link GitHub, Monkeytype, and LeetCode for
              your profile and leaderboard.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white"
            aria-label="Close dialog"
          >
            <svg
              className="h-5 w-5"
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

        <div className="mt-6 grid grid-cols-2 gap-3">
          {PROVIDERS.map((p) => (
            <Button
              key={p.id}
              type="button"
              variant="outline"
              disabled={loading !== null}
              isLoading={loading === p.id}
              className={btnClass}
              onClick={() => void connect(p.id)}
            >
              <ProviderIcon id={p.id} />
              {p.label}
            </Button>
          ))}
        </div>

        <p className="mt-6 border-t border-zinc-800/80 pt-5 text-center text-xs text-zinc-500">
          Prefer email?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#c4a3f7] hover:text-[#dcc4ff]"
            onClick={() => onOpenChange(false)}
          >
            Sign in
          </Link>{" "}
          ·{" "}
          <Link
            href="/register"
            className="font-semibold text-[#c4a3f7] hover:text-[#dcc4ff]"
            onClick={() => onOpenChange(false)}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

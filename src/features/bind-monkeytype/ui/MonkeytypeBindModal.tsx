"use client";

import { useEffect, useId, useState } from "react";
import { useBodyScrollLock } from "@/shared/lib/hooks/useBodyScrollLock";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";
import { useMonkeytypeBindFlow } from "../model/useMonkeytypeBindFlow";

function formatRemaining(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

interface MonkeytypeBindModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MonkeytypeBindModal({ open, onOpenChange }: MonkeytypeBindModalProps) {
  const titleId = useId();
  const [inputValue, setInputValue] = useState("");
  const [copied, setCopied] = useState(false);
  const { step, username, verificationToken, error, remainingMs, submit, reset, cancel } =
    useMonkeytypeBindFlow({
      onSuccess: () => {
        window.setTimeout(() => onOpenChange(false), 1500);
      },
    });

  const isBusy = step === "submitting" || step === "verify";

  useBodyScrollLock(open);

  useEffect(() => {
    if (!open) {
      reset();
      setInputValue("");
      setCopied(false);
    }
  }, [open, reset]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isBusy) {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange, isBusy]);

  if (!open) {
    return null;
  }

  const handleClose = () => {
    if (isBusy) {
      cancel();
    }
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit(inputValue);
  };

  const handleCopyToken = async () => {
    if (!verificationToken) return;
    try {
      await navigator.clipboard.writeText(verificationToken);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"
        aria-label="Close"
        disabled={step === "submitting"}
        onClick={handleClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-[111] w-full max-w-[480px] rounded-2xl border border-zinc-800/90 bg-[#161618] p-6 shadow-[0_24px_64px_rgba(0,0,0,0.65)]"
      >
        <div className="mb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c4a3f7]">
            Integration
          </p>
          <h2 id={titleId} className="mt-1 text-xl font-bold tracking-tight text-white">
            Link Monkeytype
          </h2>
          {step === "verify" ? (
            <p className="mt-2 text-sm text-zinc-400">
              Paste the verification token into your Monkeytype bio for{" "}
              <span className="font-medium text-zinc-200">@{username}</span>. We will
              detect the link automatically.
            </p>
          ) : step === "success" ? (
            <p className="mt-2 text-sm text-emerald-300/90">
              Monkeytype account linked successfully.
            </p>
          ) : (
            <p className="mt-2 text-sm text-zinc-400">
              Enter your public Monkeytype username to start linking your account.
            </p>
          )}
        </div>

        {step === "verify" ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Verification token
              </p>
              <p className="mt-2 break-all font-mono text-sm text-violet-200">
                {verificationToken}
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800/80"
                onClick={() => void handleCopyToken()}
              >
                {copied ? "Copied" : "Copy token"}
              </Button>
            </div>

            <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-400">
              <li>
                Open{" "}
                <a
                  href="https://monkeytype.com/account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 underline-offset-2 hover:underline"
                >
                  Monkeytype Account
                </a>
              </li>
              <li>
                Click <span className="text-zinc-200">Edit profile</span> and paste the token
                into the <span className="text-zinc-200">Bio</span> field
              </li>
              <li>Save your profile — verification completes automatically</li>
            </ol>

            <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-5 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Time remaining
              </p>
              <p className="mt-2 text-4xl font-bold tabular-nums text-white">
                {formatRemaining(remainingMs)}
              </p>
            </div>

            {error ? (
              <div
                role="alert"
                className="rounded-lg border border-red-500/35 bg-red-950/35 px-4 py-3 text-sm text-red-100"
              >
                {error}
              </div>
            ) : null}

            <Button
              type="button"
              variant="outline"
              className="w-full border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800/80"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </div>
        ) : step === "success" ? (
          <Button
            type="button"
            variant="accent"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Done
          </Button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error ? (
              <div
                role="alert"
                className="rounded-lg border border-red-500/35 bg-red-950/35 px-4 py-3 text-sm text-red-100"
              >
                {error}
              </div>
            ) : null}

            <Input
              label="Monkeytype username"
              variant="auth"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="sayan_soul"
              autoComplete="off"
              required
              disabled={step === "submitting"}
            />

            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                className="flex-1 border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800/80"
                disabled={step === "submitting"}
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="accent"
                className="flex-1"
                isLoading={step === "submitting"}
                disabled={step === "submitting"}
              >
                Link account
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

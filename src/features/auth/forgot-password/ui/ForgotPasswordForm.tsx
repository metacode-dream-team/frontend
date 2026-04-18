/**
 * Форма запроса на восстановление пароля
 */

"use client";

import Link from "next/link";
import { useState } from "react";
import { useForgotPassword } from "../model/useForgotPassword";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

function MailIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-[#c4a3f7]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const { forgotPassword, isLoading, error, success } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void forgotPassword(email.trim());
  };

  if (success) {
    return (
      <div className="w-full">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Check your inbox
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            If an account exists for that email, we sent a password reset link.
          </p>
        </header>
        <div
          role="status"
          className="rounded-lg border border-emerald-500/35 bg-emerald-950/35 px-4 py-3 text-sm text-emerald-100"
        >
          Open the email and follow the link to choose a new password. The link
          may expire after a short time.
        </div>
        <p className="mt-8 text-center text-sm text-zinc-400">
          <Link
            href="/login"
            className="font-semibold text-[#c4a3f7] transition-colors hover:text-[#dcc4ff]"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Forgot password?
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2.5 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        <Input
          type="email"
          label="Email Address"
          variant="auth"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
          disabled={isLoading}
          startSlot={<MailIcon />}
        />

        <Button
          type="submit"
          variant="accent"
          size="lg"
          className="mt-2 w-full gap-2 rounded-lg py-3 text-base font-semibold"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Send reset link
          <span aria-hidden className="text-lg font-bold">
            →
          </span>
        </Button>
      </form>

      <div className="mt-6 flex gap-3 rounded-lg border border-zinc-800/80 bg-[#121214]/40 p-3 text-xs leading-relaxed text-zinc-400">
        <InfoIcon />
        <p>
          For your security, we won&apos;t tell you whether an email is
          registered. You&apos;ll only get a message if an account exists.
        </p>
      </div>
    </div>
  );
}

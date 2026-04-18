/**
 * Форма регистрации
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRegister } from "../model/useRegister";
import { SocialLoginButtons } from "@/features/auth/social-login";
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

function ShieldIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
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

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, isLoading, error, success } = useRegister();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void register(email.trim(), password, confirmPassword);
  };

  if (success) {
    return (
      <div className="w-full">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Check your inbox
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            We sent a verification link to your email.
          </p>
        </header>
        <div
          role="status"
          className="rounded-lg border border-emerald-500/35 bg-emerald-950/35 px-4 py-3 text-sm text-emerald-100"
        >
          Registration successful! Please verify your account using the link in
          the email.
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
          Join MetaCode
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Start your journey with our secure authentication platform.
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
          placeholder="jane@example.com"
          autoComplete="email"
          required
          disabled={isLoading}
          startSlot={<MailIcon />}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            type={showPassword ? "text" : "password"}
            label="Password"
            variant="auth"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            disabled={isLoading}
            startSlot={<ShieldIcon />}
            endSlot={
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="rounded p-1.5 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            }
          />

          <Input
            type={showPassword ? "text" : "password"}
            label="Confirm Password"
            variant="auth"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            disabled={isLoading}
            startSlot={<ShieldIcon />}
          />
        </div>

        <label className="flex cursor-pointer gap-3 rounded-lg border border-zinc-800/80 bg-[#121214]/50 p-3 select-none">
          <input
            type="checkbox"
            checked={newsletter}
            onChange={(e) => setNewsletter(e.target.checked)}
            className="mt-0.5 size-4 shrink-0 rounded border-zinc-600 bg-[#121214] text-[#a855f7] focus:ring-[#a855f7]/40 focus:ring-offset-0"
          />
          <span>
            <span className="block text-sm font-medium text-white">
              Subscribe to our newsletter
            </span>
            <span className="mt-0.5 block text-xs leading-relaxed text-zinc-500">
              Get updates about new features and security releases.
            </span>
          </span>
        </label>

        <Button
          type="submit"
          variant="accent"
          size="lg"
          className="w-full rounded-lg py-3 text-base font-semibold"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Create Account
        </Button>
      </form>

      <SocialLoginButtons mode="register" />

      <p className="mt-8 text-center text-sm text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#c4a3f7] transition-colors hover:text-[#dcc4ff]"
        >
          Sign in instead
        </Link>
      </p>

      <div className="mt-6 flex gap-3 rounded-lg border border-zinc-800/80 bg-[#121214]/40 p-3 text-xs leading-relaxed text-zinc-400">
        <InfoIcon />
        <p>
          By clicking Create Account, you agree to our Terms of Service and
          Privacy Policy. We take your security seriously with end-to-end
          encryption.
        </p>
      </div>
    </div>
  );
}

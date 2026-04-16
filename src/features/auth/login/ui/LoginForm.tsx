/**
 * Форма входа
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useLogin } from "../model/useLogin";
import { Button } from "@/shared/ui/Button";
import { Input } from "@/shared/ui/Input";

function UserIcon() {
  return (
    <svg
      className="h-[18px] w-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void login(identifier.trim(), password);
  };

  const linkClass =
    "text-sm font-medium text-[#c4a3f7] transition-colors hover:text-[#dcc4ff]";

  return (
    <div className="w-full">
      <header className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Welcome back
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Enter your credentials to access your secure portal.
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
          type="text"
          label="Email or Username"
          variant="auth"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="you@example.com or meta_dev"
          required
          disabled={isLoading}
          startSlot={<UserIcon />}
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between gap-2">
            <label className="text-xs font-semibold tracking-wide text-white">
              Password
            </label>
            <Link href="/forgot-password" className={linkClass}>
              Forgot password?
            </Link>
          </div>
          <Input
            type={showPassword ? "text" : "password"}
            label={undefined}
            variant="auth"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isLoading}
            className="mt-0"
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
        </div>

        <label className="flex cursor-pointer items-center gap-2.5 select-none">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="size-4 shrink-0 rounded border-zinc-600 bg-[#121214] text-[#a855f7] focus:ring-[#a855f7]/40 focus:ring-offset-0"
          />
          <span className="text-sm text-zinc-300">Remember me for 30 days</span>
        </label>

        <Button
          type="submit"
          variant="accent"
          size="lg"
          className="mt-2 w-full gap-2 rounded-lg py-3 text-base font-semibold"
          isLoading={isLoading}
          disabled={isLoading}
        >
          Sign In
          <span aria-hidden className="text-lg font-bold">
            →
          </span>
        </Button>
      </form>
    </div>
  );
}

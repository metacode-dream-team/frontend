"use client";

import Link from "next/link";
import { useAuthStore } from "@/entities/auth";
import { Button } from "@/shared/ui/Button";

export function Header() {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full bg-black">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="text-xl font-bold text-[#9900FF] transition-colors hover:text-[#b84dff]">
          MetaCode
        </Link>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-white transition-colors hover:text-white"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm font-medium text-white transition-colors hover:text-white"
              >
                Logout
              </button>
              <Link href="/dashboard">
                <Button
                  className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 border-0 text-white! px-5 py-2 text-sm font-medium rounded-lg shadow-[0_0_12px_rgba(168,85,247,0.5)] hover:shadow-[0_0_20px_rgba(168,85,247,0.7)] transition-shadow"
                  size="md"
                >
                  Open Dashboard
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-white transition-colors hover:text-white"
              >
                Login
              </Link>
              <Link href="/login">
                <Button
                  className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 border-0 text-white! px-5 py-2 text-sm font-medium rounded-lg shadow-[0_0_12px_rgba(168,85,247,0.5)] hover:shadow-[0_0_20px_rgba(168,85,247,0.7)] transition-shadow"
                  size="md"
                >
                  Connect Accounts
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
      <div className="h-px w-full bg-zinc-800" />
    </header>
  );
}

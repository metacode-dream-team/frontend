"use client";

import Link from "next/link";
import { useAuthStore } from "@/entities/auth";
import { Button } from "@/shared/ui/Button";

export default function Home() {
  const { isAuthenticated, logout, accessToken } = useAuthStore();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left w-full">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Welcome to Metacode
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            This is a Next.js application with Feature-Sliced Design
            architecture and authentication.
          </p>

          {isAuthenticated ? (
            <div className="space-y-4 mt-8">
              <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                <p className="font-semibold">You are authenticated!</p>
                <p className="text-sm mt-1">
                  Access token is stored in Zustand (memory)
                </p>
                <p className="text-sm">
                  Refresh token is stored in httpOnly cookie
                </p>
              </div>
              <Button variant="primary" onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-8 sm:flex-row">
              <Link href="/login">
                <Button variant="primary" size="lg">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="outline" size="lg">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

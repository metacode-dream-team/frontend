"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { ConnectPlatformsModal } from "@/features/connect-accounts";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils/cn";

const PRIMARY_LINKS = [
  { href: "/feed", label: "Features" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/roadmaps", label: "Roadmap" },
] as const;

function linkActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const { isAuthenticated, logout } = useAuthStore();
  const [connectOpen, setConnectOpen] = useState(false);
  const pathname = usePathname();

  const linkClass = (active: boolean) =>
    cn(
      "whitespace-nowrap text-sm font-medium transition-colors",
      active ? "text-white" : "text-zinc-400 hover:text-white",
    );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900/80 bg-black">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:h-16 sm:gap-4 sm:px-6">
          <Link
            href="/"
            className="shrink-0 text-lg font-bold tracking-tight text-[#9900FF] transition-colors hover:text-[#b84dff] sm:text-xl"
          >
            MetaCode
          </Link>

          <nav
            className="min-w-0 flex-1 overflow-x-auto py-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:py-0 [&::-webkit-scrollbar]:hidden"
            aria-label="Main"
          >
            <ul className="mx-auto flex w-max max-w-full items-center justify-center gap-1 sm:gap-6 md:gap-8">
              {PRIMARY_LINKS.map((item) => {
                const active = linkActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass(active)}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              <li>
                {isAuthenticated ? (
                  <Link
                    href="/dashboard#neural-links"
                    className={linkClass(
                      pathname === "/dashboard" ||
                        pathname.startsWith("/dashboard"),
                    )}
                  >
                    Integrations
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConnectOpen(true)}
                    className={linkClass(false)}
                  >
                    Integrations
                  </button>
                )}
              </li>
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className={cn(
                    "hidden text-sm font-medium transition-colors sm:inline",
                    pathname === "/dashboard" ||
                      pathname.startsWith("/dashboard/")
                      ? "text-white"
                      : "text-zinc-400 hover:text-white",
                  )}
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-900 text-xs font-bold text-white ring-2 ring-violet-500/40 transition hover:ring-violet-400/60"
                  title="Dashboard"
                >
                  ME
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                >
                  Login
                </Link>
                <Button
                  type="button"
                  className="rounded-lg border-0 bg-gradient-to-r from-purple-500 to-violet-500 px-3 py-2 text-xs font-medium text-white! shadow-[0_0_12px_rgba(168,85,247,0.45)] transition-shadow hover:from-purple-400 hover:to-violet-400 hover:shadow-[0_0_18px_rgba(168,85,247,0.65)] sm:px-4 sm:text-sm"
                  size="md"
                  onClick={() => setConnectOpen(true)}
                >
                  <span className="hidden sm:inline">Connect platforms</span>
                  <span className="sm:hidden">Connect</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {!isAuthenticated && (
        <ConnectPlatformsModal
          open={connectOpen}
          onOpenChange={setConnectOpen}
        />
      )}
    </>
  );
}

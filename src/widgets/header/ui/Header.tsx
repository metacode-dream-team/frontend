"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import { StreakBadge, streakFromActivity, useUserStreak } from "@/widgets/profile-streak";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils/cn";

const ConnectPlatformsModal = dynamic(
  () => import("@/features/connect-accounts").then((m) => ({ default: m.ConnectPlatformsModal })),
  { ssr: false },
);
const IntegrationsModal = dynamic(
  () => import("@/features/connect-accounts").then((m) => ({ default: m.IntegrationsModal })),
  { ssr: false },
);

const PRIMARY_LINKS = [
  { href: "/feed", label: "Features" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/roadmaps", label: "Roadmap" },
] as const;

/** Одинаковая высота Connect и меню на мобилке (< md) */
const MOBILE_HEADER_BTN =
  "max-md:min-h-9 px-3 py-2 text-xs sm:px-4 sm:text-sm";

function linkActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const { isAuthenticated, logout, accessToken } = useAuthStore();
  const me = useProfileMeStore((s) => s.profile);
  const meAvatarUrl = me?.avatarUrl?.trim() ?? "";
  const streak = useUserStreak(me?.userId, accessToken);
  const { count: streakCount, activeToday: streakActive } = streakFromActivity(streak);
  const [connectOpen, setConnectOpen] = useState(false);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (target && menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  const handleConnect = () => {
    setMenuOpen(false);
    setIntegrationsOpen(true);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    router.replace("/");
  };

  const linkClass = (active: boolean) =>
    cn(
      "whitespace-nowrap text-sm font-medium transition-colors",
      active ? "text-white" : "text-zinc-400 hover:text-white",
    );

  return (
    <>
      <header className="sticky top-0 z-50 w-full overflow-visible border-b border-zinc-900/80 bg-black">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 overflow-visible px-4 sm:h-16 sm:gap-4 sm:px-6">
          <Link
            href="/"
            className="focus-visible:ring-violet-500/60 flex shrink-0 items-center outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="MetaCode home"
          >
            <img
              src="/logo.svg"
              alt="MetaCode"
              className="h-9 w-auto sm:h-11"
              width={213}
              height={78}
            />
          </Link>

          <nav className="hidden min-w-0 flex-1 md:block" aria-label="Main">
            <ul className="mx-auto flex w-max max-w-full items-center justify-center gap-6 lg:gap-8">
              {PRIMARY_LINKS.map((item) => {
                const active = linkActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link href={item.href} className={cn(linkClass(active), "py-2")}>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3 md:ml-0">
            {isAuthenticated ? (
              <div ref={menuRef} className="relative flex items-center gap-2.5 overflow-visible">
                <StreakBadge count={streakCount} activeToday={streakActive} />
                <div className="relative overflow-visible">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-purple-900 text-[10px] font-bold text-white ring-2 ring-violet-500/40 transition hover:ring-violet-400/60 focus-visible:outline-none focus-visible:ring-violet-300"
                    title="Profile menu"
                    aria-label="Profile menu"
                    aria-expanded={menuOpen}
                    aria-haspopup="menu"
                  >
                    {meAvatarUrl ? (
                      <img
                        src={meAvatarUrl}
                        alt="Profile avatar"
                        className="h-full w-full rounded-full object-cover"
                        loading="eager"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      "ME"
                    )}
                  </button>
                  {menuOpen ? (
                    <div
                      role="menu"
                      className="absolute right-0 top-full z-[60] mt-1.5 min-w-[150px] overflow-visible rounded-xl border border-zinc-800 bg-zinc-950 p-1.5 shadow-xl"
                    >
                    <Link
                      href="/profile"
                      role="menuitem"
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                      Profile
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleConnect}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-200 transition-colors hover:bg-zinc-800 hover:text-white"
                    >
                      Connect
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleLogout}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-300 transition-colors hover:bg-zinc-800 hover:text-rose-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : null}
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden min-h-11 items-center px-2 text-sm font-medium text-zinc-300 transition-colors hover:text-white sm:inline-flex"
                >
                  Login
                </Link>
                <Button
                  type="button"
                  className={cn(
                    MOBILE_HEADER_BTN,
                    "rounded-lg border-0 bg-gradient-to-r from-purple-500 to-violet-500 font-medium text-white! shadow-[0_0_12px_rgba(168,85,247,0.45)] transition-shadow hover:from-purple-400 hover:to-violet-400 hover:shadow-[0_0_18px_rgba(168,85,247,0.65)]",
                  )}
                  size="md"
                  onClick={() => setConnectOpen(true)}
                >
                  <span className="hidden sm:inline">Connect platforms</span>
                  <span className="sm:hidden">Connect</span>
                </Button>
              </>
            )}

            <button
              type="button"
              onClick={() => setNavOpen((v) => !v)}
              className={cn(
                MOBILE_HEADER_BTN,
                "inline-flex shrink-0 items-center justify-center rounded-lg border border-zinc-800 text-zinc-300 transition-colors hover:border-zinc-700 hover:text-white md:hidden",
              )}
              aria-label={navOpen ? "Close menu" : "Open menu"}
              aria-expanded={navOpen}
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                {navOpen ? (
                  <path d="M18 6 6 18M6 6l12 12" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {navOpen ? (
          <nav
            className="border-t border-zinc-900/80 bg-black px-4 py-3 md:hidden"
            aria-label="Mobile"
          >
            <ul className="flex flex-col gap-1">
              {PRIMARY_LINKS.map((item) => {
                const active = linkActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setNavOpen(false)}
                      className={cn(
                        "flex min-h-11 items-center rounded-lg px-3 text-base font-medium transition-colors",
                        active
                          ? "bg-zinc-900 text-white"
                          : "text-zinc-300 hover:bg-zinc-900/60 hover:text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
              {!isAuthenticated ? (
                <li className="mt-2 border-t border-zinc-800/80 pt-2">
                  <Link
                    href="/login"
                    onClick={() => setNavOpen(false)}
                    className={cn(
                      "flex min-h-11 items-center rounded-lg px-3 text-base font-medium transition-colors",
                      linkActive(pathname, "/login")
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-300 hover:bg-zinc-900/60 hover:text-white",
                    )}
                  >
                    Login
                  </Link>
                </li>
              ) : null}
            </ul>
          </nav>
        ) : null}
      </header>

      {isAuthenticated && integrationsOpen ? (
        <IntegrationsModal
          open={integrationsOpen}
          onOpenChange={setIntegrationsOpen}
        />
      ) : null}

      {!isAuthenticated && connectOpen ? (
        <ConnectPlatformsModal
          open={connectOpen}
          onOpenChange={setConnectOpen}
        />
      ) : null}
    </>
  );
}

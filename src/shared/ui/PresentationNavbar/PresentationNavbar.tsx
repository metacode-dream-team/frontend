"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/roadmaps", label: "Roadmaps" },
  { href: "/roadmaps/rm-frontend-core", label: "Roadmap #1" },
  { href: "/feed", label: "Feed" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
  { href: "/forgot-password", label: "Forgot" },
  { href: "/reset-password", label: "Reset" },
  { href: "/verify-email", label: "Verify" },
] as const;

// В development показываем навбар по умолчанию (для презентации MVP).
// Явно выключить: NEXT_PUBLIC_SHOW_NAV=false. Включить в production: NEXT_PUBLIC_SHOW_NAV=true
const SHOW_NAV =
  process.env.NEXT_PUBLIC_SHOW_NAV !== undefined
    ? process.env.NEXT_PUBLIC_SHOW_NAV === "true"
    : process.env.NODE_ENV === "development";

export function PresentationNavbar() {
  const pathname = usePathname();

  if (!SHOW_NAV) return null;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center gap-1 overflow-x-auto border-b border-zinc-200 bg-white/95 px-3 py-2 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95"
        aria-label="Presentation navigation"
      >
        <Link
          href="/"
          className="focus-visible:ring-violet-500/60 flex shrink-0 items-center outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"
          aria-label="MetaCode home"
        >
          <img
            src="/logo.svg"
            alt="MetaCode"
            className="h-6 w-auto"
            width={213}
            height={78}
          />
        </Link>
        <div className="flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              pathname === href ||
              (href !== "/" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`shrink-0 rounded px-2 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </nav>
      {/* Spacer so content is not hidden under fixed navbar */}
      <div className="h-12 shrink-0" aria-hidden />
    </>
  );
}

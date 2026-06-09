"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/entities/auth";
import { useProfileMeStore } from "@/entities/profile";
import { ConnectPlatformsModal, IntegrationsModal } from "@/features/connect-accounts";
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
  const meAvatarUrl = useProfileMeStore((s) => s.profile?.avatarUrl?.trim() ?? "");
  const [connectOpen, setConnectOpen] = useState(false);
  const [integrationsOpen, setIntegrationsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900/80 bg-black">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:h-16 sm:gap-4 sm:px-6">
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
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {isAuthenticated ? (
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-purple-900 text-xs font-bold text-white ring-2 ring-violet-500/40 transition hover:ring-violet-400/60 focus-visible:outline-none focus-visible:ring-violet-300"
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
                    className="absolute right-0 top-11 z-50 min-w-[150px] rounded-xl border border-zinc-800 bg-zinc-950/95 p-1.5 shadow-xl backdrop-blur"
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

      {isAuthenticated && (
        <IntegrationsModal
          open={integrationsOpen}
          onOpenChange={setIntegrationsOpen}
        />
      )}

      {!isAuthenticated && (
        <ConnectPlatformsModal
          open={connectOpen}
          onOpenChange={setConnectOpen}
        />
      )}
    </>
  );
}

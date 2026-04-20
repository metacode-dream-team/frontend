import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="bg-black">
      <div className="h-px w-full bg-zinc-800" />
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <Link
            href="/"
            className="focus-visible:ring-violet-500/60 flex shrink-0 items-center outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            aria-label="MetaCode home"
          >
            <img
              src="/logo.svg"
              alt="MetaCode"
              className="h-7 w-auto md:h-8"
              width={213}
              height={78}
            />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6">
            {FOOTER_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} MetaCode. Your Dev Journey, Visualized.
            </p>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-zinc-600">
              MetaCode is an independent product. GitHub®, LeetCode™, and
              Monkeytype are trademarks of their respective owners.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span>Join 12,000+ developers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

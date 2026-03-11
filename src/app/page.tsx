"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/entities/auth";
import { GamifySection } from "@/widgets/gamify-section";
import { CommandCenterSection } from "@/widgets/command-center-section";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils/cn";

import githubImg from "@/assets/GithubMain.png";
import monkeytypeImg from "@/assets/monkeyMain.png";

const LeetcodeIcon = () => (
  <svg viewBox="0 0 32 32" className="w-6 h-6 shrink-0" fill="white">
    <path d="M21.469 23.907l-3.595 3.473c-0.624 0.625-1.484 0.885-2.432 0.885s-1.807-0.26-2.432-0.885l-5.776-5.812c-0.62-0.625-0.937-1.537-0.937-2.485 0-0.952 0.317-1.812 0.937-2.432l5.76-5.844c0.62-0.619 1.5-0.859 2.448-0.859s1.808 0.26 2.432 0.885l3.595 3.473c0.687 0.688 1.823 0.663 2.536-0.052 0.708-0.713 0.735-1.848 0.047-2.536l-3.473-3.511c-0.901-0.891-2.032-1.505-3.261-1.787l3.287-3.333c0.688-0.687 0.667-1.823-0.047-2.536s-1.849-0.735-2.536-0.052l-13.469 13.469c-1.307 1.312-1.989 3.113-1.989 5.113 0 1.996 0.683 3.86 1.989 5.168l5.797 5.812c1.307 1.307 3.115 1.937 5.115 1.937 1.995 0 3.801-0.683 5.109-1.989l3.479-3.521c0.688-0.683 0.661-1.817-0.052-2.531s-1.849-0.74-2.531-0.052zM27.749 17.349h-13.531c-0.932 0-1.692 0.801-1.692 1.791 0 0.991 0.76 1.797 1.692 1.797h13.531c0.933 0 1.693-0.807 1.693-1.797 0-0.989-0.76-1.791-1.693-1.791z" />
  </svg>
);

const INTEGRATION_CARDS = [
  {
    id: "github",
    title: "GitHub Sync",
    description:
      "Visualize your contributions, languages, and repo velocity in real-time.",
    image: githubImg,
    icon: null,
    alt: "GitHub",
    offset: "translate-x-0",
    overlap: "",
    zIndex: "z-10",
  },
  {
    id: "monkeytype",
    title: "Monkeytype",
    description: "Display your typing speed and accuracy stats on your profile badge.",
    image: monkeytypeImg,
    icon: null,
    alt: "Monkeytype",
    offset: "translate-x-4",
    overlap: "-mt-6",
    zIndex: "z-20",
  },
  {
    id: "leetcode",
    title: "LeetCode Pro",
    description:
      "Track solved problems by difficulty and contest ratings dynamically.",
    image: null,
    icon: LeetcodeIcon,
    alt: "LeetCode",
    offset: "-translate-x-2",
    overlap: "-mt-6",
    zIndex: "z-30",
  },
];

export default function Home() {
  const { isAuthenticated, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Hero: full-width wrapper для градиента */}
      <div className="relative w-full min-h-screen">
        {/* Фиолетовое свечение — на всю ширину экрана */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 100% at 30% 40%, rgba(88, 28, 135, 0.25) 0%, rgba(59, 7, 100, 0.1) 40%, transparent 70%)",
          }}
        />
      <main className="relative flex flex-col min-h-screen items-center justify-center gap-12 px-6 py-16 md:px-12 lg:flex-row lg:justify-between lg:items-center lg:px-24 max-w-7xl mx-auto">
        {/* Left section - Main content */}
        <div className="relative flex flex-col gap-6 max-w-xl z-10 text-center lg:text-left items-center lg:items-start">
          {/* Headline */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Your Dev
            <br />
            Journey,
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-500 to-blue-500 bg-clip-text text-transparent">
              Visualized.
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg text-zinc-300 max-w-md leading-relaxed">
            Connect your GitHub, LeetCode, and Monkeytype accounts. Unlock achievements, track XP,
            and visualize your growth in a futuristic developer command center.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-4 sm:flex-row w-full sm:w-auto justify-center lg:justify-start">
            <Link href={isAuthenticated ? "/dashboard" : "/login"} className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 border-0 text-white! px-8 py-3 text-base font-semibold shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] transition-shadow"
                size="lg"
              >
                {isAuthenticated ? "Open Dashboard" : "Connect Accounts"}
              </Button>
            </Link>
            <Link href="/leaderboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/40 text-white! hover:bg-white/10 hover:border-white/60"
                size="lg"
              >
                See Leaderboard
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-zinc-400">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 w-2 rounded-full border border-zinc-500",
                      i === 1 && "bg-white/80"
                    )}
                  />
                ))}
              </div>
              <span>Join 12,000+ developers</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>4.9/5 satisfaction</span>
            </div>
          </div>

          {isAuthenticated && (
            <Button
              variant="outline"
              onClick={logout}
              className="mt-2 w-fit border-zinc-600 text-zinc-400 hover:text-white text-sm"
              size="sm"
            >
              Logout
            </Button>
          )}
        </div>

        {/* Right section - Integration cards (лёгкое наложение) */}
        <div className="relative z-10 hidden lg:flex flex-col gap-2 w-[260px] flex-shrink-0">
          {INTEGRATION_CARDS.map((card) => (
            <div
              key={card.id}
              className={cn(
                "rounded-xl border border-white/10 bg-transparent backdrop-blur-xl p-3.5 transition-all duration-300 hover:scale-[1.02] relative",
                "ring-1 ring-purple-500/20",
                card.offset,
                card.overlap,
                card.zIndex
              )}
              style={{
                boxShadow: "0 0 30px -10px rgba(88, 28, 135, 0.25), 0 15px 35px -12px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  {card.icon ? (
                    (() => {
                      const Icon = card.icon;
                      return <Icon />;
                    })()
                  ) : (
                    <Image
                      src={card.image}
                      alt={card.alt}
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-white text-base mb-0.5">{card.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: stacked cards с наложением */}
        <div className="relative z-10 flex flex-col gap-2 lg:hidden mt-8 w-full max-w-[280px] mx-auto">
          {INTEGRATION_CARDS.map((card) => (
            <div
              key={card.id}
              className={cn(
                "rounded-xl border border-white/10 bg-transparent backdrop-blur-xl p-3.5 shadow-xl ring-1 ring-purple-500/20 relative",
                card.overlap,
                card.zIndex
              )}
              style={{
                boxShadow: "0 0 25px -8px rgba(88, 28, 135, 0.2)",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                  {card.icon ? (
                    (() => {
                      const Icon = card.icon;
                      return <Icon />;
                    })()
                  ) : (
                    <Image
                      src={card.image}
                      alt={card.alt}
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-white text-base mb-0.5">{card.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      </div>

      <GamifySection />
      <CommandCenterSection />
    </div>
  );
}

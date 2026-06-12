"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/entities/auth";
import { Button } from "@/shared/ui/Button";
import { cn } from "@/shared/lib/utils/cn";

function SectionPlaceholder() {
  return <div className="min-h-[280px] bg-black" aria-hidden />;
}

const HowItWorksSection = dynamic(
  () => import("@/widgets/how-it-works").then((m) => ({ default: m.HowItWorksSection })),
  { loading: () => <SectionPlaceholder /> },
);
const GamifySection = dynamic(
  () => import("@/widgets/gamify-section").then((m) => ({ default: m.GamifySection })),
  { loading: () => <SectionPlaceholder /> },
);
const FeaturesGridSection = dynamic(
  () => import("@/widgets/features-grid").then((m) => ({ default: m.FeaturesGridSection })),
  { loading: () => <SectionPlaceholder /> },
);
const FaqTrustSection = dynamic(
  () => import("@/widgets/faq-trust").then((m) => ({ default: m.FaqTrustSection })),
  { loading: () => <SectionPlaceholder /> },
);

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
      <div className="relative w-full min-h-[85vh] md:min-h-screen">
        {/* Фиолетовое свечение — на всю ширину экрана */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 100% at 30% 40%, rgba(88, 28, 135, 0.25) 0%, rgba(59, 7, 100, 0.1) 40%, transparent 70%)",
          }}
        />
      <main className="relative mx-auto flex min-h-[85vh] max-w-7xl flex-col items-center justify-center gap-12 px-6 pt-12 pb-12 md:min-h-screen md:px-12 md:pt-6 md:pb-14 lg:flex-row lg:items-center lg:justify-between lg:px-24">
        {/* Left section - Main content */}
        <div className="relative flex flex-col gap-6 max-w-xl z-10 text-center lg:text-left items-center lg:items-start">
          {/* Headline */}
          <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Your Dev
            <br />
            Journey,
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-violet-500 to-blue-500 bg-clip-text text-transparent">
              Visualized.
            </span>
          </h1>

          {/* Description */}
          <p className="max-w-md text-sm leading-relaxed text-zinc-300 md:text-base">
            Connect your GitHub, LeetCode, and Monkeytype accounts. Unlock achievements, keep your
            streak alive, and visualize your growth in one profile.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col gap-3 sm:flex-row w-full sm:w-auto justify-center lg:justify-start">
            <Link href={isAuthenticated ? "/profile" : "/login"} className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto border-0 bg-gradient-to-r from-purple-500 to-violet-500 px-5 py-2.5 text-sm font-semibold text-white! shadow-[0_0_15px_rgba(168,85,247,0.5)] transition-shadow hover:from-purple-400 hover:to-violet-400 hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] md:px-7 md:py-3 md:text-base"
                size="md"
              >
                {isAuthenticated ? "View Profile" : "Connect Accounts"}
              </Button>
            </Link>
            <Link href="/leaderboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-white/40 px-5 py-2.5 text-sm text-white! hover:border-white/60 hover:bg-white/10 md:px-6 md:py-3 md:text-base"
                size="md"
              >
                See Leaderboard
              </Button>
            </Link>
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

        {/* Mobile: stacked integration cards */}
        <div className="relative z-10 mx-auto mt-8 flex w-full max-w-[320px] flex-col gap-2 lg:hidden">
          {INTEGRATION_CARDS.map((card) => (
            <div
              key={card.id}
              className={cn(
                "relative rounded-xl border border-white/10 bg-transparent p-4 shadow-xl ring-1 ring-purple-500/20 backdrop-blur-xl",
                card.overlap,
                card.zIndex,
              )}
              style={{
                boxShadow: "0 0 25px -8px rgba(88, 28, 135, 0.2)",
              }}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  {card.icon ? (
                    (() => {
                      const Icon = card.icon;
                      return <Icon />;
                    })()
                  ) : (
                    <Image
                      src={card.image!}
                      alt={card.alt}
                      width={36}
                      height={36}
                      className="object-contain"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="mb-0.5 text-base font-bold text-white">{card.title}</h3>
                  <p className="text-xs leading-relaxed text-zinc-400">{card.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
      </div>

      <HowItWorksSection />
      <GamifySection />
      <FeaturesGridSection />
      <FaqTrustSection />
    </div>
  );
}

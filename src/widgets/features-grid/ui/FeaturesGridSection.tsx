"use client";

import Link from "next/link";
import { MobileCarousel } from "@/shared/ui/MobileCarousel";

const CARD_STYLE =
  "block rounded-2xl border border-zinc-800/80 bg-neutral-900/50 p-6 backdrop-blur-xl transition-colors hover:border-zinc-700";

const FEATURES = [
  {
    id: "profile",
    title: "Unified Profile",
    description:
      "GitHub, LeetCode, and Monkeytype stats in one dashboard — no switching between apps.",
    href: "/profile",
    label: "One place for everything",
  },
  {
    id: "roadmaps",
    title: "Roadmaps",
    description:
      "Structured learning paths with progress tracking — frontend, algorithms, interviews, and more.",
    href: "/roadmaps",
    label: "Learn with direction",
  },
  {
    id: "leaderboard",
    title: "Leaderboard",
    description:
      "See where you stand among developers ranked by real activity across connected platforms.",
    href: "/leaderboard",
    label: "Compete and grow",
  },
  {
    id: "discussions",
    title: "Discussions",
    description:
      "Share progress, ask questions, and follow threads around commits, solves, and practice.",
    href: "/feed",
    label: "Community around code",
  },
] as const;

function FeatureCard({ feature }: { feature: (typeof FEATURES)[number] }) {
  return (
    <Link href={feature.href} className={`group ${CARD_STYLE}`}>
      <span className="inline-flex rounded-full bg-violet-600/20 px-3 py-1 text-xs font-semibold text-violet-300">
        {feature.label}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-white">{feature.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{feature.description}</p>
      <span className="mt-4 inline-flex text-sm font-medium text-zinc-500 transition-colors group-hover:text-violet-300">
        Explore →
      </span>
    </Link>
  );
}

export function FeaturesGridSection() {
  return (
    <section className="bg-black px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">What makes us different?</h2>
          <p className="mt-3 text-zinc-400">
            More than a tracker — profiles, paths, rankings, and community in one platform.
          </p>
        </div>

        <MobileCarousel breakpoint="sm">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </MobileCarousel>

        <div className="hidden gap-6 sm:grid sm:grid-cols-2">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

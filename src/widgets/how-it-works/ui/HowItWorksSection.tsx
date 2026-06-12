"use client";

import { Fragment } from "react";
import { MobileCarousel } from "@/shared/ui/MobileCarousel";

const STEPS = [
  {
    step: "01",
    title: "Connect your accounts",
    description:
      "Link GitHub, LeetCode, and Monkeytype in a few clicks. We pull your public activity — no manual logging.",
  },
  {
    step: "02",
    title: "Track activity automatically",
    description:
      "Commits, solved problems, and typing sessions sync into one profile with heatmaps, stats, and achievements.",
  },
  {
    step: "03",
    title: "Grow and compete",
    description:
      "Keep your daily streak alive, unlock badges, follow roadmaps, and climb the developer leaderboard.",
  },
] as const;

const CARD_CLASS =
  "rounded-2xl border border-zinc-800/80 bg-neutral-900/50 p-6 backdrop-blur-xl";

function StepCard({ item }: { item: (typeof STEPS)[number] }) {
  return (
    <article className={CARD_CLASS}>
      <span className="inline-flex rounded-full bg-violet-600/20 px-3 py-1 text-xs font-semibold text-violet-300">
        Step {item.step}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.description}</p>
    </article>
  );
}

function StepArrow() {
  return (
    <li
      className="hidden list-none items-center justify-center px-2 md:flex md:self-center"
      aria-hidden
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-zinc-600"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </li>
  );
}

export function HowItWorksSection() {
  return (
    <section className="bg-black px-6 pt-16 pb-24 text-white md:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">How it works</h2>
          <p className="mt-3 text-zinc-400">
            Three steps from scattered tools to one clear picture of your progress.
          </p>
        </div>

        <MobileCarousel breakpoint="md">
          {STEPS.map((item) => (
            <StepCard key={item.step} item={item} />
          ))}
        </MobileCarousel>

        <ol className="hidden gap-6 md:flex md:flex-row md:items-stretch">
          {STEPS.map((item, index) => (
            <Fragment key={item.step}>
              <li className={`flex-1 ${CARD_CLASS}`}>
                <span className="inline-flex rounded-full bg-violet-600/20 px-3 py-1 text-xs font-semibold text-violet-300">
                  Step {item.step}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.description}</p>
              </li>
              {index < STEPS.length - 1 ? <StepArrow /> : null}
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  );
}
